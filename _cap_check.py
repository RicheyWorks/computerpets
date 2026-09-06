from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for c in [
    'next.phase === "warts-on"',
    'next.phase === "warts"',
    'next.phase === "warts-hold"',
    'next.phase === "warts-off"',
    "target.kind === WARTS",
    'key === "fly_agaric"',
]:
    print(c, js.count(c))
