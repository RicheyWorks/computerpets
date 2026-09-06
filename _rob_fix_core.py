from pathlib import Path

# Fix the exports section in _rob_core.py and re-run
src = Path("_rob_core.py").read_text(encoding="utf-8")
old = '''    text = must_replace(
        text,
        "    RIGHT,\\n    rightPoint,\\n    rightFace,\\n    rightOnPath,\\n    rightPath,\\n    rightHoldPath,\\n    rightOffPath,",
        "    RIGHT,\\n    SEIZE,\\n    rightPoint,\\n    rightFace,\\n    rightOnPath,\\n    rightPath,\\n    rightHoldPath,\\n    rightOffPath,\\n    seizePoint,\\n    seizeFace,\\n    seizeOnPath,\\n    seizePath,\\n    seizeHoldPath,\\n    seizeOffPath,",
        "js exports",
    )'''
new = '''    text = must_replace(
        text,
        "    RIGHT,\\n    IGNORE,",
        "    RIGHT,\\n    SEIZE,\\n    IGNORE,",
        "js SEIZE export const",
    )
    text = must_replace(
        text,
        "    drillOffPath,\\n    rightPoint,\\n    rightFace,\\n    rightOnPath,\\n    rightPath,\\n    rightHoldPath,\\n    rightOffPath,\\n    pickTarget,",
        "    drillOffPath,\\n    rightPoint,\\n    rightFace,\\n    rightOnPath,\\n    rightPath,\\n    rightHoldPath,\\n    rightOffPath,\\n    seizePoint,\\n    seizeFace,\\n    seizeOnPath,\\n    seizePath,\\n    seizeHoldPath,\\n    seizeOffPath,\\n    pickTarget,",
        "js seize fn exports",
    )'''
if old not in src:
    raise SystemExit("could not find exports patch block")
Path("_rob_core.py").write_text(src.replace(old, new, 1), encoding="utf-8")
print("patched script")
