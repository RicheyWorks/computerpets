from pathlib import Path
js=Path('desktop/renderer/window-play.js').read_text(encoding='utf-8')
ts=Path('web/src/lib/pets/window-play.ts').read_text(encoding='utf-8')
print('js FACET', 'const FACET' in js, 'facetPoint' in js, 'key === "silica"' in js)
print('ts FACET', 'export const FACET' in ts, 'facetPoint' in ts, 'key === "silica"' in ts)
print('ts Silica header', 'Silica facets' in ts)
print('js Silica header', 'Silica facets' in js)
# find float-off then sill-hop in ts
i=ts.find('if (next.phase === "float-off")')
print('float-off idx', i)
print(repr(ts[i:i+550]))
j=ts.find('if (next.phase === "sill-hop")')
print('sill-hop after float', j, 'delta', j-i if i>=0 and j>=0 else None)
# check if facet already in tick
print('facet-on in ts', ts.count('facet-on'))
print('facet-on in js', js.count('facet-on'))
