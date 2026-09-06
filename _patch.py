from pathlib import Path

def add_file_url(path):
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if "pathToFileURL" in text and "pathToFileURL(join" in text:
        print("already", path)
        return
    text = text.replace(
        'import { fileURLToPath } from "node:url";',
        'import { fileURLToPath, pathToFileURL } from "node:url";',
    )
    # replace await import(join(...)) with pathToFileURL
    import re
    text = re.sub(
        r"await import\(join\(([^)]+)\)\)",
        r"await import(pathToFileURL(join(\1)).href)",
        text,
    )
    p.write_text(text, encoding="utf-8")
    print("patched", path)

for f in [
    "web/scripts/call-guests.test.mjs",
    "web/scripts/robin-fly.test.mjs",
    "web/scripts/desk-plants.test.mjs",
]:
    add_file_url(f)
