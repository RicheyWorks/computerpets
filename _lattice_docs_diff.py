import subprocess
t = subprocess.check_output(['git','show','835de6fd','--','README.md','desktop/README.md','docs/ARCHITECTURE.md'], text=True, encoding='utf-8')
for i, line in enumerate(t.splitlines()):
    if line.startswith(('+','-','diff','@@')):
        print(f"{i}:{line[:400]}")
