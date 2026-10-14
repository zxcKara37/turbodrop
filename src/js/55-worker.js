/* ================= Фоновая отрисовка: код воркера (продолжение среза с 30-render) ================= */
if (IN_WORKER) self.onmessage = async e => {
  const d = e.data;
  try { const cv = renderGun({ type: d.type, skin: SKINS[d.skin] || null, tier: d.tier, turbo: d.turbo }, d.S); const blob = await cv.convertToBlob({ type: "image/webp", quality: .9 }); self.postMessage({ k: d.k, blob }) }
  catch (err) { self.postMessage({ k: d.k, blob: null }) }
};
/*WORKER-END*/
if (!IN_WORKER && typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined" && document.currentScript) {
  const all = document.currentScript.textContent, parts = all.split("/*WORKER-START*/").slice(1).map(x => x.split("/*WORKER-END*/")[0]);
  initWorker('"use strict";\n' + parts.join("\n"));
}
