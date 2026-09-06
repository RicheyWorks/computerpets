from pathlib import Path
print(Path("_pact_pr_body.md").read_text(encoding="utf-8")[:3000])
print("====")
kinds = Path("_kinds_unique.txt").read_text(encoding="utf-8").strip().splitlines()
print("kinds count", len(kinds))
print("last 60:")
print("\n".join(kinds[-60:]))
print("==== used light-ish")
for k in kinds:
    if any(x in k for x in ("light","sun","glow","gleam","lamp","drink","pane","bright","ray","beam","patch","flare","sip","thirst","wave","phot","sit","glass")):
        print(k)
