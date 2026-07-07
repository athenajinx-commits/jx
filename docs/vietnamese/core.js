/* Tiếng Việt Quest — shared engine: word list, Telex IME, audio, state,
   XP/streak/badges, toasts, theme. Load data.js before this file. */
"use strict";

/* ---------- word list ---------- */
const VOCAB_RAW = window.TVQ_DATA.vocab;
const PHRASES = window.TVQ_DATA.phrases.map(([w, m, cat]) => ({ id: "p:" + w, w, m, cat }));
const GRAMMAR = window.TVQ_DATA.grammar;
const LEVELS = ["A1", "A2", "B1"];
const LEVEL_NAMES = { A1: "Beginner", A2: "Elementary", B1: "Intermediate" };
const WORDS = [];
for (const lv of LEVELS) for (const [w, m] of VOCAB_RAW[lv]) WORDS.push({ id: w, w, m, lv });
const WORD_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));

/* =====================================================================
   TELEX IME — plain letters → Vietnamese
   aa→â ee→ê oo→ô aw→ă ow→ơ uw/w→ư dd→đ · tones: s´ f` r̉ x˜ ẹj · z clears
   ===================================================================== */
/*IME-START*/
const TONE_KEYS = { f: 1, s: 2, r: 3, x: 4, j: 5 };
const TONE_TABLE = {
  a: "aàáảãạ", "ă": "ăằắẳẵặ", "â": "âầấẩẫậ",
  e: "eèéẻẽẹ", "ê": "êềếểễệ",
  i: "iìíỉĩị",
  o: "oòóỏõọ", "ô": "ôồốổỗộ", "ơ": "ơờớởỡợ",
  u: "uùúủũụ", "ư": "ưừứửữự",
  y: "yỳýỷỹỵ"
};
const UNTONE = {};                       // toned char → [base char, tone 1-5]
for (const [base, row] of Object.entries(TONE_TABLE))
  [...row].forEach((ch, t) => { if (t) UNTONE[ch] = [base, t]; });
const VOWELS = new Set(Object.keys(TONE_TABLE));
const CIRCUMFLEX = { a: "â", e: "ê", o: "ô" };
const HORN = { a: "ă", u: "ư" };         // o handled separately (uo+w → ươ)
const MODIFIED = "ăâêôơư";

/** Convert one Telex-typed syllable (letters only) to Vietnamese. */
function telexSyllable(token) {
  const out = [];
  let tone = 0;
  for (let ch of token) {
    if (UNTONE[ch]) { tone = UNTONE[ch][1]; ch = UNTONE[ch][0]; }  // re-processing already-toned text
    const prev = out[out.length - 1];
    if (ch === "d" && prev === "d") { out[out.length - 1] = "đ"; continue; }
    if (CIRCUMFLEX[ch] && prev === ch) { out[out.length - 1] = CIRCUMFLEX[ch]; continue; }
    if (ch === "w") {
      if (prev === "o") {
        out[out.length - 1] = "ơ";
        if (out[out.length - 2] === "u") out[out.length - 2] = "ư";   // uow → ươ
      }
      else if (HORN[prev]) out[out.length - 1] = HORN[prev];
      else if (prev === "ư" || prev === "ơ" || prev === "ă") { /* repeated w — ignore */ }
      else out.push("ư");
      continue;
    }
    const hasVowel = out.some(c => VOWELS.has(c));
    if (TONE_KEYS[ch] !== undefined && hasVowel) { tone = TONE_KEYS[ch]; continue; }
    if (ch === "z" && hasVowel) { tone = 0; continue; }
    out.push(ch);
  }
  return placeTone(out, tone);
}

/** Put the tone mark on the right vowel (traditional placement: hòa, thủy, khỏe). */
function placeTone(chars, tone) {
  if (tone) {
    const vs = [];
    for (let i = 0; i < chars.length; i++) {
      if (!VOWELS.has(chars[i])) continue;
      if (chars[i] === "u" && chars[i - 1] === "q") continue;        // qu- is the onset
      vs.push(i);
    }
    if (chars[0] === "g" && vs.length > 1 && vs[0] === 1 && chars[1] === "i")
      vs.shift();                                                    // gi- is the onset (già, giờ)
    if (vs.length) {
      let at = -1;
      for (const i of vs) if (MODIFIED.includes(chars[i])) at = i;   // ê ô ơ â ă ư win (rightmost)
      if (at < 0) {
        const last = vs[vs.length - 1];
        const hasFinal = last < chars.length - 1;                    // consonant after the vowels
        at = (hasFinal || vs.length === 1) ? last : vs[vs.length - 2];
      }
      chars[at] = TONE_TABLE[chars[at]][tone];
    }
  }
  return chars.join("");
}

/** Convert every letter-run in a string; leaves spaces & punctuation alone. */
function telexConvert(str) {
  return str.replace(/[a-zA-ZÀ-ɏḀ-ỿ]+/g, tok => telexSyllable(tok.toLowerCase()));
}
/*IME-END*/

/** Live-convert an input's value as the user types. */
function wireTelexInput(input) {
  input.addEventListener("input", () => {
    const v = telexConvert(input.value.normalize("NFC"));
    if (v !== input.value) input.value = v;
  });
}
function finalizeTelex(value) {
  return telexConvert(value.normalize("NFC")).trim();
}

/* answer comparison: case, punctuation and spacing don't matter */
const vnNorm = s => s.normalize("NFC").toLowerCase()
  .replace(/[.,!?…;:'"“”‘’]/g, "").replace(/\s+/g, " ").trim();
/* diacritic-blind form — used to say "letters right, marks wrong" */
const vnFlat = s => vnNorm(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

/* =====================================================================
   AUDIO — speech synthesis + tiny sound effects
   ===================================================================== */
let viVoice = null;
function pickVoice() {
  const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  viVoice = vs.find(v => v.lang.replace("_", "-").toLowerCase().startsWith("vi")) || null;
  const el = document.getElementById("voiceStatus");
  if (el) el.textContent = viVoice
    ? `🗣️ Vietnamese voice: ${viVoice.name}`
    : "⚠️ No Vietnamese voice found in this browser — audio features will be limited. Microsoft Edge usually includes one.";
}
if (window.speechSynthesis) {
  speechSynthesis.onvoiceschanged = pickVoice;
  pickVoice();
}
function speakWord(w, rateMul = 1) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(w.w);
  u.lang = "vi-VN";
  if (viVoice) u.voice = viVoice;
  u.rate = state.settings.rate * rateMul;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  state.stats.listens++;
}
function speakText(vn, rateMul = 1) {
  speakWord({ w: vn }, rateMul);
}

let audioCtx = null;
function sfx(kind) {
  if (!state.settings.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [[660, 0, 0.09], [880, 0.09, 0.14]],
                    bad: [[180, 0, 0.22]],
                    levelup: [[523, 0, 0.12], [659, 0.12, 0.12], [784, 0.24, 0.12], [1047, 0.36, 0.25]],
                    badge: [[784, 0, 0.1], [1047, 0.1, 0.2]] }[kind] || [];
    for (const [freq, at, dur] of notes) {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = kind === "bad" ? "sawtooth" : "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + at);
      g.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + at + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + at + dur);
      o.connect(g).connect(audioCtx.destination);
      o.start(audioCtx.currentTime + at);
      o.stop(audioCtx.currentTime + at + dur + 0.05);
    }
  } catch (e) { /* audio unavailable — stay silent */ }
}

/* =====================================================================
   STATE — autosaved to localStorage, portable via JSON export/import
   ===================================================================== */
const SAVE_KEY = "tiengVietQuestV1";
const defaultState = () => ({
  version: 1, xp: 0, streak: 0, lastActive: null, bestCombo: 0,
  stats: { cards: 0, quizzes: 0, perfect: 0, quizQ: 0, quizCorrect: 0,
           typed: 0, typedCorrect: 0, listens: 0, phrases: 0, drills: 0 },
  srs: {},                      // id → {b: box 0-6, d: due epoch-ms, s: seen, c: correct}
  badges: [],
  settings: { sound: true, rate: 0.9, cram: false }
});
let state = defaultState();

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) applyImported(JSON.parse(raw), false);
  } catch (e) { console.warn("load failed", e); }
}
function saveState() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
}
function applyImported(obj, announce) {
  if (!obj || typeof obj !== "object" || typeof obj.xp !== "number" || typeof obj.srs !== "object")
    throw new Error("not a Tiếng Việt Quest save file");
  const d = defaultState();
  state = {
    ...d, ...obj,
    stats: { ...d.stats, ...(obj.stats || {}) },
    settings: { ...d.settings, ...(obj.settings || {}) },
    srs: obj.srs || {}, badges: Array.isArray(obj.badges) ? obj.badges : []
  };
  delete state.savedAt; delete state.app;
  for (const id of Object.keys(state.srs)) if (!WORD_BY_ID[id]) delete state.srs[id];
  if (announce) toast("📂 Progress loaded!");
}

const todayStr = () => new Date().toISOString().slice(0, 10);
function touchStreak() {
  const today = todayStr();
  if (state.lastActive === today) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  state.streak = state.lastActive === y.toISOString().slice(0, 10) ? state.streak + 1 : 1;
  state.lastActive = today;
  if (state.streak > 1) toast(`🔥 ${state.streak}-day streak!`);
}

/* ---------- XP & levels ---------- */
const LEVEL_TITLES = [
  [1, "Người mới · Newcomer"], [3, "Học viên · Student"], [5, "Du khách · Traveler"], [7, "Người bạn · Friend"],
  [10, "Đầu bếp · Chef"], [13, "Giáo viên · Teacher"], [16, "Cao thủ · Expert"], [20, "Huyền thoại · Legend"]
];
const xpForLevel = lv => 80 + (lv - 1) * 40;    // XP needed to clear level lv
function levelInfo(xp) {
  let lv = 1, rem = xp;
  while (rem >= xpForLevel(lv)) { rem -= xpForLevel(lv); lv++; }
  const title = LEVEL_TITLES.reduce((t, [min, name]) => lv >= min ? name : t, LEVEL_TITLES[0][1]);
  return { lv, into: rem, need: xpForLevel(lv), title };
}
function gainXP(amount) {
  const before = levelInfo(state.xp).lv;
  state.xp += amount;
  touchStreak();
  const after = levelInfo(state.xp).lv;
  if (after > before) {
    sfx("levelup"); confetti();
    toast(`🎉 Level up! Lv.${after} ${levelInfo(state.xp).title}`);
  }
  checkBadges(); saveState(); renderHeader();
}

/* ---------- SRS (Leitner boxes) ---------- */
const BOX_DAYS = [0, 1, 2, 4, 8, 16, 32];
function srsCard(id) {
  return state.srs[id] || (state.srs[id] = { b: 0, d: 0, s: 0, c: 0 });
}
function srsGrade(id, grade) {  // again | hard | good | easy
  const c = srsCard(id);
  c.s++;
  if (grade === "again") c.b = 0;
  else if (grade === "hard") { c.b = Math.max(0, c.b - 1); c.c++; }
  else if (grade === "good") { c.b = Math.min(6, c.b + 1); c.c++; }
  else { c.b = Math.min(6, c.b + 2); c.c++; }
  c.d = Date.now() + (c.b === 0 ? 5 * 60 * 1000 : BOX_DAYS[c.b] * 86400000);
}
const isLearned = id => (state.srs[id]?.b ?? 0) >= 2;
const wordsOf = lv => lv === "ALL" ? WORDS : WORDS.filter(w => w.lv === lv);
const dueCards = () => WORDS.filter(w => state.srs[w.id] && state.srs[w.id].d <= Date.now());
const learnedCount = lv => wordsOf(lv).filter(w => isLearned(w.id)).length;

/* ---------- badges ---------- */
const BADGES = [
  { id: "first", ico: "🌱", name: "First Steps", desc: "Review 1 card", test: s => s.stats.cards >= 1 },
  { id: "w10", ico: "📖", name: "Word Collector", desc: "Learn 10 words", test: () => WORDS.filter(w => isLearned(w.id)).length >= 10 },
  { id: "w50", ico: "📚", name: "Bookworm", desc: "Learn 50 words", test: () => WORDS.filter(w => isLearned(w.id)).length >= 50 },
  { id: "w100", ico: "💯", name: "Century", desc: "Learn 100 words", test: () => WORDS.filter(w => isLearned(w.id)).length >= 100 },
  { id: "c5", ico: "🔥", name: "Warming Up", desc: "5 typing combo", test: s => s.bestCombo >= 5 },
  { id: "c15", ico: "⚡", name: "Lightning Hands", desc: "15 typing combo", test: s => s.bestCombo >= 15 },
  { id: "c30", ico: "🌋", name: "Unstoppable", desc: "30 typing combo", test: s => s.bestCombo >= 30 },
  { id: "perfect", ico: "🏆", name: "Perfect!", desc: "Ace a quiz 10/10", test: s => s.stats.perfect >= 1 },
  { id: "quiz10", ico: "🧠", name: "Quiz Regular", desc: "Finish 10 quizzes", test: s => s.stats.quizzes >= 10 },
  { id: "type100", ico: "⌨️", name: "Telex Ninja", desc: "Type 100 words right", test: s => s.stats.typedCorrect >= 100 },
  { id: "phrase30", ico: "🗣️", name: "Smooth Talker", desc: "Type 30 phrases right", test: s => s.stats.phrases >= 30 },
  { id: "drill50", ico: "📐", name: "Grammar Geek", desc: "Clear 50 grammar drills", test: s => s.stats.drills >= 50 },
  { id: "s3", ico: "📅", name: "Habit Forming", desc: "3-day streak", test: s => s.streak >= 3 },
  { id: "s7", ico: "🗓️", name: "One Week Strong", desc: "7-day streak", test: s => s.streak >= 7 },
  { id: "s30", ico: "🪷", name: "Lotus Bloom", desc: "30-day streak", test: s => s.streak >= 30 },
  { id: "lv5", ico: "🛵", name: "Scooter Rider", desc: "Reach level 5", test: s => levelInfo(s.xp).lv >= 5 },
  { id: "lv10", ico: "🏮", name: "Lantern Master", desc: "Reach level 10", test: s => levelInfo(s.xp).lv >= 10 }
];
function checkBadges() {
  for (const b of BADGES) {
    if (!state.badges.includes(b.id) && b.test(state)) {
      state.badges.push(b.id);
      sfx("badge"); confetti(20);
      toast(`${b.ico} Badge earned: ${b.name}!`);
    }
  }
}

/* =====================================================================
   UI PLUMBING — toasts, confetti, header, theme, helpers
   ===================================================================== */
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

function toast(msg) {
  const box = document.getElementById("toasts");
  if (!box) return;
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}
function confetti(n = 40) {
  const colors = ["#cf3428", "#1baf7a", "#eda100", "#2a78d6", "#e87ba4", "#4a3aa7"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("div");
    c.className = "confetti-bit";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    c.style.animationDelay = Math.random() * 0.4 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}
function renderHeader() {
  const s = document.getElementById("streakChip"), x = document.getElementById("xpChip");
  if (s) s.textContent = `🔥 ${state.streak}`;
  if (x) x.textContent = `✨ ${state.xp} XP`;
}

/* segmented controls: single-select helper, returns getter */
function segControl(id) {
  const seg = document.getElementById(id);
  seg.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    [...seg.children].forEach(b => b.classList.toggle("active", b === btn));
  });
  return () => seg.querySelector(".active").dataset.lv || seg.querySelector(".active").dataset.mode;
}

const shuffled = arr => [...arr].sort(() => Math.random() - 0.5);

/* ---------- theme toggle ---------- */
(function initTheme() {
  try {
    const saved = localStorage.getItem("tiengVietTheme");
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (e) {}
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const root = document.documentElement;
      const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      root.dataset.theme = cur === "dark" ? "light" : "dark";
      try { localStorage.setItem("tiengVietTheme", root.dataset.theme); } catch (e) {}
    });
  });
})();

/* ---------- boot ---------- */
loadState();
document.addEventListener("DOMContentLoaded", () => { renderHeader(); pickVoice(); });
