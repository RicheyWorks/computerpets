from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# find playFor tail, CERCI, exports of net, header
i = ts.find('if (key === "lacewing")')
print("PLAYFOR", ts[i:i+400])
i = ts.find("export const CERCI")
print("CONST", ts[i:i+120] if i>=0 else "no CERCI const")
i = ts.find("cerciOn:")
print("DUR", ts[max(0,i-80):i+120])
i = ts.find("export function cerciPoint")
print("FNS", i)
# type PlayKind includes cerci?
i = ts.find("PlayKind")
print("PlayKind area", ts[i:i+800][:500])
# find | "cerci"
print("cerci in types", ts.find('| "cerci"'))
print("net in types", ts.find('| "net"'))
