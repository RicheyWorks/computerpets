const fs = require("fs");
const lines = fs.readFileSync("desktop/renderer/window-play.js", "utf8").split(/\n/);
function dump(start, n) {
  for (let i = start - 1; i < start - 1 + n && i < lines.length; i++) {
    console.log((i + 1) + ":" + lines[i]);
  }
  console.log("====");
}
dump(1148, 70);
dump(2178, 30);
dump(2365, 30);
dump(3117, 30);
dump(3978, 45);
dump(7528, 20);
dump(8402, 20);
dump(9251, 20);
dump(11946, 80);
dump(12158, 20);
dump(15461, 80);
dump(16050, 25);
dump(24775, 20);
dump(25615, 20);
