"use strict";

(async () => {
  const slidesEl = document.getElementById("slides");
  const dotsEl = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  const magnifyOverlay = document.getElementById("magnifyOverlay");
  const magnifyBox = document.getElementById("magnifyBox");
  const magnifyInner = document.getElementById("magnifyInner");

  const RECT_W = 525;
  const RECT_H = 125;
  const ZOOM = 2;

  let data;
  try {
    const res = await fetch("content.json");
    data = await res.json();
  } catch (err) {
    slidesEl.innerHTML = `<div class="slide active"><p class="body-text">Could not load content.json — this page must be served over HTTP (e.g. <code>python -m http.server</code>), not opened directly as a file.</p></div>`;
    return;
  }

  document.title = data.meta.deckTitle || document.title;

  const slides = data.slides;
  let current = 0;

  function renderSlide(slide) {
    if (slide.kind === "title") {
      return `
        <div class="eyebrow">${slide.eyebrow || ""}</div>
        <h1>${slide.heading}</h1>
        <p class="subheading">${slide.subheading || ""}</p>
        <p class="body-text">${slide.body || ""}</p>
        <div class="brand-mark"><strong>${data.meta.brand}</strong> &middot; ${data.meta.presenter}</div>
      `;
    }

    if (slide.kind === "content") {
      const bullets = (slide.bullets || []).map(b => `<li>${b}</li>`).join("");
      return `
        <div class="text-col">
          <div class="eyebrow">${slide.eyebrow || ""}</div>
          <h1>${slide.heading}</h1>
          <ul>${bullets}</ul>
        </div>
        <div class="shot-frame">
          <div class="shot-chrome"><span></span><span></span><span></span></div>
          <img src="${slide.image}" alt="${slide.imageAlt || ""}">
          <div class="shot-caption">${slide.imageCaption || ""}</div>
        </div>
      `;
    }

    if (slide.kind === "proof") {
      const stats = (slide.stats || []).map(s => `
        <div class="stat">
          <div class="value">${s.value}</div>
          <div class="label">${s.label}</div>
        </div>
      `).join("");
      const logos = (slide.logos || []).map(l => `<span>${l}</span>`).join("");
      const q = slide.quote || {};
      return `
        <div class="eyebrow">${slide.eyebrow || ""}</div>
        <h1>${slide.heading}</h1>
        <div class="stat-row">${stats}</div>
        <div class="quote-block">
          ${q.image ? `<img src="${q.image}" alt="${q.attribution || ""}">` : ""}
          <div>
            <blockquote>&ldquo;${q.text}&rdquo;</blockquote>
            <cite>${q.attribution || ""}</cite>
          </div>
        </div>
        <div class="logo-row">${logos}</div>
        ${slide.cta ? `<div class="cta">${slide.cta}</div>` : ""}
      `;
    }

    return "";
  }

  slidesEl.innerHTML = slides.map((slide, i) => `
    <div class="slide slide-${slide.kind} ${i === 0 ? "active" : ""}" data-index="${i}">
      ${renderSlide(slide)}
    </div>
  `).join("");

  dotsEl.innerHTML = slides.map((_, i) =>
    `<div class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></div>`
  ).join("");

  const slideNodes = [...slidesEl.querySelectorAll(".slide")];
  const dotNodes = [...dotsEl.querySelectorAll(".dot")];

  function updateNav() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
    progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  }

  function goTo(index) {
    if (index < 0 || index >= slides.length || index === current) return;
    const direction = index > current ? "left" : "right";
    slideNodes[current].classList.remove("active");
    if (direction === "left") slideNodes[current].classList.add("exit-left");
    slideNodes.forEach(n => { if (n !== slideNodes[current]) n.classList.remove("exit-left"); });

    current = index;
    slideNodes[current].classList.remove("exit-left");
    slideNodes[current].classList.add("active");

    dotNodes.forEach((d, i) => d.classList.toggle("active", i === current));
    updateNav();
    closeMagnify();
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));
  dotNodes.forEach(d => d.addEventListener("click", () => goTo(Number(d.dataset.index))));

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "Escape") closeMagnify();
  });

  /* ---------- Press-and-drag magnify ---------- */

  let dragging = false;
  let sourceRect = null;

  function startMagnify(slideEl, clientX, clientY) {
    sourceRect = slideEl.getBoundingClientRect();

    magnifyInner.innerHTML = "";
    const clone = slideEl.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.inset = "auto";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.margin = "0";
    clone.style.transform = "none";
    clone.style.opacity = "1";
    clone.style.pointerEvents = "none";
    clone.style.width = sourceRect.width + "px";
    clone.style.height = sourceRect.height + "px";
    magnifyInner.appendChild(clone);
    magnifyInner.style.width = sourceRect.width + "px";
    magnifyInner.style.height = sourceRect.height + "px";

    const boxW = RECT_W * ZOOM;
    const boxH = RECT_H * ZOOM;
    magnifyBox.style.width = boxW + "px";
    magnifyBox.style.height = boxH + "px";

    magnifyOverlay.classList.add("visible");
    positionMagnify(clientX, clientY);
  }

  function positionMagnify(clientX, clientY) {
    if (!sourceRect) return;
    const lx = clientX - sourceRect.left;
    const ly = clientY - sourceRect.top;
    magnifyInner.style.transform = `translate(${-lx * ZOOM}px, ${-ly * ZOOM}px) scale(${ZOOM})`;

    const boxW = RECT_W * ZOOM;
    const boxH = RECT_H * ZOOM;
    let boxLeft = Math.min(Math.max(clientX, 12), window.innerWidth - boxW - 12);
    let boxTop = Math.min(Math.max(clientY, 12), window.innerHeight - boxH - 12);
    magnifyBox.style.left = boxLeft + "px";
    magnifyBox.style.top = boxTop + "px";
  }

  function closeMagnify() {
    dragging = false;
    sourceRect = null;
    magnifyOverlay.classList.remove("visible");
    magnifyInner.innerHTML = "";
  }

  slidesEl.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;
    const slideEl = slideNodes[current];
    if (!slideEl.contains(e.target)) return;
    dragging = true;
    startMagnify(slideEl, e.clientX, e.clientY);
    try { slidesEl.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
  });

  slidesEl.addEventListener("pointermove", e => {
    if (!dragging) return;
    positionMagnify(e.clientX, e.clientY);
  });

  slidesEl.addEventListener("pointerup", () => { if (dragging) closeMagnify(); });
  slidesEl.addEventListener("pointercancel", () => { if (dragging) closeMagnify(); });

  window.addEventListener("resize", closeMagnify);

  updateNav();
})();
