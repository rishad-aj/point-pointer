// Download all 711 PointerPointer photos for self-hosting (Vercel / Firebase / any static host).
// Usage:
//   node src/download-images.mjs
// Downloads https://pointerpointer.com/images/{0..710}.jpg into ./images/
// (~40–100KB each, ~50MB total). Then deploy with that images/ folder next to index.html.
//
// The clone tries IMAGE_BASES = ["src/images/", "images/", "https://pointerpointer.com/images/"]
// in order, so once ./images/ exists it will use local files and no longer depend on the original site.
// positions.json is already bundled (711 fingertip [x,y] pairs, normalized 0..1).
//
// NOTE: photos belong to their respective owners (pointerpointer.com contributors).
// This script is for your PRIVATE project as requested. Do not publicly redistribute
// the photo set without permission — re-shoot your own set for a public launch.

import fs from "node:fs";
import path from "node:path";

const COUNT = 711;
const OUT = process.argv[2] || "images";
fs.mkdirSync(OUT, { recursive: true });

for (let i = 0; i < COUNT; i++) {
  const dest = path.join(OUT, `${i}.jpg`);
  if (fs.existsSync(dest)) { console.log(`skip ${i}`); continue; }
  const url = `https://pointerpointer.com/images/${i}.jpg`;
  try {
    const res = await fetch(url);
    if (!res.ok) { console.error(`fail ${i}: HTTP ${res.status}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`ok ${i} (${(buf.length/1024).toFixed(1)}kb)`);
  } catch (e) {
    console.error(`fail ${i}: ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 50)); // be polite
}
console.log("done");
