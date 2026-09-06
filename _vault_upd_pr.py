body=open("_vault_pr_body.md",encoding="utf-8").read()
body=body.replace(
"- [x] `node --test desktop/renderer/window-play.test.cjs desktop/renderer/leftover-house.test.cjs`\n- [x] web `window-play.test.mjs` with `--experimental-strip-types`",
"- [x] `node --test desktop/renderer/window-play.test.cjs desktop/renderer/leftover-house.test.cjs` (367 pass)\n- [x] web `window-play.test.mjs` with `--experimental-strip-types` (176 pass)"
)
open("_vault_pr_body.md","w",encoding="utf-8").write(body)
print(body)
