from pathlib import Path
t = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
print("Ghost do not start", t.count("Next leftover is Ghost. Do not start Ghost."))
print("Ghost is done", t.count("Ghost is done"))
print("second leftover of the remaining hive den done", t.count("Second leftover of the remaining hive den done"))
