const fs = require("fs");
const cjs = fs.readFileSync("desktop/renderer/window-play.test.cjs", "utf8");
// find sill leftover / generic sill tests
const re = /test\("([^"]*(?:[Ss]ill|grouper|generic)[^"]*)"\)/g;
let m; while ((m = re.exec(cjs))) console.log("TEST:", m[1].slice(0,160));
// also find last Soar test start
const i = cjs.lastIndexOf('test("Soar leftover');
console.log("soar test at", i);
console.log(cjs.slice(i, i+200));
// station size gate
const js = fs.readFileSync("desktop/renderer/window-play.js","utf8");
const g = [...js.matchAll(/if \(kind === (\w+)\) return w\.width >= (\d+) && w\.height >= (\d+)/g)];
console.log("size gates last 15:", g.slice(-15).map(x=>x[0]));
