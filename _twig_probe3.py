from pathlib import Path
import re
for p in ["web/src/lib/pets/hive.ts","web/src/lib/pets/insects.ts","web/src/lib/pets/insect-guide.ts","docs/ROADMAP.md"]:
    text = Path(p).read_text(encoding="utf-8")
    print("====", p)
    if p.endswith(".md"):
        for m in re.finditer("Twig|Jewel|Column|Seven|Fold|Brood|next leftover", text):
            i=m.start();
            print(text[max(0,i-60):i+140].replace("\n"," | "))
            print()
    else:
        print(re.findall(r'key:\s*"([^"]+)"', text)[:50])
        print(re.findall(r'slug:\s*"([^"]+)"', text)[:50])
