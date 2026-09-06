js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
# find gold/lean/fold/seed/bore owners
for kind, const in [("gold","GOLD"),("lean","LEAN"),("fold","FOLD"),("seed","SEED"),("bore","BORE"),("unfurl","UNFURL")]:
    i=0
    hits=[]
    while True:
        j=js.find('return %s;'%const, i)
        if j<0: break
        hits.append(repr(js[j-80:j+20]))
        i=j+10
    print(const, hits[:3])
# WIN size in tests
c=open("desktop/renderer/window-play.test.cjs",encoding="utf-8").read()
i=c.find("const WIN =")
print("WIN", repr(c[i:i+120]))
