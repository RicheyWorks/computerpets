from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("umbral count", js.count("umbral"))
print("QUIET count", js.count("QUIET"))
print("quiet count", js.count("quiet"))
# dump all line numbers with QUIET or quietPoint or umbral
for i,line in enumerate(js.splitlines(),1):
    if "QUIET" in line or "quietPoint" in line or "umbral" in line or "quieted" in line or "lampshadow" in line or "quiet-on" in line:
        if len(line)<180:
            print(f"{i}: {line}")
        else:
            print(f"{i}: {line[:160]}...")
