import pathlib
print(pathlib.Path("_choir_docs.py").read_text(encoding="utf-8")[5000:9200])
print("====CJS TAIL====")
print(pathlib.Path("_choir_cjs_block.txt").read_text(encoding="utf-8")[3500:])
