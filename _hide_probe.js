const fs = require("fs");
const js = fs.readFileSync("desktop/renderer/window-play.js", "utf8");
const checks = [
  'const SPOTS = "spots";',
  'const SILL = "sill";',
  'if (key === "eagle_ray") return SPOTS;',
  "return SILL;",
  'leave: "spotted"',
  "if (kind === WRAP)",
  "function beginPlay",
  'if (next.phase === "sill-hop")',
  "Next leftover is Hide",
  "spotsOff: 3.02",
  "sillHop: 0.38",
  "SPOTS,\n    SILL",
  "spotsPoint,",
  'if (target.kind === SPOTS)',
  'leave: "mantled"',
];
for (const c of checks) console.log(js.includes(c) ? "OK" : "MISS", c.slice(0, 70));
const dur = js.match(/const DUR = \{[\s\S]*?\n  \};/);
const nums = [...dur[0].matchAll(/(\w+):\s*([\d.]+)/g)];
const used = new Set(nums.map((m) => Number(m[2])));
console.log("spots DUR", nums.filter((m) => m[1].startsWith("spots")));
const free = [];
for (let i = 250; i < 650; i++) {
  const v = i / 100;
  if (![...used].some((u) => Math.abs(u - v) < 1e-9)) free.push(v.toFixed(2));
}
console.log("free sample", free.filter((v) => Number(v) > 2.8 && Number(v) < 6.2).slice(0, 40));
const ts = fs.readFileSync("web/src/lib/pets/window-play.ts", "utf8");
console.log("TS Next leftover Hide", ts.includes("Next leftover is Hide"));
console.log("TS SPOTS", ts.includes('export const SPOTS = "spots"') || ts.includes('const SPOTS = "spots"'));
