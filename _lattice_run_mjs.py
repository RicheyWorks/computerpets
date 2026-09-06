import subprocess, sys
r = subprocess.run(["node", "--test", "web/scripts/window-play.test.mjs"], cwd=r"C:\Users\730ri\projects\ComputerPets")
sys.exit(r.returncode)
