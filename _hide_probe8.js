const fs = require("fs");
const ts = fs.readFileSync("web/src/lib/pets/window-play.ts", "utf8");
const i = ts.indexOf('SPOTS');
console.log("SPOTS occurrences", (ts.match(/SPOTS/g)||[]).length);
// Kind type
const k = ts.match(/export type PlayKind[\s\S]{0,500}/);
console.log(k && k[0].slice(0,400));
// or union
const u = ts.match(/type Kind =[\s\S]{0,300}|PlayKind =[\s\S]{0,300}|kind:[\s\S]{0,200}SPOTS/);
console.log("union?", u && u[0].slice(0,300));
// find spots in type string union
const si = ts.indexOf('"spots"');
console.log("spots string ctx", JSON.stringify(ts.slice(si-80, si+80)));
const leave = ts.indexOf('"spotted"');
console.log("leave ctx", JSON.stringify(ts.slice(leave-40, leave+60)));
const side = ts.indexOf('"reefsky"');
console.log("side ctx", JSON.stringify(ts.slice(side-40, side+60)));
