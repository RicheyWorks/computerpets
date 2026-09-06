const fs = require("fs");
const lines = fs.readFileSync("web/src/lib/pets/window-play.ts", "utf8").split(/\n/);
console.log("KIND "+lines[753]);
console.log("==== PHASE");
for (let i = 756; i < 900; i++) {
  console.log((i+1)+":"+lines[i]);
  if (lines[i].includes(";") && i > 760) break;
}
console.log("==== TS SIGNAL CONST AREA");
for (let i = 148; i < 160; i++) console.log((i+1)+":"+lines[i]);
console.log("==== TS playFor tail");
for (let i = 1598; i < 1612; i++) console.log((i+1)+":"+lines[i]);
console.log("==== TS exports? no, functions");
for (let i = 16110; i < 16180; i++) console.log((i+1)+":"+lines[i]);
console.log("==== TS tick signal");
for (let i = 0; i < lines.length; i++) if (lines[i].includes('phase === "signal-on"') || lines[i].includes('phase === "signal-off"') || lines[i].includes("typeof SIGNAL")) console.log((i+1)+":"+lines[i].slice(0,140));
