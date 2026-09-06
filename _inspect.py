from pathlib import Path
p=Path(r'C:\Users\730ri\projects\ComputerPets\_thread_patch.py')
t=p.read_text(encoding='utf-8')
i=t.find('export const SPLIT')
print(repr(t[i:i+90]))
j=t.find('marker =')
print(repr(t[j:j+100]))
k=t.find('goPhase(next')
print(repr(t[k:k+80]))
