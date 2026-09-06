from pathlib import Path
ts=Path('web/src/lib/pets/window-play.ts').read_text(encoding='utf-8')
i=ts.find('export function floatPoint')
print(repr(ts[i:i+400]))
print('---')
i=ts.find('export function floatOffPath')
j=ts.find('export function beginPlay')
print(repr(ts[i:j][-200:]))
print('between floatOff and beginPlay newlines style ok?')
# Also verify js is complete and healthy
js=Path('desktop/renderer/window-play.js').read_text(encoding='utf-8')
print('js silica playFor', 'if (key === "silica") return FACET;' in js)
print('js facet-off phases', js.count('facet-off'))
print('js exports FACET', 'FACET,' in js)
