from pathlib import Path
js_path = Path("desktop/renderer/window-play.js")
js = js_path.read_text(encoding="utf-8")
bad = '''        leave: "tumbled",
        spin: "none",
      };
    }

    }        if (kind === WRAP) {'''
good = '''        leave: "tumbled",
        spin: "none",
      };
    }
    if (kind === WRAP) {'''
assert bad in js, repr(js[js.find('leave: "tumbled"'):js.find('leave: "tumbled"')+180])
js = js.replace(bad, good, 1)
js_path.write_text(js, encoding="utf-8", newline="\n")
print("fixed")
print(repr(js[js.find('leave: "tumbled"'):js.find('leave: "tumbled"')+160]))
