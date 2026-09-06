from pathlib import Path
# how Cap changed fly_agaric sill pins
import subprocess
t = subprocess.check_output(['git','show','835de6fd','--','desktop/renderer/window-play.test.cjs'], text=True, encoding='utf-8')
# count replacements
print("fly_agaric sill minus", t.count('-  assert.equal(P.playFor("fly_agaric"), "sill")'))
print("morel sill plus", t.count('+  assert.equal(P.playFor("morel"), "sill")'))
print("pickTarget morel", t.count("morel"))
# show pickTarget changes
for i,line in enumerate(t.splitlines()):
    if "pickTarget" in line and ("morel" in line or "fly_agaric" in line):
        print(line[:200])
