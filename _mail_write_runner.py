from pathlib import Path
Path(r"C:\Users\730ri\projects\ComputerPets\_run_mjs_strip.py").write_text(
    "import subprocess, sys\n"
    "r = subprocess.run([\n"
    "    'node', '--experimental-strip-types', '--test', r'web\\scripts\\window-play.test.mjs'\n"
    "], cwd=r'C:\\Users\\730ri\\projects\\ComputerPets')\n"
    "sys.exit(r.returncode)\n",
    encoding="utf-8",
    newline="\n",
)
print("wrote runner")
