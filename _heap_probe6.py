p = r"desktop\renderer\window-play.test.cjs"
lines = open(p, encoding="utf-8").read().splitlines()
for i,l in enumerate(lines,1):
    if "Hop springs" in l or "Lid shuts" in l or "Stripe stamps" in l or "test(\"Hop" in l or "test(\"Lid" in l:
        print(f"{i}:{l[:180]}")
