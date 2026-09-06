from pathlib import Path
bt = Path("_beacon_tests.py").read_text(encoding="utf-8")
# find pin_generic and append logic
i = bt.find("def pin_generic")
print(bt[i:i+900] if i>=0 else "no pin_generic")
print("====")
i = bt.find("pin_generic")
print("all pin mentions")
for j, line in enumerate(bt.splitlines()):
    if "pin" in line.lower() or "umbral" in line or "append" in line.lower() or "TEST_BLOCK" in line and "write" in line or "window-play.test" in line or "mjs" in line:
        print(f"{j+1}:{line[:200]}")
