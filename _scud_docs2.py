from pathlib import Path

def load(p):
    b = Path(p).read_bytes()
    crlf = b"\r\n" in b
    t = b.decode("utf-8").replace("\r\n", "\n")
    return t, crlf

def save(p, t, crlf):
    if crlf:
        t = t.replace("\n", "\r\n")
    Path(p).write_bytes(t.encode("utf-8"))

def once(t, old, new, label):
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}")
    return t.replace(old, new, 1)

ADD = " Scud sides a window well as a side pool: walk into the well, swim the side, then leave. Thread still owns thrash. Armor still owns roll. Silver still owns go. This closes log ten."

for p, old in [
    ("README.md", "This is the ninth log leftover. Other guests walk a sill."),
    ("desktop/README.md", "This is the ninth log leftover. Other guests walk a sill."),
]:
    t, crlf = load(p)
    t = once(t, old, "This is the ninth log leftover." + ADD + " Other guests walk a sill.", p)
    save(p, t, crlf)
    print("updated", p)

t, crlf = load("docs/ARCHITECTURE.md")
old = "Thread thrashes a glazing rebate as a soil film; ninth log leftover done; next leftover is Scud; catalog stays 220; thrash is the round tell; Wick still owns thread; Half still owns split; Tun still owns dry; Hop still owns spring; Cast still owns band"
new = "Scud sides a window well as a side pool; tenth log leftover done; log ten closed; next leftover is Wave; catalog stays 220; side is the tell; Thread still owns thrash; Armor still owns roll; Silver still owns go; Wick still owns thread; Half still owns split; Tun still owns dry"
t = once(t, old, new, "arch stamp")
save("docs/ARCHITECTURE.md", t, crlf)
print("architecture ok")

t, crlf = load("docs/ROADMAP.md")
n = t.count("Next leftover is Scud. Do not start Scud.")
print("roadmap next-scud", n)
if n < 1:
    raise SystemExit("no Next leftover is Scud")
t = t.replace("Next leftover is Scud. Do not start Scud.", "Scud is done. Tenth log leftover done. Log ten closed. Next leftover is Wave. Do not start Wave.")
old = "Phase 6 leftover: Thread thrashes a glazing rebate as a soil film; ninth log leftover done; next leftover is Scud; catalog stays 220; thrash is the round tell; Wick still owns thread; Half still owns split; Tun still owns dry; Hop still owns spring; Cast still owns band"
new = "Phase 6 leftover: Scud sides a window well as a side pool; tenth log leftover done; log ten closed; next leftover is Wave; catalog stays 220; side is the tell; Thread still owns thrash; Armor still owns roll; Silver still owns go; Wick still owns thread"
t = once(t, old, new, "roadmap stamp")

SCUD_ITEM = '''- [x] Scud (`amphipod` / `scud`) sides a real window well as a side pool: walk into the well (the pool — the same furniture family Silver goes as a bank hole, Whisk barbels as a mud run, Beak snaps as a mud bowl, Spike crowns as a sand tray, and Coal browses as an oak denside, not Silver's go, not Whisk's barbel, not Beak's snap, not Spike's crown, not Coal's browse, not Thread's glazing-rebate thrash, not Armor's window-stool roll), swim the side (the tell — she swims on her side; a Gammarus scud; not Pinch; not a pillbug, not Armor; named: Scud. The side is the tell. Hours: "Inside the pool." Hello: "I swam on my side. Hello." Visitor: "I swam on my side. Then I left the pool." Ambient: "I sit. Then I scud. Then I sit." Temperament: scudding.), then leave. One window. The side is the tell — not Silver's `go`. Not Whisk's `barbel`. Not Beak's `snap`. Not Spike's `crown`. Not Coal's `browse`. Not Thread's `thrash`. Not Armor's `roll`. playFor("amphipod") returns `side` (not `scud`, not `thrash`, not `roll`). Thread (`nematode`) still owns `thrash`. Wick (`ferret`) still owns `thread`. Half (`planarian`) still owns `split`. Tun (`tardigrade`) still owns `dry`. Hop (`springtail`) still owns `spring`. Armor (`pillbug`) still owns `roll`. Silver (`american_eel`) still owns `go`. Same `playFor` door. `/demo/scud` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Tenth log leftover. Log ten closed. Next leftover is Wave. Do not start Wave.
'''
marker = "- [x] Thread (`nematode` / `thread`) thrashes a real window glazing rebate as a soil film:"
idx = t.find(marker)
if idx < 0:
    raise SystemExit("Thread item missing")
rest = t[idx + 1:]
nxt = rest.find("\n- [x] ")
if nxt < 0:
    raise SystemExit("Thread item end missing")
insert_at = idx + 1 + nxt + 1
t = t[:insert_at] + SCUD_ITEM + t[insert_at:]
save("docs/ROADMAP.md", t, crlf)
print("roadmap ok")
