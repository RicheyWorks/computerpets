const fs = require("fs");
const ts = fs.readFileSync("web/src/lib/pets/window-play.ts", "utf8");
const pk = ts.indexOf("export type PlayKind");
console.log(ts.slice(pk, pk+2500).split(/\r?\n/).filter(l=>/SPOTS|MANTLE|SILL|typeof/.test(l)).slice(-20).join("\n"));
console.log("--- leave ---");
const lv = ts.indexOf('"spotted"');
console.log(JSON.stringify(ts.slice(lv-100, lv+150)));
console.log("--- side ---");
const sd = ts.indexOf('"reefsky"');
console.log(JSON.stringify(ts.slice(sd-120, sd+80)));
// soar apply didn't show type updates - maybe PlayKind is auto from typeof consts
const pkLine = ts.split(/\r?\n/).find(l => l.includes("typeof SPOTS") || l.includes("typeof MANTLE"));
console.log("PlayKind line fragment", pkLine && pkLine.slice(0,200));
