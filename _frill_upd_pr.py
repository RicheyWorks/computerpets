from pathlib import Path
p = Path("_frill_pr_body.md")
t = p.read_text(encoding="utf-8")
t = t.replace(
    "- [x] node --test desktop/renderer/window-play.test.cjs desktop/renderer/leftover-house.test.cjs\n- [x] node --experimental-strip-types --test web/scripts/window-play.test.mjs\n",
    "- [x] node --test desktop/renderer/window-play.test.cjs desktop/renderer/leftover-house.test.cjs (383 pass)\n- [x] node --experimental-strip-types --test web/scripts/window-play.test.mjs (200 pass)\n",
)
p.write_text(t, encoding="utf-8")
print("ok")
