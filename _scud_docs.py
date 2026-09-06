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

MJS = r'''
test("the demo window plate walks Scud side the same way", () => {
  const WIN_B = { id: "hw2", x: 980, y: 90, width: 300, height: 360 };
  assert.match(demoSrc, /demoWindow/);
  assert.match(livingSrc, /playFor/);
  assert.match(readFileSync(join(root, "src/lib/pets/log.ts"), "utf8"), /key: "amphipod"[\s\S]{0,80}slug: "scud"/);
  assert.equal(P.playFor("amphipod"), "side");
  const target = P.pickTarget([WIN], 80, "amphipod", WORK, 176);
  assert.ok(target);
  assert.equal(target.kind, "side");
  assert.equal(target.side, "sidepool");
  assert.equal(target.leave, "sides");
  assert.equal(Overlay.playFor("amphipod"), "side");
  assert.equal(P.SIDE, "side");
  assert.equal(Overlay.SIDE, "side");
  assert.equal(P.playFor("nematode"), "thrash");
  assert.equal(Overlay.playFor("nematode"), "thrash");
  assert.equal(P.playFor("ferret"), "thread");
  assert.equal(Overlay.playFor("ferret"), "thread");
  assert.equal(P.playFor("planarian"), "split");
  assert.equal(P.playFor("tardigrade"), "dry");
  assert.equal(P.playFor("pillbug"), "roll");
  assert.equal(P.playFor("american_eel"), "go");
  assert.equal(P.playFor("fiddler_crab"), "sill");
  assert.equal(Overlay.playFor("fiddler_crab"), "sill");
  assert.notEqual(P.playFor("amphipod"), "scud");
  assert.notEqual(P.playFor("amphipod"), "thrash");
  assert.notEqual(P.playFor("amphipod"), "roll");
  assert.notEqual(P.playFor("amphipod"), "go");
  assert.notEqual(P.playFor("amphipod"), "sill");
  assert.equal(P.DUR.sideOn, Overlay.DUR.sideOn);
  assert.equal(P.DUR.side, Overlay.DUR.side);
  assert.equal(P.DUR.sideHold, Overlay.DUR.sideHold);
  assert.equal(P.DUR.sideOff, Overlay.DUR.sideOff);
  assert.ok(P.DUR.sideOn !== Overlay.DUR.thrashOn);
  assert.ok(P.DUR.sideOn !== Overlay.DUR.goOn);
  assert.ok(P.DUR.sideOn !== Overlay.DUR.rollOn);
  const pool = P.sidePoint(WIN, 176, WORK);
  const deskPool = Overlay.sidePoint(WIN, Overlay.SPRITE, WORK);
  const hole = P.goPoint(WIN, 176, WORK);
  const run = P.barbelPoint(WIN, 176, WORK);
  const rebate = P.thrashPoint(WIN, 176, WORK);
  assert.ok(Math.abs(pool.x - deskPool.x) < 1);
  assert.ok(Math.abs(pool.lift - deskPool.lift) < 1);
  assert.ok(Math.abs(pool.lift - hole.lift) < 2, "same well family as Silver, different pose");
  assert.ok(Math.abs(pool.x - hole.x) > 8, "not Silver go");
  assert.ok(pool.lift > 16, "side pool, the well");
  assert.ok(Math.abs(pool.x - run.x) > 8, "not Whisk barbel");
  assert.ok(Math.abs(pool.x - rebate.x) > 8 || Math.abs(pool.lift - rebate.lift) > 8, "not Thread thrash");
  const tiny = P.pickTarget([{ id: "tiny", x: 200, y: 80, width: 120, height: 50 }], 80, "amphipod", WORK, 176);
  assert.equal(tiny, null, "a real window well");
  const okWell = P.pickTarget([{ id: "well", x: 200, y: 80, width: 178, height: 162 }], 80, "amphipod", WORK, 176);
  assert.ok(okWell, "a real window well as a side pool");
  const walkOn = P.sideOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  const deskWalk = Overlay.sideOnPath(0.25, { x: 40, lift: 0 }, { x: pool.x, lift: pool.lift });
  assert.equal(walkOn.x, deskWalk.x);
  assert.equal(walkOn.lift, deskWalk.lift);
  const swim = P.sidePath(0.5);
  const deskSwim = Overlay.sidePath(0.5);
  assert.equal(swim.x, deskSwim.x);
  assert.ok(Math.abs(swim.rot) > 70, "a side, the tell");
  assert.ok(swim.rot !== P.goPath(0.5).rot, "a side, not a go");
  assert.ok(swim.rot !== P.thrashPath(0.5).rot, "a side, not a thrash");
  const hold = P.sideHoldPath(0.5);
  const deskHold = Overlay.sideHoldPath(0.5);
  assert.equal(hold.x, deskHold.x);
  assert.equal(hold.lift, deskHold.lift);
  let play = P.beginPlay(target, target.approachX);
  const seen = new Set();
  const windowIds = new Set();
  for (let i = 0; i < 2400 && play.phase !== "done"; i++) {
    seen.add(play.phase);
    if (play.target && play.target.id) windowIds.add(play.target.id);
    play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [WIN, WIN_B], WORK, 176, { cmd: "idle" });
    if (play.phase === "side") {
      assert.equal(play.anim, "play");
    }
    if (play.phase === "side-on") {
      assert.equal(play.anim, "walk");
    }
    if (play.phase === "side-hold" && play.t > 0) {
      assert.equal(play.anim, "sit");
      assert.ok(Math.abs(play.lift - (play.target.holdLift - 4.4)) < 3, "she holds the sit on her side in the pool");
    }
  }
  assert.ok(seen.has("side-on"));
  assert.ok(seen.has("side"));
  assert.ok(seen.has("side-hold"));
  assert.ok(seen.has("side-off"));
  assert.equal(windowIds.size, 1, "one window");
  assert.equal(play.phase, "done");
});
'''

t, crlf = load("web/scripts/window-play.test.mjs")
if "the demo window plate walks Scud side the same way" in t:
    raise SystemExit("mjs already has Scud test")
if not t.endswith("\n"):
    t += "\n"
t += MJS
save("web/scripts/window-play.test.mjs", t, crlf)
print("mjs tests appended")

# docs
HEADER_OLD = "Thread thrashes a glazing rebate as a soil film: walk into the rebate, thrash the round, then leave. Wick still owns thread. Half still owns split. Tun still owns dry. This is the ninth log leftover."
HEADER_ADD = " Scud sides a window well as a side pool: walk into the well, swim the side, then leave. Thread still owns thrash. Armor still owns roll. Silver still owns go. This closes log ten."

for p in ["README.md", "desktop/README.md"]:
    t, crlf = load(p)
    t = once = None
    n = t.count(HEADER_OLD)
    if n != 1:
        # try Other guests variant already including ninth leftover
        alt = HEADER_OLD
        print(p, "header count", n)
        if n == 0:
            raise SystemExit(f"{p} missing ninth leftover header")
    t = t.replace(HEADER_OLD, HEADER_OLD + HEADER_ADD, 1)
    save(p, t, crlf)
    print("docs header", p)

t, crlf = load("docs/ARCHITECTURE.md")
old = "2026-09-01 (Thread thrashes a glazing rebate as a soil film; ninth log leftover done; next leftover is Scud; catalog stays 220; thrash is the round tell; Wick still owns thread; Half still owns split; Tun still owns dry; Hop still owns spring; Cast still owns band)"
new = "2026-09-01 (Scud sides a window well as a side pool; tenth log leftover done; log ten closed; next leftover is Wave; catalog stays 220; side is the tell; Thread still owns thrash; Armor still owns roll; Silver still owns go; Wick still owns thread; Half still owns split; Tun still owns dry)"
n = t.count(old)
print("arch last-updated count", n)
if n != 1:
    raise SystemExit("architecture last-updated mismatch")
t = t.replace(old, new, 1)
save("docs/ARCHITECTURE.md", t, crlf)

t, crlf = load("docs/ROADMAP.md")
n = t.count("Next leftover is Scud. Do not start Scud.")
print("roadmap next-scud count", n)
if n < 1:
    raise SystemExit("roadmap missing next leftover is Scud")
t = t.replace("Next leftover is Scud. Do not start Scud.", "Scud is done. Tenth log leftover done. Log ten closed. Next leftover is Wave. Do not start Wave.")
old = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Thread thrashes a glazing rebate as a soil film; ninth log leftover done; next leftover is Scud; catalog stays 220; thrash is the round tell; Wick still owns thread; Half still owns split; Tun still owns dry; Hop still owns spring; Cast still owns band)"
new = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Scud sides a window well as a side pool; tenth log leftover done; log ten closed; next leftover is Wave; catalog stays 220; side is the tell; Thread still owns thrash; Armor still owns roll; Silver still owns go; Wick still owns thread)"
n = t.count(old)
print("roadmap last-updated count", n)
if n != 1:
    raise SystemExit("roadmap last-updated mismatch")
t = t.replace(old, new, 1)

SCUD_ITEM = '''- [x] Scud (`amphipod` / `scud`) sides a real window well as a side pool: walk into the well (the pool — the same furniture family Silver goes as a bank hole, Whisk barbels as a mud run, Beak snaps as a mud bowl, Spike crowns as a sand tray, and Coal browses as an oak denside, not Silver's go, not Whisk's barbel, not Beak's snap, not Spike's crown, not Coal's browse, not Thread's glazing-rebate thrash, not Armor's window-stool roll), swim the side (the tell — she swims on her side; a Gammarus scud; not Pinch; not a pillbug, not Armor; named: Scud. The side is the tell. Hours: "Inside the pool." Hello: "I swam on my side. Hello." Visitor: "I swam on my side. Then I left the pool." Ambient: "I sit. Then I scud. Then I sit." Temperament: scudding.), then leave. One window. The side is the tell — not Silver's `go`. Not Whisk's `barbel`. Not Beak's `snap`. Not Spike's `crown`. Not Coal's `browse`. Not Thread's `thrash`. Not Armor's `roll`. playFor("amphipod") returns `side` (not `scud`, not `thrash`, not `roll`). Thread (`nematode`) still owns `thrash`. Wick (`ferret`) still owns `thread`. Half (`planarian`) still owns `split`. Tun (`tardigrade`) still owns `dry`. Hop (`springtail`) still owns `spring`. Armor (`pillbug`) still owns `roll`. Silver (`american_eel`) still owns `go`. Same `playFor` door. `/demo/scud` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Tenth log leftover. Log ten closed. Next leftover is Wave. Do not start Wave.
'''

marker = "- [x] Thread (`nematode` / `thread`) thrashes a real window glazing rebate as a soil film:"
if marker not in t:
    raise SystemExit("roadmap missing Thread item")
# insert Scud item after the Thread item paragraph (until next '- [x]' or Tun/Jet nearby)
idx = t.find(marker)
# find end of Thread item: next line starting with '- [x]' after this one
rest = t[idx + 1:]
nxt = rest.find("\n- [x] ")
if nxt < 0:
    raise SystemExit("roadmap Thread item end not found")
insert_at = idx + 1 + nxt + 1
t = t[:insert_at] + SCUD_ITEM + t[insert_at:]
save("docs/ROADMAP.md", t, crlf)
print("roadmap ok")
