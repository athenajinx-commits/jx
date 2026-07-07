/* ORBIT — a tiny gravity sandbox. Vanilla JS, no dependencies. */
(() => {
  'use strict';

  // ---------- canvas setup ----------
  const starsCv = document.getElementById('stars');
  const trailCv = document.getElementById('trails');
  const mainCv = document.getElementById('main');
  const starsCx = starsCv.getContext('2d');
  const trailCx = trailCv.getContext('2d');
  const mainCx = mainCv.getContext('2d');

  let W = 0, H = 0, DPR = 1;

  function resize() {
    const prevW = W, prevH = H;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    for (const [cv, cx] of [[starsCv, starsCx], [trailCv, trailCx], [mainCv, mainCx]]) {
      cv.width = W * DPR;
      cv.height = H * DPR;
      cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    // keep the system centered when the window changes shape
    if (prevW && prevH) {
      const dx = (W - prevW) / 2, dy = (H - prevH) / 2;
      for (const b of bodies) { b.x += dx; b.y += dy; }
    }
    paintStars();
  }

  function paintStars() {
    starsCx.clearRect(0, 0, W, H);
    const grad = starsCx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
    grad.addColorStop(0, '#0a0f26');
    grad.addColorStop(1, '#04060f');
    starsCx.fillStyle = grad;
    starsCx.fillRect(0, 0, W, H);
    const n = Math.floor((W * H) / 3200);
    for (let i = 0; i < n; i++) {
      const x = Math.random() * W, y = Math.random() * H;
      const r = Math.random() < 0.92 ? Math.random() * 0.9 + 0.2 : Math.random() * 1.6 + 0.8;
      const a = Math.random() * 0.55 + 0.12;
      const tint = Math.random();
      starsCx.fillStyle = tint < 0.15 ? `rgba(255,214,170,${a})`
                        : tint < 0.3  ? `rgba(170,190,255,${a})`
                        : `rgba(225,232,255,${a})`;
      starsCx.beginPath();
      starsCx.arc(x, y, r, 0, Math.PI * 2);
      starsCx.fill();
    }
  }

  // ---------- state ----------
  const G_BASE = 300;
  const SUN_MASS = 12000;
  const YEAR_SECONDS = 8; // 1 "year" of sim time

  let bodies = [];      // {x,y,vx,vy,mass,r,hue,isSun}
  let particles = [];   // {x,y,vx,vy,life,maxLife,hue,size}
  let gravityMul = 1;
  let timeScale = 1;
  let trailsOn = true;
  let paused = false;
  let simTime = 0;
  const stats = { launched: 0, eaten: 0, escaped: 0 };
  let drag = null;      // {x0,y0,x1,y1}

  const radiusFor = m => Math.max(2.2, 2.4 * Math.cbrt(m));

  function makeBody(x, y, vx, vy, mass, hue, isSun = false) {
    return { x, y, vx, vy, mass, hue, isSun, r: isSun ? 26 : radiusFor(mass) };
  }

  function circularSpeed(centralMass, dist) {
    return Math.sqrt(G_BASE * gravityMul * centralMass / dist);
  }

  // ---------- presets ----------
  function clearTrails() { trailCx.clearRect(0, 0, W, H); }

  function presetSerene() {
    bodies = [makeBody(W / 2, H / 2, 0, 0, SUN_MASS, 42, true)];
    const radii = [130, 195, 270, 360];
    for (const rr of radii) {
      const a = Math.random() * Math.PI * 2;
      const v = circularSpeed(SUN_MASS, rr) * (0.97 + Math.random() * 0.06);
      bodies.push(makeBody(
        W / 2 + Math.cos(a) * rr, H / 2 + Math.sin(a) * rr,
        -Math.sin(a) * v, Math.cos(a) * v,
        8 + Math.random() * 26, Math.random() * 360
      ));
    }
    clearTrails();
  }

  function presetBinary() {
    const m = SUN_MASS * 0.55, d = 300;
    // circular two-body orbit about the barycenter
    const v = m * Math.sqrt(G_BASE * gravityMul / (d * (m + m)));
    const s1 = makeBody(W / 2 - d / 2, H / 2, 0, -v, m, 42, true);
    const s2 = makeBody(W / 2 + d / 2, H / 2, 0, v, m, 18, true);
    s1.r = s2.r = 20;
    bodies = [s1, s2];
    // one brave circumbinary planet
    const rr = 430, vv = circularSpeed(2 * m, rr);
    bodies.push(makeBody(W / 2, H / 2 - rr, vv, 0, 20, 200));
    clearTrails();
  }

  function presetChaos() {
    bodies = [makeBody(W / 2, H / 2, 0, 0, SUN_MASS, 42, true)];
    for (let i = 0; i < 16; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = 90 + Math.random() * 340;
      const v = circularSpeed(SUN_MASS, rr) * (0.55 + Math.random() * 0.9);
      const tilt = a + Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      bodies.push(makeBody(
        W / 2 + Math.cos(a) * rr, H / 2 + Math.sin(a) * rr,
        Math.cos(tilt) * v, Math.sin(tilt) * v,
        4 + Math.random() * 18, Math.random() * 360
      ));
    }
    clearTrails();
  }

  // ---------- sound ----------
  const Sound = {
    ctx: null,
    on: true,
    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    blip(freq, dur, type = 'triangle', vol = 0.08) {
      if (!this.on || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.4), t + dur);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0004, t + dur);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },
    launch(mass) { this.blip(560 - Math.min(mass, 60) * 5, 0.22, 'triangle', 0.07); },
    merge() { this.blip(150, 0.35, 'sine', 0.1); },
    absorb() { this.blip(70, 0.6, 'sawtooth', 0.09); },
  };

  // ---------- effects ----------
  function burst(x, y, hue, count, speed) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.3 + Math.random());
      particles.push({
        x, y,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        life: 0, maxLife: 0.4 + Math.random() * 0.7,
        hue, size: 0.8 + Math.random() * 1.8,
      });
    }
  }

  // ---------- physics ----------
  function accelerate(dt) {
    const G = G_BASE * gravityMul;
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d2 = dx * dx + dy * dy + 40; // softening avoids singularities
        const d = Math.sqrt(d2);
        const f = G / (d2 * d);
        a.vx += f * b.mass * dx * dt; a.vy += f * b.mass * dy * dt;
        b.vx -= f * a.mass * dx * dt; b.vy -= f * a.mass * dy * dt;
      }
    }
  }

  function collide() {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], b = bodies[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const rr = a.r + b.r;
        if (dx * dx + dy * dy >= rr * rr) continue;
        const [big, small] = a.mass >= b.mass ? [a, b] : [b, a];
        const m = big.mass + small.mass;
        big.vx = (big.vx * big.mass + small.vx * small.mass) / m;
        big.vy = (big.vy * big.mass + small.vy * small.mass) / m;
        if (!big.isSun) {
          big.x = (big.x * big.mass + small.x * small.mass) / m;
          big.y = (big.y * big.mass + small.y * small.mass) / m;
          big.mass = m;
          big.r = radiusFor(m);
        }
        if (big.isSun && !small.isSun) {
          stats.eaten++;
          burst(small.x, small.y, 42, 30, 160);
          Sound.absorb();
        } else {
          burst(small.x, small.y, small.hue, 18, 110);
          Sound.merge();
        }
        bodies.splice(bodies.indexOf(small), 1);
        j--;
      }
    }
  }

  function step(dt) {
    const SUB = 4;
    const h = dt / SUB;
    for (let s = 0; s < SUB; s++) {
      accelerate(h);
      for (const b of bodies) { b.x += b.vx * h; b.y += b.vy * h; }
      collide();
    }
    // cull escapees
    const cx = W / 2, cy = H / 2;
    const limit = Math.max(W, H) * 2.2;
    for (let i = bodies.length - 1; i >= 0; i--) {
      const b = bodies[i];
      if (!b.isSun && Math.hypot(b.x - cx, b.y - cy) > limit) {
        bodies.splice(i, 1);
        stats.escaped++;
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.985;
      p.vy *= 0.985;
    }
    simTime += dt;
  }

  // ---------- trajectory prediction ----------
  function predict(x, y, vx, vy) {
    const G = G_BASE * gravityMul;
    const pts = [];
    const h = 1 / 90;
    let px = x, py = y, pvx = vx, pvy = vy;
    for (let i = 0; i < 720; i++) {
      for (const b of bodies) {
        const dx = b.x - px, dy = b.y - py;
        const d2 = dx * dx + dy * dy + 40;
        const d = Math.sqrt(d2);
        const f = G * b.mass / (d2 * d);
        pvx += f * dx * h;
        pvy += f * dy * h;
        if (d < b.r + 3) return { pts, hit: { x: px, y: py } };
      }
      px += pvx * h;
      py += pvy * h;
      if (i % 6 === 0) pts.push([px, py]);
    }
    return { pts, hit: null };
  }

  // ---------- drawing ----------
  function drawTrails(dt) {
    // fade previous trails toward transparent
    trailCx.globalCompositeOperation = 'destination-out';
    trailCx.fillStyle = `rgba(0,0,0,${Math.min(1, 1.1 * dt)})`;
    trailCx.fillRect(0, 0, W, H);
    trailCx.globalCompositeOperation = 'source-over';
    if (!trailsOn) return;
    for (const b of bodies) {
      if (b.isSun) continue;
      trailCx.strokeStyle = `hsla(${b.hue},90%,66%,0.55)`;
      trailCx.lineWidth = Math.min(3, Math.max(1, b.r * 0.35));
      trailCx.lineCap = 'round';
      trailCx.beginPath();
      trailCx.moveTo(b.px ?? b.x, b.py ?? b.y);
      trailCx.lineTo(b.x, b.y);
      trailCx.stroke();
    }
    for (const b of bodies) { b.px = b.x; b.py = b.y; }
  }

  function drawSun(b, t) {
    const pulse = 1 + 0.035 * Math.sin(t * 2.1 + b.x * 0.01);
    const r = b.r * pulse;
    const glow = mainCx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r * 6);
    glow.addColorStop(0, 'rgba(255,190,90,0.5)');
    glow.addColorStop(0.25, 'rgba(255,150,60,0.16)');
    glow.addColorStop(1, 'rgba(255,120,40,0)');
    mainCx.fillStyle = glow;
    mainCx.beginPath();
    mainCx.arc(b.x, b.y, r * 6, 0, Math.PI * 2);
    mainCx.fill();

    const core = mainCx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    core.addColorStop(0, '#fffbe8');
    core.addColorStop(0.55, '#ffd873');
    core.addColorStop(1, '#ff9640');
    mainCx.fillStyle = core;
    mainCx.beginPath();
    mainCx.arc(b.x, b.y, r, 0, Math.PI * 2);
    mainCx.fill();
  }

  function drawPlanet(b) {
    const g = mainCx.createRadialGradient(
      b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.15,
      b.x, b.y, b.r
    );
    g.addColorStop(0, `hsl(${b.hue},85%,80%)`);
    g.addColorStop(0.7, `hsl(${b.hue},75%,55%)`);
    g.addColorStop(1, `hsl(${b.hue},70%,32%)`);
    mainCx.fillStyle = g;
    mainCx.beginPath();
    mainCx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    mainCx.fill();
  }

  function drawFrame(t) {
    mainCx.clearRect(0, 0, W, H);

    // aim line + predicted path while dragging
    if (drag) {
      const vx = (drag.x1 - drag.x0) * 2.2;
      const vy = (drag.y1 - drag.y0) * 2.2;
      mainCx.strokeStyle = 'rgba(180,200,255,0.4)';
      mainCx.lineWidth = 1;
      mainCx.setLineDash([4, 5]);
      mainCx.beginPath();
      mainCx.moveTo(drag.x0, drag.y0);
      mainCx.lineTo(drag.x1, drag.y1);
      mainCx.stroke();
      mainCx.setLineDash([]);

      const { pts, hit } = predict(drag.x0, drag.y0, vx, vy);
      for (let i = 0; i < pts.length; i++) {
        const a = 0.65 * (1 - i / pts.length);
        mainCx.fillStyle = `rgba(160,190,255,${a})`;
        mainCx.beginPath();
        mainCx.arc(pts[i][0], pts[i][1], 1.6, 0, Math.PI * 2);
        mainCx.fill();
      }
      if (hit) {
        mainCx.strokeStyle = 'rgba(255,160,90,0.9)';
        mainCx.lineWidth = 1.5;
        const s = 5;
        mainCx.beginPath();
        mainCx.moveTo(hit.x - s, hit.y - s); mainCx.lineTo(hit.x + s, hit.y + s);
        mainCx.moveTo(hit.x + s, hit.y - s); mainCx.lineTo(hit.x - s, hit.y + s);
        mainCx.stroke();
      }
      // the planet-to-be
      mainCx.fillStyle = 'rgba(200,215,255,0.9)';
      mainCx.beginPath();
      mainCx.arc(drag.x0, drag.y0, 4, 0, Math.PI * 2);
      mainCx.fill();
    }

    mainCx.globalCompositeOperation = 'lighter';
    for (const p of particles) {
      const a = 1 - p.life / p.maxLife;
      mainCx.fillStyle = `hsla(${p.hue},95%,70%,${a * 0.9})`;
      mainCx.beginPath();
      mainCx.arc(p.x, p.y, p.size * a + 0.4, 0, Math.PI * 2);
      mainCx.fill();
    }
    mainCx.globalCompositeOperation = 'source-over';

    for (const b of bodies) b.isSun ? drawSun(b, t) : drawPlanet(b);
  }

  // ---------- HUD ----------
  const $ = id => document.getElementById(id);
  const el = {
    bodies: $('stat-bodies'), launched: $('stat-launched'),
    eaten: $('stat-eaten'), escaped: $('stat-escaped'), years: $('stat-years'),
  };
  function updateStats() {
    el.bodies.textContent = bodies.filter(b => !b.isSun).length;
    el.launched.textContent = stats.launched;
    el.eaten.textContent = stats.eaten;
    el.escaped.textContent = stats.escaped;
    el.years.textContent = (simTime / YEAR_SECONDS).toFixed(1);
  }

  // ---------- input ----------
  function canvasPoint(e) {
    return { x: e.clientX, y: e.clientY };
  }

  mainCv.addEventListener('pointerdown', e => {
    Sound.ensure();
    const p = canvasPoint(e);
    drag = { x0: p.x, y0: p.y, x1: p.x, y1: p.y };
    mainCv.setPointerCapture(e.pointerId);
  });
  mainCv.addEventListener('pointermove', e => {
    if (!drag) return;
    const p = canvasPoint(e);
    drag.x1 = p.x;
    drag.y1 = p.y;
  });
  mainCv.addEventListener('pointerup', e => {
    if (!drag) return;
    const vx = (drag.x1 - drag.x0) * 2.2;
    const vy = (drag.y1 - drag.y0) * 2.2;
    const mass = 5 + Math.random() * 30;
    bodies.push(makeBody(drag.x0, drag.y0, vx, vy, mass, Math.random() * 360));
    stats.launched++;
    Sound.launch(mass);
    drag = null;
    document.getElementById('hint').classList.add('hidden');
  });
  mainCv.addEventListener('pointercancel', () => { drag = null; });

  // ---------- controls ----------
  $('ctl-gravity').addEventListener('input', e => { gravityMul = +e.target.value; });
  $('ctl-speed').addEventListener('input', e => { timeScale = +e.target.value; });
  $('btn-serene').addEventListener('click', presetSerene);
  $('btn-binary').addEventListener('click', presetBinary);
  $('btn-chaos').addEventListener('click', presetChaos);
  $('btn-clear').addEventListener('click', () => {
    bodies = bodies.filter(b => b.isSun);
    particles = [];
    clearTrails();
  });
  $('btn-trails').addEventListener('click', e => {
    trailsOn = !trailsOn;
    e.target.classList.toggle('on', trailsOn);
    if (!trailsOn) clearTrails();
  });
  $('btn-sound').addEventListener('click', e => {
    Sound.ensure();
    Sound.on = !Sound.on;
    e.target.classList.toggle('on', Sound.on);
  });
  function togglePause() {
    paused = !paused;
    document.body.classList.toggle('paused', paused);
  }
  $('btn-pause').addEventListener('click', togglePause);
  window.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      togglePause();
    }
  });

  // ---------- main loop ----------
  let lastT = performance.now();
  function frame(now) {
    const rawDt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    const dt = rawDt * timeScale;
    if (!paused && dt > 0) {
      step(dt);
      drawTrails(rawDt);
    }
    drawFrame(now / 1000);
    updateStats();
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  presetSerene();
  requestAnimationFrame(frame);
})();
