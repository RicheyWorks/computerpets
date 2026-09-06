from pathlib import Path
js_path = Path("desktop/renderer/window-play.js")
js = js_path.read_text(encoding="utf-8")

# Show the broken region
i = js.find('leave: "trumpeted"')
print("BEFORE FIX:")
print(repr(js[i:i+450]))

PICK = '''    if (kind === TUMBLE) {
      const hold = tumblePoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -66 : 66;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 60 : -60;
      return {
        id: best.id,
        kind,
        side: "brothcup",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "tumbled",
        spin: "none",
      };
    }
'''

# Remove wrongly nested block (between trumpet return and next if that was WRAP or similar)
bad_start = js.find("    if (kind === TUMBLE) {")
# only the pickTarget one near trumpeted
bad_start = js.find('leave: "trumpeted"')
# find nested TUMBLE after that
nested = js.find("    if (kind === TUMBLE) {", bad_start)
assert nested > 0
# find end of nested block - matching braces
depth = 0
k = nested
while k < len(js):
  if js[k] == "{":
    depth += 1
  elif js[k] == "}":
    depth -= 1
    if depth == 0:
      end = k + 1
      break
  k += 1
# remove nested including leading newline
if js[nested-1] == "\n":
  nested -= 0
chunk = js[nested:end]
assert "brothcup" in chunk
# Also need the closing } of TRUMPET if - currently might be missing or after nested

# Reconstruct: trumpeted return, close TRUMPET if, then TUMBLE block
marker = '        leave: "trumpeted",\n        spin: "none",\n      };'
idx = js.find(marker)
assert idx >= 0
after = idx + len(marker)
# current after should be nested TUMBLE then maybe } for trumpet
rest = js[after:]
# remove nested TUMBLE if present at start
if rest.lstrip().startswith("if (kind === TUMBLE)"):
  # find where nested ends
  ns = js.find("    if (kind === TUMBLE) {", after)
  depth = 0
  k = ns
  while k < len(js):
    if js[k] == "{":
      depth += 1
    elif js[k] == "}":
      depth -= 1
      if depth == 0:
        ne = k + 1
        break
    k += 1
  # after nested, expect closing } of TRUMPET or next if
  after_nested = js[ne:]
  # skip whitespace
  stripped = after_nested.lstrip("\n")
  if stripped.startswith("    }"):
    # already has closing brace for TRUMPET
    js = js[:after] + "\n" + PICK + after_nested
  else:
    # need to close TRUMPET if then add TUMBLE
    js = js[:after] + "\n    }\n" + PICK + js[ne:]
else:
  raise SystemExit("unexpected layout: " + repr(rest[:80]))

js_path.write_text(js, encoding="utf-8", newline="\n")
i = js.find('leave: "trumpeted"')
print("AFTER FIX:")
print(repr(js[i:i+500]))
