from pathlib import Path
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i=ts.find('side: "left"')
# get full side union - find end at ;
chunk=ts[i:i+4000]
end=chunk.find(";")
print(chunk[:end+1])
print("====LEAVE====")
i=ts.find('leave?: "hop"')
chunk=ts[i:i+3000]
end=chunk.find(";")
print(chunk[:end+1])
print("has mantledish", "mantledish" in ts[ts.find('side: "left"'):ts.find('side: "left"')+4000])
print("has reefsky", "reefsky" in ts[ts.find('side: "left"'):ts.find('side: "left"')+4000])
print("has spotted leave", '"spotted"' in ts[ts.find('leave?:'):ts.find('leave?:')+3000])
print("has mantled leave", '"mantled"' in ts[ts.find('leave?:'):ts.find('leave?:')+3000])
