from pathlib import Path
js = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.js").read_text(encoding="utf-8")
# find api = { and list const names around SIP
i = js.rfind("const api =")
if i<0:
    i = js.rfind("  const api =")
print("api idx", i)
chunk = js[i:i+2500]
print(chunk[:1500])
print("--- SIP WRAP GOLD SNIP in api chunk ---")
api_end = js.find("};", i)
api = js[i:api_end]
for name in ["SIP", "WRAP", "SNIP", "GOLD", "DRONE", "LAY", "DRAW", "FORAGE", "WAGGLE", "WEED", "CASTINGS"]:
    print(name, name in api)
