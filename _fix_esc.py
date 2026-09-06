from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\_thread_patch.py")
t = p.read_text(encoding="utf-8")
t = t.replace("\\\\n", "\\n")
t = t.replace('\\"', '"')
p.write_text(t, encoding="utf-8")
print("fixed")
print("sample", repr(t[t.find("export const SPLIT"):t.find("export const SPLIT")+90]))
