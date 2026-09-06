import subprocess, sys
r = subprocess.run(
    ["node", "--test", "--test-name-pattern", "Wave|walk a sill|Scud sides", r"desktop\renderer\window-play.test.cjs"],
    cwd=r"C:\Users\730ri\projects\ComputerPets",
)
sys.exit(r.returncode)
