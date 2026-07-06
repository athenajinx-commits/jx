/* Nihongo Quest — shared engine: word list, romaji IME, audio, state,
   XP/streak/badges, toasts, theme. Load data.js before this file. */
"use strict";

/* ---------- word list ---------- */
const VOCAB_RAW = window.NQ_DATA.vocab;
const PHRASES = window.NQ_DATA.phrases.map(([k, r, m, cat]) => ({ id: "p:" + k, k, r, m, cat }));
const GRAMMAR = window.NQ_DATA.grammar;
const LEVELS = ["N5", "N4", "N3"];
const WORDS = [];
for (const lv of LEVELS) for (const [k, r, m] of VOCAB_RAW[lv]) WORDS.push({ id: k, k, r, m, lv });
const WORD_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));
const isKanaOnly = s => /^[぀-ヿー、。！？\s]+$/.test(s);

/* =====================================================================
   ROMAJI → KANA IME
   ===================================================================== */
/*IME-START*/
const KANA_MAP = {
a:"あ",i:"い",u:"う",e:"え",o:"お",
ka:"か",ki:"き",ku:"く",ke:"け",ko:"こ",kya:"きゃ",kyu:"きゅ",kyo:"きょ",
ga:"が",gi:"ぎ",gu:"ぐ",ge:"げ",go:"ご",gya:"ぎゃ",gyu:"ぎゅ",gyo:"ぎょ",
sa:"さ",shi:"し",si:"し",su:"す",se:"せ",so:"そ",sha:"しゃ",shu:"しゅ",sho:"しょ",sya:"しゃ",syu:"しゅ",syo:"しょ",she:"しぇ",
za:"ざ",ji:"じ",zi:"じ",zu:"ず",ze:"ぜ",zo:"ぞ",ja:"じゃ",ju:"じゅ",jo:"じょ",je:"じぇ",jya:"じゃ",jyu:"じゅ",jyo:"じょ",zya:"じゃ",zyu:"じゅ",zyo:"じょ",
ta:"た",chi:"ち",ti:"ち",tsu:"つ",tu:"つ",te:"て",to:"と",cha:"ちゃ",chu:"ちゅ",cho:"ちょ",che:"ちぇ",tya:"ちゃ",tyu:"ちゅ",tyo:"ちょ",
da:"だ",di:"ぢ",du:"づ",de:"で",do:"ど",
na:"な",ni:"に",nu:"ぬ",ne:"ね",no:"の",nya:"にゃ",nyu:"にゅ",nyo:"にょ",
ha:"は",hi:"ひ",fu:"ふ",hu:"ふ",he:"へ",ho:"ほ",hya:"ひゃ",hyu:"ひゅ",hyo:"ひょ",
fa:"ふぁ",fi:"ふぃ",fe:"ふぇ",fo:"ふぉ",
ba:"ば",bi:"び",bu:"ぶ",be:"べ",bo:"ぼ",bya:"びゃ",byu:"びゅ",byo:"びょ",
pa:"ぱ",pi:"ぴ",pu:"ぷ",pe:"ぺ",po:"ぽ",pya:"ぴゃ",pyu:"ぴゅ",pyo:"ぴょ",
ma:"ま",mi:"み",mu:"む",me:"め",mo:"も",mya:"みゃ",myu:"みゅ",myo:"みょ",
ya:"や",yu:"ゆ",yo:"よ",
ra:"ら",ri:"り",ru:"る",re:"れ",ro:"ろ",rya:"りゃ",ryu:"りゅ",ryo:"りょ",
wa:"わ",wo:"を",wi:"うぃ",we:"うぇ",
la:"ぁ",li:"ぃ",lu:"ぅ",le:"ぇ",lo:"ぉ",xa:"ぁ",xi:"ぃ",xu:"ぅ",xe:"ぇ",xo:"ぉ",
ltu:"っ",xtu:"っ",ltsu:"っ",lya:"ゃ",lyu:"ゅ",lyo:"ょ",xya:"ゃ",xyu:"ゅ",xyo:"ょ",
thi:"てぃ",dhi:"でぃ",vu:"ゔ",
"-":"ー",",":"、",".":"。","?":"？","!":"！"
};
const KANA_PREFIXES = new Set();
for (const key of Object.keys(KANA_MAP))
  for (let n = 1; n <= key.length; n++) KANA_PREFIXES.add(key.slice(0, n));
const CONSONANTS = "bcdfghjklmpqrstvwz";

/**
 * Convert a romaji string to hiragana.
 * Returns {kana, pending} — pending is a trailing chunk that may still
 * become kana with more keystrokes (e.g. "k", "ky", lone "n").
 * With final=true, a trailing "n" is committed to ん.
 */
function romajiToKana(src, final = false) {
  const s = src.toLowerCase();
  let out = "", i = 0;
  while (i < s.length) {
    const c = s[i];
    if (!/[a-z'\-,.?!]/.test(c)) { out += s[i]; i++; continue; }  // pass kana etc. through
    if (c === "n") {
      const nx = s[i + 1];
      if (nx === "'") { out += "ん"; i += 2; continue; }
      if (nx === "n") {
        const nx2 = s[i + 2];
        // "onna" pasted/submitted whole → おんな; but a trailing "nn" commits
        // to ん immediately (takusann → たくさん), like a real IME
        if (nx2 !== undefined && "aiueoy".includes(nx2)) { out += "ん"; i += 1; }
        else { out += "ん"; i += 2; }
        continue;
      }
      if (nx === undefined) { if (final) { out += "ん"; i++; } break; }
      if (!"aiueoy".includes(nx)) { out += "ん"; i++; continue; }
    } else if (c === s[i + 1] && CONSONANTS.includes(c)) {     // kk → っk
      out += "っ"; i++; continue;
    } else if (s.slice(i, i + 3) === "tch") {                  // tch → っch
      out += "っ"; i++; continue;
    }
    let matched = false;
    for (let len = Math.min(4, s.length - i); len > 0; len--) {
      const chunk = s.slice(i, i + len);
      if (KANA_MAP[chunk] !== undefined) {
        out += KANA_MAP[chunk]; i += len; matched = true; break;
      }
    }
    if (!matched) {
      if (KANA_PREFIXES.has(s.slice(i))) break;                // could still complete
      out += s[i]; i++;                                        // stray char, pass through
    }
  }
  return { kana: out, pending: s.slice(i) };
}
/*IME-END*/

/** Live-convert the trailing romaji of an input's value. */
function wireKanaInput(input) {
  input.addEventListener("input", () => {
    const m = input.value.match(/^([\s\S]*?)([a-zA-Z'\-,.?!]*)$/);
    const { kana, pending } = romajiToKana(m[2]);
    const v = m[1] + kana + pending;
    if (v !== input.value) input.value = v;
  });
}
function finalizeKana(value) {
  const m = value.match(/^([\s\S]*?)([a-zA-Z'\-,.?!]*)$/);
  const { kana, pending } = romajiToKana(m[2], true);
  return (m[1] + kana + pending).trim();
}

/* =====================================================================
   AUDIO — speech synthesis + tiny sound effects
   ===================================================================== */
let jpVoice = null;
function pickVoice() {
  const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  jpVoice = vs.find(v => v.lang.replace("_", "-").toLowerCase().startsWith("ja")) || null;
  const el = document.getElementById("voiceStatus");
  if (el) el.textContent = jpVoice
    ? `🗣️ Japanese voice: ${jpVoice.name}`
    : "⚠️ No Japanese voice found in this browser — audio features will be limited. Chrome/Edge usually include one.";
}
if (window.speechSynthesis) {
  speechSynthesis.onvoiceschanged = pickVoice;
  pickVoice();
}
function speakWord(w, rateMul = 1) {
  if (!window.speechSynthesis) return;
  const text = isKanaOnly(w.k) ? w.k : w.r;   // speak the reading → never a wrong kanji reading
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  if (jpVoice) u.voice = jpVoice;
  u.rate = state.settings.rate * rateMul;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  state.stats.listens++;
}
function speakText(jp, reading, rateMul = 1) {
  speakWord({ k: jp, r: reading }, rateMul);
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
const SAVE_KEY = "nihongoQuestV1";
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
    throw new Error("not a Nihongo Quest save file");
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
  [1, "見習い · Apprentice"], [3, "学生 · Student"], [5, "旅人 · Traveler"], [7, "侍 · Samurai"],
  [10, "忍者 · Ninja"], [13, "先生 · Teacher"], [16, "達人 · Master"], [20, "仙人 · Sage"]
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
  { id: "type100", ico: "⌨️", name: "Keyboard Ninja", desc: "Type 100 words right", test: s => s.stats.typedCorrect >= 100 },
  { id: "phrase30", ico: "🗣️", name: "Smooth Talker", desc: "Type 30 phrases right", test: s => s.stats.phrases >= 30 },
  { id: "drill50", ico: "📐", name: "Grammar Geek", desc: "Clear 50 grammar drills", test: s => s.stats.drills >= 50 },
  { id: "s3", ico: "📅", name: "Habit Forming", desc: "3-day streak", test: s => s.streak >= 3 },
  { id: "s7", ico: "🗓️", name: "One Week Strong", desc: "7-day streak", test: s => s.streak >= 7 },
  { id: "s30", ico: "🌸", name: "Hanami", desc: "30-day streak", test: s => s.streak >= 30 },
  { id: "lv5", ico: "🗻", name: "Climbing Fuji", desc: "Reach level 5", test: s => levelInfo(s.xp).lv >= 5 },
  { id: "lv10", ico: "🏯", name: "Castle Lord", desc: "Reach level 10", test: s => levelInfo(s.xp).lv >= 10 }
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
  const colors = ["#2a78d6", "#1baf7a", "#eda100", "#e34948", "#e87ba4", "#4a3aa7"];
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
    const saved = localStorage.getItem("nihongoTheme");
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (e) {}
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const root = document.documentElement;
      const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      root.dataset.theme = cur === "dark" ? "light" : "dark";
      try { localStorage.setItem("nihongoTheme", root.dataset.theme); } catch (e) {}
    });
  });
})();

/* ---------- boot ---------- */
loadState();
document.addEventListener("DOMContentLoaded", () => { renderHeader(); pickVoice(); });
