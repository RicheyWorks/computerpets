import re
t=open("web/src/lib/pets/meadow.ts",encoding="utf-8").read()
print("len",len(t))
# print first 80 lines
for i,l in enumerate(t.splitlines()[:100],1):
    print(f"{i}:{l[:180]}")
