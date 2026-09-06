const fs = require("fs");
const road = fs.readFileSync("docs/ROADMAP.md","utf8");
const lines = road.split(/\r?\n/).filter(l => /Soar|Hide|grouper|eagle_ray|Next leftover/i.test(l));
console.log(lines.map(l=>l.slice(0,240)).join("\n---\n"));
const cjs = fs.readFileSync("desktop/renderer/window-play.test.cjs","utf8");
// find context around grouper
let idx = 0, n=0;
while ((idx = cjs.indexOf("grouper", idx)) >= 0 && n < 8) {
  console.log("--- cjs @", idx, JSON.stringify(cjs.slice(Math.max(0,idx-80), idx+120)));
  idx += 7; n++;
}
