# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:280]))
    return text.replace(old, new, 1)

def once_or_more(text, old, new, label, min_n=1):
    n = text.count(old)
    if n < min_n:
        raise SystemExit("%s: expected >= %d, got %d\nOLD START: %r" % (label, min_n, n, old[:280]))
    return text.replace(old, new)

print("dusk core helpers ready")