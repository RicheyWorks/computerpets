const fs = require("fs");
const lines = fs.readFileSync("desktop/renderer/window-play.js", "utf8").split(/\n/);
function find(name) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("function " + name + "(")) return i + 1;
  }
  return -1;
}
const names = ["plowPoint","storePoint","digPoint","buryPoint","oilPoint","rollPoint","bandPoint","chewPoint","planePoint","seedPoint","flipPoint","sprayPoint","bankPoint"];
for (const n of names) {
  const ln = find(n);
  console.log("==== " + n + " @ " + ln);
  if (ln > 0) {
    for (let i = ln - 1; i < ln - 1 + 14 && i < lines.length; i++) console.log((i+1)+":"+lines[i]);
  }
}
// DUR block around signal
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("signalOn:") || lines[i].includes("sideOn:") || lines[i].includes("plowOn:") || lines[i].includes("runOn:") || lines[i].includes("storeOn:") || lines[i].includes("digOn:") || lines[i].includes("buryOn:")) {
    console.log("DUR "+(i+1)+":"+lines[i].trim());
  }
}
// playFor around fiddler
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('key === "fiddler_crab"') || lines[i].includes('key === "ghost_crab"') || lines[i].includes('key === "amphipod"') || lines[i].includes('key === "solifuge"') || lines[i].includes('key === "hermit_crab"') || lines[i].includes('key === "horseshoe_crab"') || lines[i].includes('key === "tardigrade"')) {
    console.log("PF "+(i+1)+":"+lines[i].trim());
  }
}
