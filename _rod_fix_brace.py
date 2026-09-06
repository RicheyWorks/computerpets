from pathlib import Path
js_path = Path("desktop/renderer/window-play.js")
js = js_path.read_text(encoding="utf-8")

# Fix: after trumpeted return, close TRUMPET if before TUMBLE if
bad = '''        leave: "trumpeted",
        spin: "none",
      };
    if (kind === TUMBLE) {'''
good = '''        leave: "trumpeted",
        spin: "none",
      };
    }
    if (kind === TUMBLE) {'''
assert bad in js
js = js.replace(bad, good, 1)

# Also ensure TUMBLE block closes before next if
i = js.find('side: "brothcup"')
# find end of TUMBLE return and following
j = js.find('leave: "tumbled"', i)
chunk = js[j:j+200]
print("after tumbled:", repr(chunk))
# expect };
#    }
#    if (kind ===
if 'leave: "tumbled",\n        spin: "none",\n      };\n    if (kind ===' in js:
  js = js.replace(
    'leave: "tumbled",\n        spin: "none",\n      };\n    if (kind ===',
    'leave: "tumbled",\n        spin: "none",\n      };\n    }\n    if (kind ===',
    1,
  )
  print("closed TUMBLE if")
elif 'leave: "tumbled",\n        spin: "none",\n      };\n    }\n    if (kind ===' in js:
  print("TUMBLE already closed")
else:
  print("UNEXPECTED", repr(js[j:j+120]))

js_path.write_text(js, encoding="utf-8", newline="\n")
i = js.find('side: "trumpetrim"')
print(repr(js[i:i+550]))
