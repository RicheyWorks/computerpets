from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
hdr = js[: js.find("*/") + 2]
print("===HDR TAIL===")
print(hdr[-600:])
print("===git status===")
import subprocess
print(subprocess.check_output(["git","status","-sb"], text=True).splitlines()[0])
print(subprocess.check_output(["git","diff","--stat","desktop/renderer/window-play.js"], text=True))
print("lionfish playFor line present:", 'key === "lionfish"' in js)
i = js.find('key === "lionfish"')
print(repr(js[i:i+60]))
print("FINS const:", "const FINS" in js)
i = js.find("const FINS")
print(repr(js[i:i+40]))
print("finsOn:", "finsOn:" in js)
print("rays:", "const RAYS" in js, "raysOn:" in js)
print("reefledge:", "reefledge" in js)
