/* Zhōngwén Quest — shared engine: word list, pinyin tone-number IME, audio,
   state, XP/streak/badges, toasts, theme. Load data.js before this file. */
"use strict";

/* =====================================================================
   PINYIN IME — tone numbers → accented pinyin
   ni3 → nǐ · hao3 → hǎo · v → ü (nv3 → nǚ) · 5/0 or no number = neutral
   The mark lands on the right vowel automatically (a/e first, ou → o,
   otherwise the last vowel: guì, xiū, duō).
   ===================================================================== */
/*IME-START*/
const PY_TONES = {
  a: "aāáǎà", e: "eēéěè", i: "iīíǐì", o: "oōóǒò", u: "uūúǔù", "ü": "üǖǘǚǜ"
};
const PY_UNTONE = {};                    // accented char → [base char, tone 1-4]
for (const [base, row] of Object.entries(PY_TONES))
  [...row].forEach((ch, t) => { if (t) PY_UNTONE[ch] = [base, t]; });
const PY_VOWELS = new Set(Object.keys(PY_TONES));
const pyIsVowel = c => PY_VOWELS.has(c) || PY_UNTONE[c] !== undefined;
const pyBase = c => PY_UNTONE[c] ? PY_UNTONE[c][0] : c;

/** Apply a tone (1-5) to the vowel cluster that ends just before `chars.length`. */
function pyApplyTone(chars, tone) {
  let end = chars.length - 1;
  while (end >= 0 && !pyIsVowel(chars[end])) end--;   // skip final n / ng / r
  if (end < 0) return;
  let start = end;
  while (start > 0 && pyIsVowel(chars[start - 1])) start--;
  for (let i = start; i <= end; i++) chars[i] = pyBase(chars[i]);  // retoning replaces
  const cluster = chars.slice(start, end + 1).join("");
  let at;
  if (cluster.includes("a")) at = start + cluster.indexOf("a");
  else if (cluster.includes("e")) at = start + cluster.indexOf("e");
  else if (cluster.includes("ou")) at = start + cluster.indexOf("o");
  else at = end;
  if (tone >= 1 && tone <= 4) chars[at] = PY_TONES[chars[at]][tone];
  // tone 5 / 0 = neutral: accents stripped, no mark added
}

/** Convert tone-numbered pinyin to accented pinyin. Idempotent. */
function pinyinConvert(str) {
  const chars = [];
  for (let ch of str.normalize("NFC")) {
    if (/[A-Z]/.test(ch)) ch = ch.toLowerCase();
    if (ch === "v") { chars.push("ü"); continue; }
    if (/[0-5]/.test(ch)) {
      const prev = chars[chars.length - 1];
      if (prev && (pyIsVowel(prev) || /[a-z]/.test(prev))) { pyApplyTone(chars, +ch); continue; }
    }
    chars.push(ch);
  }
  return chars.join("");
}
/*IME-END*/

/** Live-convert an input's value as the user types. */
function wirePinyinInput(input) {
  input.addEventListener("input", () => {
    const v = pinyinConvert(input.value);
    if (v !== input.value) input.value = v;
  });
}
function finalizePinyin(value) {
  return pinyinConvert(value).trim();
}

/* answer comparison: case, spaces, apostrophes and punctuation don't matter */
const pyNorm = s => pinyinConvert(s).normalize("NFC").toLowerCase()
  .replace(/[\s'’\-.,!?…;:"“”]/g, "");
/* tone-blind form — used to say "letters right, tones wrong" */
const pyFlat = s => pyNorm(s).normalize("NFD").replace(/[̀-ͯ]/g, "");

/* ---------- word list ---------- */
const VOCAB_RAW = window.ZWQ_DATA.vocab;
const PHRASES = window.ZWQ_DATA.phrases.map(([k, rRaw, m, cat]) =>
  ({ id: "p:" + k, k, r: pinyinConvert(rRaw), m, cat }));
const GRAMMAR = window.ZWQ_DATA.grammar;
for (const s of GRAMMAR) for (const it of s.items)
  it.ex = it.ex.map(([h, p, e]) => [h, pinyinConvert(p), e]);
const DIALOGUES = window.ZWQ_DATA.dialogues.map(d => ({
  ...d,
  lines: d.lines.map(l => ({
    ...l,
    py: pinyinConvert(l.py),
    alt: (l.alt || []).map(([zh, py, en]) => ({ zh, py: pinyinConvert(py), en }))
  }))
}));
const LEVELS = ["HSK1", "HSK2", "HSK3"];
const LEVEL_NAMES = { HSK1: "Beginner", HSK2: "Elementary", HSK3: "Intermediate" };
const WORDS = [];
for (const lv of LEVELS) for (const [k, rRaw, m] of VOCAB_RAW[lv]) {
  const r = pinyinConvert(rRaw);
  WORDS.push({ id: k + "·" + r, k, r, m, lv });
}
const WORD_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));

/* =====================================================================
   AUDIO — speech synthesis + tiny sound effects
   ===================================================================== */
let zhVoice = null;
function pickVoice() {
  const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  const zh = vs.filter(v => v.lang.replace("_", "-").toLowerCase().startsWith("zh"));
  zhVoice = zh.find(v => v.lang.replace("_", "-").toLowerCase().startsWith("zh-cn")) || zh[0] || null;
  const el = document.getElementById("voiceStatus");
  if (el) el.textContent = zhVoice
    ? `🗣️ Chinese voice: ${zhVoice.name}`
    : "⚠️ No Chinese voice found in this browser — audio features will be limited. Chrome/Edge usually include one.";
}
if (window.speechSynthesis) {
  speechSynthesis.onvoiceschanged = pickVoice;
  pickVoice();
}
function speakWord(w, rateMul = 1) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(w.k);   // TTS reads hanzi reliably
  u.lang = "zh-CN";
  if (zhVoice) u.voice = zhVoice;
  u.rate = state.settings.rate * rateMul;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  state.stats.listens++;
}
function speakText(zh, rateMul = 1) {
  speakWord({ k: zh }, rateMul);
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
const SAVE_KEY = "zhongwenQuestV1";
const defaultState = () => ({
  version: 1, xp: 0, streak: 0, lastActive: null, bestCombo: 0,
  stats: { cards: 0, quizzes: 0, perfect: 0, quizQ: 0, quizCorrect: 0,
           typed: 0, typedCorrect: 0, listens: 0, phrases: 0, drills: 0, dialogues: 0 },
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
    throw new Error("not a Zhōngwén Quest save file");
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
  [1, "新手 · Newcomer"], [3, "学生 · Student"], [5, "旅人 · Traveler"], [7, "侠客 · Wanderer"],
  [10, "熊猫 · Panda"], [13, "老师 · Teacher"], [16, "大师 · Master"], [20, "神仙 · Immortal"]
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
  { id: "type100", ico: "⌨️", name: "Pinyin Ninja", desc: "Type 100 words right", test: s => s.stats.typedCorrect >= 100 },
  { id: "phrase30", ico: "🗣️", name: "Smooth Talker", desc: "Type 30 phrases right", test: s => s.stats.phrases >= 30 },
  { id: "drill50", ico: "📐", name: "Grammar Geek", desc: "Clear 50 grammar drills", test: s => s.stats.drills >= 50 },
  { id: "dialogue5", ico: "🎭", name: "Storyteller", desc: "Complete 5 dialogues", test: s => s.stats.dialogues >= 5 },
  { id: "s3", ico: "📅", name: "Habit Forming", desc: "3-day streak", test: s => s.streak >= 3 },
  { id: "s7", ico: "🗓️", name: "One Week Strong", desc: "7-day streak", test: s => s.streak >= 7 },
  { id: "s30", ico: "🏮", name: "Lantern Festival", desc: "30-day streak", test: s => s.streak >= 30 },
  { id: "lv5", ico: "🐼", name: "Panda Pal", desc: "Reach level 5", test: s => levelInfo(s.xp).lv >= 5 },
  { id: "lv10", ico: "🐉", name: "Dragon Lord", desc: "Reach level 10", test: s => levelInfo(s.xp).lv >= 10 }
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
  const colors = ["#0e8f62", "#e34948", "#eda100", "#2a78d6", "#e87ba4", "#4a3aa7"];
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
    const saved = localStorage.getItem("zhongwenTheme");
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (e) {}
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const root = document.documentElement;
      const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      root.dataset.theme = cur === "dark" ? "light" : "dark";
      try { localStorage.setItem("zhongwenTheme", root.dataset.theme); } catch (e) {}
    });
  });
})();

/* ---------- boot ---------- */
loadState();
document.addEventListener("DOMContentLoaded", () => { renderHeader(); pickVoice(); });
