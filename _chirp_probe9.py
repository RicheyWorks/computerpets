js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
for name in ["chirpOn","chirpPoint","chirpOnPath","chirpPath","chirpHold","singOn","singPoint","singOnPath","singPath","droneOn","SONG","songPoint","CHIRP"]:
    print(name, name in js)
# check exports
for name in ["chirpPoint","chirpOnPath","chirpPath","singPoint","singOnPath","singPath","songPoint"]:
    print("export", name, ("    %s," % name) in js or ("  %s," % name) in js)
