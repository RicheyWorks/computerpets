from pathlib import Path
old = "Snout still owns drill. Relay still owns click. Snap still owns snap. Bluff still owns flip. Spark the firefly still owns glow. "
new = "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
for p in ["_click_core.py", "_click_ts.py"]:
    t = Path(p).read_text(encoding="utf-8")
    if old not in t:
        raise SystemExit("missing old header in "+p)
    Path(p).write_text(t.replace(old, new), encoding="utf-8", newline="\n")
    print("fixed", p)
# also fix cjs test that said Snap still snap via playFor snapper - already has both
print("running patches...")
