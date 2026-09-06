c=open("desktop/renderer/window-play.test.cjs",encoding="utf-8").read()
print("total coli", c.count("coli"))
idx=0
n=0
while n<20:
  j=c.find("coli", idx)
  if j<0: break
  print(j, repr(c[max(0,j-40):j+50].replace("\n","|")))
  idx=j+1; n+=1
h=open("desktop/renderer/leftover-house.test.cjs",encoding="utf-8").read()
i=h.find('playFor("coli")')
print("HOUSE", repr(h[i-120:i+80]))
i=h.find("next leftover is Rod")
print("next rod", repr(h[i-40:i+80]) if i>=0 else None)
i=h.find("Next leftover is Rod")
print("Next Rod", repr(h[i-40:i+80]) if i>=0 else None)
