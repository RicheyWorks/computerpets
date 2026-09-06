const fs = require("fs");
const ts = fs.readFileSync("web/src/lib/pets/window-play.ts", "utf8");
for (const s of ["mantled","spotted","rayed","papillaed","stationed","holed","mantledish","reefsky","reefledge","sandwell"]) {
  const i = ts.indexOf('"'+s+'"');
  console.log(s, i);
}
// find leave: field type
const li = ts.indexOf("leave:");
console.log("leave field", JSON.stringify(ts.slice(li, li+80)));
