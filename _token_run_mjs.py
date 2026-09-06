import subprocess, sys
r = subprocess.run(
    ["node", "--experimental-strip-types", "--test", "--test-name-pattern=Token", r"web\scripts\window-play.test.mjs"],
    cwd=r"C:\Users\730ri\projects\ComputerPets",
)
sys.exit(r.returncode)
