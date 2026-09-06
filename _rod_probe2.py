js=open('desktop/renderer/window-play.js',encoding='utf-8').read()
i=js.find('if (kind === TUMBLE)')
print('all TUMBLE kind hits:')
idx=0
while True:
  j=js.find('kind === TUMBLE', idx)
  if j<0: break
  print(j, repr(js[j-40:j+350].replace('\n','|')))
  idx=j+1
print('--- WIN in tests ---')
c=open('desktop/renderer/window-play.test.cjs',encoding='utf-8').read()
i=c.find('const WIN =')
print(repr(c[i:i+120]))
# runtime probe
open('_rod_probe_pick.js','w',encoding='utf-8').write('''
const P = require("./desktop/renderer/window-play.js");
const WIN = { id: "w", x: 200, y: 80, width: 420, height: 320 };
const WORK = { x: 0, y: 0, width: 1600, height: 900 };
console.log("playFor", P.playFor("coli"));
const t = P.pickTarget([WIN], 80, "coli", WORK, P.SPRITE);
console.log(t);
const t2 = P.pickTarget([{id:"ok",x:200,y:80,width:192,height:186}], 80, "coli", WORK, P.SPRITE);
console.log("ok", t2);
''')
