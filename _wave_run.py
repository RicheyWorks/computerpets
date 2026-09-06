import subprocess, sys
cmds = [
    ["node", "--test", r"desktop\renderer\leftover-house.test.cjs"],
]
r = subprocess.run(cmds[0], cwd=r"C:\Users\730ri\projects\ComputerPets")
sys.exit(r.returncode)
