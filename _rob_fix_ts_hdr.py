from pathlib import Path
src = Path("_rob_ts.py").read_text(encoding="utf-8")
old = '''HEADER_OLD_TAIL = (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den. Others walk a sill. */"
)

HEADER_NEW_TAIL = (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den. "
    "Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave. "
    "Click still owns right. Relay still owns click. Haste still owns hunt. Dart still owns hawk. Sip still owns sip. Thrum still owns forage. Spine still owns bristle. Hook still owns soar. Leap still owns pounce. Hum still owns drone. "
    "This is the tenth leftover of the meadow den and closes meadow ten. Others walk a sill. */"
)'''
new = '''HEADER_OLD_TAIL = (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

HEADER_NEW_TAIL = (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den. "
    "Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave. "
    "Click still owns right. Relay still owns click. Haste still owns hunt. Dart still owns hawk. Sip still owns sip. Thrum still owns forage. Spine still owns bristle. Hook still owns soar. Leap still owns pounce. Hum still owns drone. "
    "This is the tenth leftover of the meadow den and closes meadow ten. Others walk a sill. Same map as desktop `window-play.js`. */"
)'''
if old not in src:
    raise SystemExit('block not found')
Path("_rob_ts.py").write_text(src.replace(old, new, 1), encoding="utf-8")
print('fixed')
