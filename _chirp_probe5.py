print("brood_core lines", sum(1 for _ in open("_brood_core.py",encoding="utf-8")))
print("fold_core lines", sum(1 for _ in open("_fold_core.py",encoding="utf-8")))
print("--- brood head ---")
print(open("_brood_core.py",encoding="utf-8").read()[:2500])
