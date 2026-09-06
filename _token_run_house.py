import subprocess, sys
r = subprocess.run(
    ["node", "--test", r"desktop\renderer\leftover-house.test.cjs"],
    cwd=r"C:\Users\730ri\projects\ComputerPets",
)
sys.exit(r.returncode)
