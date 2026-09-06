from pathlib import Path
for p in ["README.md","desktop/README.md"]:
    t=Path(p).read_text(encoding="utf-8")
    idx=t.find("Nimbus floats")
    print(p, "idx", idx)
    if idx>=0:
        print(t[idx:idx+500])
        print("---")
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
idx=rm.find("Nimbus (`nimbus`")
print("RM nimbus idx", idx)
print(rm[idx:idx+900] if idx>=0 else "missing")
print("---")
idx2=rm.find("next leftover is Silica")
print("next silica", idx2, rm[idx2-80:idx2+120] if idx2>=0 else "")
arch=Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
for line in arch.splitlines():
    if "Last Updated" in line:
        print("FULL ARCH:", line)
