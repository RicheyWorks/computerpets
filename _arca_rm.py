from pathlib import Path
readme=Path("README.md").read_text(encoding="utf-8")
i=readme.find("Hush cools")
print(repr(readme[i:i+500]))
print("---")
# find ninth leftover in readme
j=readme.find("ninth leftover of the far")
print("ninth", j, repr(readme[j:j+200]) if j>=0 else None)
