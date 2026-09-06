from pathlib import Path
# find catalog keys
for p in Path('.').rglob('*'):
    if p.suffix.lower() in {'.json','.js','.ts','.cjs','.mjs','.md'} and p.is_file() and 'node_modules' not in str(p):
        try:
            t = p.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        if 'click_beetle' in t or 'acorn_weevil' in t:
            if t.count('click_beetle') or t.count('acorn_weevil'):
                if 'click_beetle' in t or ('acorn_weevil' in t and 'catalog' in str(p).lower()):
                    print(p, 'click', t.count('click_beetle'), 'snout', t.count('acorn_weevil'))
