$files = @(
  "desktop\renderer\window-play.js",
  "web\src\lib\pets\window-play.ts",
  "desktop\renderer\window-play.test.cjs",
  "web\scripts\window-play.test.mjs",
  "desktop\renderer\leftover-house.test.cjs",
  "README.md",
  "desktop\README.md",
  "docs\ARCHITECTURE.md",
  "docs\ROADMAP.md"
)

foreach ($rel in $files) {
  $path = Join-Path (Get-Location) $rel
  $c = [System.IO.File]::ReadAllText($path)
  $orig = $c

  $c = $c.Replace("if (kind === WAIT) return w.width >= 196 && w.height >= 164;", "if (kind === WAIT) return w.width >= 194 && w.height >= 176;")
  $c = $c.Replace("kind === WAIT) return w.width >= 196 && w.height >= 164", "kind === WAIT) return w.width >= 194 && w.height >= 176")

  $c = $c.Replace("window stool as a damp blotter", "sash drip as a damp blotter")
  $c = $c.Replace("walk onto the stool, sit the wait", "walk onto the drip, sit the wait")
  $c = $c.Replace("walk onto the stool — take the damp blotter", "walk onto the drip — take the damp blotter")
  $c = $c.Replace("a real stool blotter", "a real sash drip")
  $c = $c.Replace("it walks onto the window stool as a damp blotter", "it walks onto the sash drip as a damp blotter")
  $c = $c.Replace("it waits a window stool as a damp blotter", "it waits a sash drip as a damp blotter")
  $c = $c.Replace("the window stool as a damp blotter, not the sky", "the sash drip as a damp blotter, not the sky")
  $c = $c.Replace("it stays on the stool blotter", "it stays on the sash drip")
  $c = $c.Replace("a walk leave off the damp blotter", "a walk leave off the sash drip")
  $c = $c.Replace("sit sealed cyst on interior stool (papers damp)", "sit the wait on the drip; she waits, she does not drink")
  $c = $c.Replace("Arca waits a window stool as a damp blotter: walk onto the stool, sit the wait, then leave.", "Arca waits a sash drip as a damp blotter: walk onto the drip, sit the wait, then leave.")
  $c = $c.Replace("tenth leftover of the far den done and closes far ten", "tenth leftover of the far den done; far ten closed")
  $c = $c.Replace('width: 194, height: 162 }], 80, "cyst"', 'width: 194, height: 174 }], 80, "cyst"')
  $c = $c.Replace('width: 196, height: 164 }], 80, "cyst"', 'width: 194, height: 176 }], 80, "cyst"')
  $c = $c.Replace("a walk onto the stool, not a cling", "a walk onto the drip, not a cling")

  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($path, $c)
    Write-Output ("updated " + $rel)
  } else {
    Write-Output ("unchanged " + $rel)
  }
}
