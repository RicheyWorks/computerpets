import re
js = open("desktop/renderer/window-play.js", encoding="utf-8").read()
# find playFor
idx = js.find("function playFor")
print("playFor idx", idx)
print(js[idx:idx+3500])
print("====KINDS====")
# collect return kind strings from playFor body until next function
end = js.find("\nfunction ", idx+1)
body = js[idx:end]
kinds = sorted(set(re.findall(r'return\s+"([a-z_]+)"', body)))
print("kinds in playFor:", len(kinds))
print("\n".join(kinds))
