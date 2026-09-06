
const P = require("./desktop/renderer/window-play.js");
const p = P.songPath(0.5);
console.log(JSON.stringify(p));
console.log("absrot", Math.abs(p.rot));
