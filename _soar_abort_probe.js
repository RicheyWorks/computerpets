
const P = require("./desktop/renderer/window-play.js");
console.log("mantle", P.shouldAbort({ phase: "mantle" }, { asleep: true, cmd: "sleep" }));
console.log("spots", P.shouldAbort({ phase: "spots" }, { asleep: true, cmd: "sleep" }));
console.log("onearg sleep", P.shouldAbort({ asleep: true, cmd: "sleep" }));
console.log("len", P.shouldAbort.length);
