import subprocess, sys
r = subprocess.run(
    ["node", "--experimental-strip-types", "--test", r"scripts\window-play.test.mjs"],
    cwd=r"C:\Users\730ri\projects\ComputerPets\web",
)
sys.exit(r.returncode)
