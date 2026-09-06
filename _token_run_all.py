import subprocess, sys
cmds = [
    ["node", "--test", r"desktop\renderer\window-play.test.cjs"],
    ["node", "--experimental-strip-types", "--test", r"web\scripts\window-play.test.mjs"],
]
code = 0
for cmd in cmds:
    print("RUN", " ".join(cmd), flush=True)
    r = subprocess.run(cmd, cwd=r"C:\Users\730ri\projects\ComputerPets")
    if r.returncode != 0:
        code = r.returncode
sys.exit(code)
