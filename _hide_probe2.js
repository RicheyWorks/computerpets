const fs = require("fs");
const js = fs.readFileSync("desktop/renderer/window-play.js", "utf8");
const dur = js.match(/const DUR = \{[\s\S]*?\n  \};/)[0];
const nums = [...dur.matchAll(/(\w+):\s*([\d.]+)/g)].map(m => [m[1], Number(m[2])]);
const used = new Set(nums.map(m => m[1]));
const usedV = new Set(nums.map(m => m[2]));
function free(v){ return ![...usedV].some(u => Math.abs(u-v)<1e-9); }
for (const v of [3.31,2.95,5.87,3.07,3.15,2.91,5.63,3.11,205,178]) console.log(v, free(Number(v)));
// export block around SPOTS
const i = js.indexOf("spotsOffPath,");
console.log(js.slice(i, i+120));
const j = js.indexOf("SPOTS,");
console.log("SPOTS export ctx", JSON.stringify(js.slice(j-20, j+40)));
const k = js.indexOf('if (key === "eagle_ray") return SPOTS;');
console.log("playFor ctx", JSON.stringify(js.slice(k, k+80)));
const size = js.indexOf("if (kind === SPOTS) return");
console.log("size ctx", JSON.stringify(js.slice(size, size+120)));
