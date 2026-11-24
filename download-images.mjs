// Download all 711 PointerPointer photos (0.jpg..710.jpg) for self-hosting.
// Usage (run from the folder containing index.html):
//   node download-images.mjs              # writes ./images
//   node download-images.mjs some/dir     # writes some/dir/0.jpg ...
//
// Requires Node 18+ (built-in fetch). Downloads https://pointerpointer.com/images/{0..710}.jpg
// (~40-100 KB each, ~50 MB total) into ./images/, next to index.html.
//
// The positions table is inlined in index.html; positions.json is only a reference copy,
// so no data fetch is needed at runtime. Existing non-empty files are skipped, so re-running
// the script only fills in missing images. Failed downloads are retried 3 times.
//
// NOTE: photos belong to their respective owners (pointerpointer.com contributors).
// This script is for a PRIVATE copy as requested. Do not publicly redistribute
// the photo set without permission - re-shoot your own set for a public launch.

import fs from "node:fs";
import path from "node:path";

const COUNT = 711;
const OUT = process.argv[2] || "images";
const BASE = "https://pointerpointer.com/images";
const ATTEMPTS = 3;

fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const failed = [];
for (let i = 0; i < COUNT; i++) {
  const dest = path.join(OUT, `${i}.jpg`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) { console.log(`skip ${i}`); continue; }

  let ok = false;
  for (let attempt = 1; attempt <= ATTEMPTS && !ok; attempt++) {
    try {
      const res = await fetch(`${BASE}/${i}.jpg`, { headers: { "user-agent": "pointer-clone-downloader/1.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1024 || buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("response is not a JPEG");
      fs.writeFileSync(dest, buf);
      console.log(`ok ${i} (${(buf.length / 1024).toFixed(1)}kb)`);
      ok = true;
    } catch (e) {
      console.error(`fail ${i} (attempt ${attempt}/${ATTEMPTS}): ${e.message}`);
      if (attempt < ATTEMPTS) await sleep(500 * attempt);
    }
  }
  if (!ok) failed.push(i);
  await sleep(50); // be polite
}

if (failed.length) {
  console.error(`\n${failed.length} image(s) failed: ${failed.join(", ")}`);
  console.error("Re-run the script to retry only the missing files.");
  process.exitCode = 1;
} else {
  console.log(`\ndone: ${COUNT} images in ${OUT}/`);
}
