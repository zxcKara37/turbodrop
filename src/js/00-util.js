/* ================= Утилиты ================= */
"use strict";
const $ = id => document.getElementById(id);
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
// Детерминированный генератор для отрисовки (скины, износ, обложки)
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
function hseed(s) { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0 }
// Честный генератор для игровых бросков: криптостойкий, равномерный
const FAIR = (() => {
  const buf = new Uint32Array(64); let i = 64;
  const ok = !!(window.crypto && crypto.getRandomValues);
  return {
    u32() { if (!ok) return Math.floor(Math.random() * 4294967296); if (i >= 64) { crypto.getRandomValues(buf); i = 0 } return buf[i++] },
    // равномерное число [0,1) с 53 битами
    rand() { return (this.u32() * 2097152 + (this.u32() >>> 11)) / 9007199254740992 },
    // целое 0..n-1 без смещения
    int(n) { const lim = Math.floor(4294967296 / n) * n; let x; do x = this.u32(); while (x >= lim); return x % n },
    pick(a) { return a[this.int(a.length)] }
  };
})();
const R = () => FAIR.rand();
const fmtN = n => Math.round(n).toLocaleString("ru-RU");
const fmt = n => n === Infinity ? "∞" : (Number.isFinite(n) ? fmtN(n) : "0") + " ₽";
const fmtP = (p, d = 2) => (p * 100).toFixed(d).replace(".", ",") + "%";
function plural(n, a, b, c) { n = Math.abs(n) % 100; const k = n % 10; if (n > 10 && n < 20) return c; if (k > 1 && k < 5) return b; if (k === 1) return a; return c }
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function el(tag, cls, html) { const d = document.createElement(tag); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d }
const RM = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const DAY = 864e5;
const dayNo = (t = Date.now()) => Math.floor((t + 3 * 3600e3) / DAY);
function shadeHex(h, a) { const n = parseInt(h.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255; const t = a < 0 ? 0 : 255, p = Math.abs(a); r = Math.round(r + (t - r) * p); g = Math.round(g + (t - g) * p); b = Math.round(b + (t - b) * p); return `rgb(${r},${g},${b})` }
function hexA(h, a) { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})` }
