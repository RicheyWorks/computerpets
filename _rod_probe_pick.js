
const P = require("./desktop/renderer/window-play.js");
const WIN = { id: "w", x: 200, y: 80, width: 420, height: 320 };
const WORK = { x: 0, y: 0, width: 1600, height: 900 };
console.log("playFor", P.playFor("coli"));
const t = P.pickTarget([WIN], 80, "coli", WORK, P.SPRITE);
console.log(t);
const t2 = P.pickTarget([{id:"ok",x:200,y:80,width:192,height:186}], 80, "coli", WORK, P.SPRITE);
console.log("ok", t2);
