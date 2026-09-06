js=open('desktop/renderer/window-play.js',encoding='utf-8').read()
for name in ['runOn:','bloomOn:','runPoint','bloomPoint','runOnPath','bloomPath','tumblePoint','TUMBLE','brothcup']:
  print(name, name in js or js.find(name))
# export block
i=js.find('tumbleOffPath')
print('export ctx', repr(js[i:i+120]))
# check trumpetOffPath export glue
i=js.find('trumpetOffPath')
print('trumpet export', repr(js[i:i+200]))
