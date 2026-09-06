import subprocess, sys
sys.exit(subprocess.call(["node", "--test", r"desktop\renderer\window-play.test.cjs"]))