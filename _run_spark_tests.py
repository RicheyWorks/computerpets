import subprocess, sys
cmd = [sys.executable.replace("python.exe","node.exe").replace("python","node"), "--test", "--test-name-pattern=Spark the firefly|ink-dusk glow", "desktop/renderer/window-play.test.cjs"]
# node is on PATH
cmd = ["node", "--test", "--test-name-pattern=Spark the firefly|ink-dusk glow", "desktop/renderer/window-play.test.cjs"]
r = subprocess.run(cmd)
sys.exit(r.returncode)
