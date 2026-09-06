const fs = require("fs");
const cjs = fs.readFileSync("desktop/renderer/window-play.test.cjs", "utf8");
const idxs = [];
let i = 0;
while ((i = cjs.indexOf('pickTarget([WIN], 80, "grouper"', i)) >= 0) { idxs.push(i); i++; }
console.log("pickTarget grouper count", idxs.length, idxs);
for (const idx of idxs) {
  // walk back to test(
  const start = cjs.lastIndexOf('test("', idx);
  console.log("\n== test title:", cjs.slice(start, start+120));
  console.log("ctx:", JSON.stringify(cjs.slice(idx-100, idx+200)));
}
// also count playFor grouper sill
let n=0, j=0;
while ((j = cjs.indexOf('playFor("grouper")', j))>=0) { n++; j++; }
console.log("playFor grouper count", n);
