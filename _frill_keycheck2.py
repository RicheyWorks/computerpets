from pathlib import Path
t = Path("_frill_tests.py").read_text(encoding="utf-8")
for s in ["sugar_glider", "squirrel", "bat", "oak", "ginkgo", "moss", "carpenter_bee"]:
    print(s, t.count(s))
# show lines with sugar or squir
for i, line in enumerate(t.splitlines(), 1):
    if "sugar" in line or "squir" in line or 'playFor("bat")' in line or 'playFor("oak")' in line:
        print(i, line.strip()[:120])
