import importlib.util
# quick node check via subprocess
import subprocess
r=subprocess.run(["node","-e","""
const P=require('./desktop/renderer/window-play.js');
console.log('grasshopper', P.playFor('grasshopper'));
console.log('katydid', P.playFor('katydid'));
console.log('field_cricket', P.playFor('field_cricket'));
console.log('swallowtail', P.playFor('swallowtail'));
console.log('JUMP', P.JUMP, 'LEAF', P.LEAF, 'SONG', P.SONG);
"""], capture_output=True, text=True)
print(r.stdout)
print(r.stderr)
print('exit', r.returncode)
