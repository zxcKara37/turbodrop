/* ================= Звук: только WebAudio ================= */
const SND = (() => {
  let ac = null, master = null, noiseBuf = null;
  function ctx() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); const n = ac.sampleRate; noiseBuf = ac.createBuffer(1, n, n); const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1 } catch (e) { ac = null } }
    if (ac && ac.state === "suspended") ac.resume().catch(() => { });
    if (master) master.gain.value = ALL.snd.on ? ALL.snd.vol * .9 : 0;
    return ac;
  }
  const on = () => ALL.snd.on && ALL.snd.vol > 0 && ctx();
  function tone(f, d = .08, v = .2, type = "sine", at = 0, f2 = null, attack = .004) {
    if (!on()) return; const t = ac.currentTime + at, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(master); o.start(t); o.stop(t + d + .03);
  }
  function noise(d = .1, v = .2, at = 0, freq = 2000, q = 1, type = "bandpass", f2) {
    if (!on()) return; const t = ac.currentTime + at, s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; fl.type = type; fl.frequency.setValueAtTime(freq, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + d); fl.Q.value = q;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(fl).connect(g).connect(master); s.start(t, Math.random() * .5); s.stop(t + d + .02);
  }
  const chord = (fs, d, v, type, at = 0, step = 0) => fs.forEach((f, i) => tone(f, d, v, type, at + i * step));
  return {
    unlock: ctx,
    vol() { if (master && ac) master.gain.value = ALL.snd.on ? ALL.snd.vol * .9 : 0 },
    click() { tone(900, .03, .06, "triangle") },
    tick(k = 1) { noise(.025, .22 * k, 0, 3200 + Math.random() * 600, 4); tone(1700 + Math.random() * 200, .02, .05 * k, "square") },
    shake() { for (let i = 0; i < 5; i++) noise(.05, .12, i * .07, 600 + i * 80, 2) },
    open() { noise(.35, .25, 0, 400, .7, "lowpass", 4000); tone(140, .3, .3, "sine", 0, 60); chord([523, 784, 1046], .5, .05, "triangle", .1, .05) },
    stop() { tone(220, .12, .2, "triangle", 0, 110); noise(.06, .2, 0, 1200, 2) },
    sell() { tone(1318, .09, .12, "triangle"); tone(1760, .16, .12, "triangle", .07); noise(.08, .08, .02, 6000, 3) },
    buy() { tone(880, .07, .1, "triangle"); tone(1175, .12, .1, "triangle", .06) },
    error() { tone(160, .18, .18, "sawtooth"); tone(120, .22, .14, "sawtooth", .1) },
    upWin() { chord([523, 659, 784, 1046, 1318], .35, .12, "triangle", 0, .07); noise(.4, .05, .3, 8000, 1, "highpass") },
    upLose() { tone(392, .25, .15, "sawtooth", 0, 300); tone(294, .3, .15, "sawtooth", .18, 200); tone(196, .5, .15, "sawtooth", .36, 90) },
    drop(r) {
      const seqs = [[523], [523, 659], [523, 659, 784], [523, 659, 784, 1046], [587, 740, 880, 1175], [659, 831, 988, 1319, 1661], [523, 659, 784, 1046, 1319, 1568, 2093], [392, 523, 659, 784, 1046, 1319, 1568, 2093]];
      const s = seqs[r] || seqs[0]; chord(s, r >= 5 ? .6 : .3, r >= 5 ? .12 : .09, "triangle", 0, r >= 6 ? .09 : .06);
      if (r >= 5) { chord([s[0] / 2, s[2] / 2], 1.2, .12, "sawtooth", s.length * .09); noise(1.2, .06, .1, 9000, .5, "highpass") }
      if (r >= 6) chord([s[s.length - 1], s[s.length - 3]], 1.4, .08, "square", s.length * .09 + .15);
    },
    coin() { for (let i = 0; i < 6; i++) tone(2400 + i * 120, .03, .05, "square", i * .06) },
    boom() { noise(.6, .5, 0, 800, .5, "lowpass", 60); tone(90, .5, .4, "sine", 0, 30) },
    gem() { tone(1568, .12, .12, "sine"); tone(2093, .2, .1, "sine", .06) },
    crashTick(m) { tone(300 + Math.min(1500, m * 120), .04, .04, "sine") },
    level() { chord([659, 784, 988, 1319], .4, .12, "triangle", 0, .08) },
  };
})();
