const fs = require("fs");
const cjs = fs.readFileSync("desktop/renderer/window-play.test.cjs", "utf8");
const mjs = fs.readFileSync("web/scripts/window-play.test.mjs", "utf8");
for (const [name, t] of [["cjs", cjs], ["mjs", mjs]]) {
  const idx = t.indexOf('playFor("grouper")');
  console.log(name, "grouper idx", idx);
  console.log(name, "generic sill?", /generic.?sill|grouper.*sill|sill.*grouper/i.test(t));
  // find generic sill clone test title
  const m = t.match(/test\("[^"]*grouper[^"]*"\)/);
  console.log(name, "grouper test", m && m[0]);
  const m2 = t.match(/test\("[^"]*[Gg]eneric[^"]*"\)/);
  console.log(name, "generic test", m2 && m2[0]);
}
const readme = fs.readFileSync("README.md","utf8");
console.log("README Soar", readme.includes("Soar spots"));
console.log("README Hide", readme.includes("Hide holes"));
const road = fs.readFileSync("docs/ROADMAP.md","utf8");
const soarLine = road.split(/\r?\n/).find(l => l.includes("Soar (`eagle_ray`"));
console.log("roadmap soar:", soarLine && soarLine.slice(0,200));
console.log("Next Hide", road.includes("Next leftover is Hide"));
const kick = fs.readFileSync("desktop/renderer/window-play.js","utf8");
const ki = kick.indexOf("function kickPoint");
console.log(kick.slice(ki, ki+450));
