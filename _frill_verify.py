js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
for k in ["goldOn","leanOn","boreOn","foldOn","seedOn","shelfOn","SHELF","oyster"]:
    print(k, js.find(k))
# exports shelf?
print("export shelfPoint", "shelfPoint" in js[js.find("module.exports"):js.find("module.exports")+2500] if "module.exports" in js else "no me")
i=js.find("shelfPoint,")
print("shelfPoint near export", i)
print(repr(js[i-50:i+200]) if i>0 else None)
