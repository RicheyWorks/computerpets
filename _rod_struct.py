js=open('desktop/renderer/window-play.js',encoding='utf-8').read()
i=js.find('if (kind === TRUMPET) {')
# find pickTarget TRUMPET - first one after size gate is size; pick is later
# find leave trumpeted region with more context
i=js.find('side: "trumpetrim"')
print(repr(js[i-80:i+700]))
print('====')
# Compare TWO block structure
i=js.find('side: "wetplate"')
print(repr(js[i-40:i+350]))
