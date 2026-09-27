#!/usr/bin/env bash
# Run every ComputerPets test suite this computer can run, then print one summary.
# Linux and Mac twin of scripts/test-all.ps1. Same suites, same SKIP rules.
#
#   scripts/test-all.sh                  every suite
#   scripts/test-all.sh --quick          skip web, tsc, java, deploy-sh, tftest
#   scripts/test-all.sh --only python,cdn
#   scripts/test-all.sh --skip web,tsc
#   scripts/test-all.sh --list
#
# A suite whose tool is missing is SKIP with the reason. Nothing is installed.
# Exit 1 when any suite fails. Logs go to ${TMPDIR:-/tmp}/computerpets-test-all.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="${TMPDIR:-/tmp}/computerpets-test-all"
mkdir -p "$LOG_DIR"
rm -f "$LOG_DIR"/*.log

SUITES="desktop web tsc python check harness cdn java deploy-sh tftest"
SLOW=" web tsc java deploy-sh tftest "
ONLY=""
SKIP=""
QUICK=0

while [ $# -gt 0 ]; do
  case "$1" in
    --only) ONLY=" ${2//,/ } "; shift 2 ;;
    --skip) SKIP=" ${2//,/ } "; shift 2 ;;
    --quick) QUICK=1; shift ;;
    --list) for s in $SUITES; do case "$SLOW" in *" $s "*) echo "$s (not in --quick)" ;; *) echo "$s" ;; esac; done; exit 0 ;;
    -h|--help) sed -n '2,13p' "$0"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done
for s in $ONLY $SKIP; do
  case " $SUITES " in *" $s "*) ;; *) echo "Unknown suite '$s'. Suites: $SUITES" >&2; exit 2 ;; esac
done

have() { command -v "$1" >/dev/null 2>&1; }
VENV_PY="$ROOT/client/.venv/bin/python"
export QT_QPA_PLATFORM=offscreen

# run_logged <suite> <dir> <cmd...>: output to the suite log; sets OUT and CODE.
run_logged() {
  local suite="$1" dir="$2"; shift 2
  local tmp="$LOG_DIR/$suite.tmp"
  (cd "$dir" && "$@") </dev/null >"$tmp" 2>&1
  CODE=$?
  OUT="$(cat "$tmp")"
  { echo "> $* (in $dir)"; cat "$tmp"; } >>"$LOG_DIR/$suite.log"
  rm -f "$tmp"
}
last_num() { printf '%s\n' "$OUT" | grep -Eo "$1" | tail -1 | grep -Eo '[0-9]+' | head -1; }
tail_out() { printf '%s\n' "$OUT" | grep -v '^$' | tail -30 | sed 's/^/    /'; }
node_counts() {
  local t p f s
  t="$(printf '%s\n' "$OUT" | grep -E '^\S*\s*tests [0-9]+\s*$' | tail -1 | grep -Eo '[0-9]+')"
  p="$(printf '%s\n' "$OUT" | grep -E '^\S*\s*pass [0-9]+\s*$' | tail -1 | grep -Eo '[0-9]+')"
  f="$(printf '%s\n' "$OUT" | grep -E '^\S*\s*fail [0-9]+\s*$' | tail -1 | grep -Eo '[0-9]+')"
  s="$(printf '%s\n' "$OUT" | grep -E '^\S*\s*skipped [0-9]+\s*$' | tail -1 | grep -Eo '[0-9]+')"
  [ -z "$t" ] && return
  COUNTS="$p/$t pass"
  [ "${f:-0}" != 0 ] && COUNTS="$COUNTS, $f fail"
  [ "${s:-0}" != 0 ] && COUNTS="$COUNTS, $s skip"
}
finish() { if [ "$CODE" -eq 0 ]; then STATUS=PASS; else STATUS=FAIL; tail_out; fi; }

run_desktop() {
  have node && have npm || { STATUS=SKIP; NOTE="node/npm not installed"; return; }
  run_logged desktop "$ROOT/desktop" npm test; node_counts; finish
}
run_web() {
  have node && have npm || { STATUS=SKIP; NOTE="node/npm not installed"; return; }
  [ -d "$ROOT/web/node_modules" ] || { STATUS=SKIP; NOTE="no web/node_modules: run npm ci in web/"; return; }
  run_logged web "$ROOT/web" npm test; node_counts; finish
}
run_tsc() {
  have node || { STATUS=SKIP; NOTE="node not installed"; return; }
  [ -d "$ROOT/web/node_modules/typescript" ] || { STATUS=SKIP; NOTE="no web/node_modules: run npm ci in web/"; return; }
  run_logged tsc "$ROOT/web" node scripts/tsc-baseline.mjs
  local m; m="$(printf '%s\n' "$OUT" | grep -Eo 'tsc: [0-9]+ lines \([0-9]+ errors\), baseline [0-9]+' | tail -1)"
  if [ -n "$m" ]; then
    local n b; n="$(echo "$m" | awk '{print $2}')"; b="$(echo "$m" | awk '{print $NF}')"
    COUNTS="$n lines / baseline $b"
    [ "$n" -lt "$b" ] && NOTE="fewer than baseline: node scripts/tsc-baseline.mjs --update"
  fi
  finish; [ "$STATUS" = FAIL ] && NOTE="new tsc output"
}
run_python() {
  [ -x "$VENV_PY" ] || { STATUS=SKIP; NOTE='no client/.venv. Create it: cd client && python3 -m venv .venv && .venv/bin/pip install -e ".[dev]"'; return; }
  run_logged python "$ROOT/client" "$VENV_PY" -m pytest -q -rs -p no:cacheprovider
  local p f s; p="$(last_num '[0-9]+ passed')"; f="$(last_num '[0-9]+ failed')"; s="$(last_num '[0-9]+ skipped')"
  [ -n "$p" ] && COUNTS="$p passed"
  [ -n "$f" ] && COUNTS="$COUNTS, $f failed"
  [ -n "$s" ] && COUNTS="$COUNTS, $s skipped"
  finish
}
run_check() {
  [ -x "$VENV_PY" ] || { STATUS=SKIP; NOTE="no client/.venv (see python)"; return; }
  run_logged check "$ROOT/client" "$VENV_PY" -m computerpets_client --check
  COUNTS="$(printf '%s\n' "$OUT" | grep -c '^ok:') ok lines"; finish
}
run_harness() {
  [ -x "$VENV_PY" ] || { STATUS=SKIP; NOTE="no client/.venv (see python)"; return; }
  run_logged harness "$ROOT/client" "$VENV_PY" -m computerpets_client.app_harness
  local a_code=$CODE a; a="$(printf '%s\n' "$OUT" | grep -Eo '[0-9]+/[0-9]+ passed' | tail -1)"
  [ "$a_code" -ne 0 ] && tail_out
  run_logged harness "$ROOT/client" "$VENV_PY" -m computerpets_client.care_harness
  local c; c="$(printf '%s\n' "$OUT" | grep -Eo '[0-9]+/[0-9]+ passed' | tail -1)"
  COUNTS="app ${a% passed}, care ${c% passed}"
  [ "$a_code" -ne 0 ] && CODE=1
  finish
}
run_cdn() {
  have node || { STATUS=SKIP; NOTE="node not installed"; return; }
  run_logged cdn "$ROOT" node deploy/cdn/edge-redeem.test.cjs
  COUNTS="$(printf '%s\n' "$OUT" | grep -Eo '[0-9]+ passed, [0-9]+ failed' | tail -1)"; finish
}
run_java() {
  local mvn=""
  if [ -x "$ROOT/mvnw" ]; then mvn="$ROOT/mvnw"; elif have mvn; then mvn=mvn; fi
  have java || [ -x "${JAVA_HOME:-/nonexistent}/bin/java" ] || { STATUS=SKIP; NOTE="java not installed"; return; }
  [ -n "$mvn" ] || { STATUS=SKIP; NOTE="mvn not installed (and no mvnw)"; return; }
  run_logged java "$ROOT" "$mvn" -B verify
  local m; m="$(printf '%s\n' "$OUT" | grep -Eo 'Tests run: [0-9]+, Failures: [0-9]+, Errors: [0-9]+, Skipped: [0-9]+' | tail -1)"
  [ -n "$m" ] && COUNTS="$m"
  finish
}
run_deploy_sh() {
  have bash || { STATUS=SKIP; NOTE="bash not installed"; return; }
  have python3 || { STATUS=SKIP; NOTE="python3 not installed (these tests need it)"; return; }
  python3 -c "import yaml" >/dev/null 2>&1 || { STATUS=SKIP; NOTE="python3 has no PyYAML (pip install pyyaml)"; return; }
  local total=0 bad=0 t
  while IFS= read -r t; do
    total=$((total + 1))
    run_logged deploy-sh "$ROOT" bash "$t"
    if [ "$CODE" -ne 0 ]; then bad=$((bad + 1)); echo "    failed: $t"; fi
  done < <(cd "$ROOT" && find deploy -name '*.test.sh' | sort)
  COUNTS="$((total - bad))/$total scripts pass"
  if [ "$bad" -eq 0 ]; then STATUS=PASS; else STATUS=FAIL; fi
}
run_tftest() {
  have terraform || { STATUS=SKIP; NOTE="terraform not installed"; return; }
  [ -d "$ROOT/deploy/terraform/.terraform" ] || { STATUS=SKIP; NOTE="run terraform init in deploy/terraform first (it downloads providers)"; return; }
  run_logged tftest "$ROOT/deploy/terraform" terraform test -no-color
  COUNTS="$(printf '%s\n' "$OUT" | grep -Eo '[0-9]+ passed, [0-9]+ failed' | tail -1)"; finish
}

ROWS=()
FAILS=0; PASSES=0; SKIPS=0
START=$SECONDS
for s in $SUITES; do
  if [ -n "$ONLY" ]; then case "$ONLY" in *" $s "*) ;; *) continue ;; esac; fi
  STATUS=""; COUNTS=""; NOTE=""; T=""
  case "$SKIP" in *" $s "*) STATUS=SKIP; NOTE="left out by --skip" ;; esac
  if [ -z "$STATUS" ] && [ "$QUICK" = 1 ] && [ -z "$ONLY" ]; then
    case "$SLOW" in *" $s "*) STATUS=SKIP; NOTE="left out by --quick" ;; esac
  fi
  if [ -z "$STATUS" ]; then
    echo "== $s"
    t0=$SECONDS
    "run_${s//-/_}"
    T="$((SECONDS - t0))s"
    echo "   $STATUS  $COUNTS  $NOTE"
  fi
  case "$STATUS" in PASS) PASSES=$((PASSES + 1)) ;; FAIL) FAILS=$((FAILS + 1)) ;; *) SKIPS=$((SKIPS + 1)) ;; esac
  ROWS+=("$s|$STATUS|$COUNTS|$T|$NOTE")
done

echo
echo "ComputerPets test-all summary"
printf '%-10s %-6s %-28s %-6s %s\n' Suite Result Counts Time Note
printf '%-10s %-6s %-28s %-6s %s\n' ----- ------ ------ ---- ----
for r in "${ROWS[@]}"; do
  IFS='|' read -r a b c d e <<<"$r"
  printf '%-10s %-6s %-28s %-6s %s\n' "$a" "$b" "$c" "$d" "$e"
done
echo
echo "$PASSES passed, $FAILS failed, $SKIPS skipped in $((SECONDS - START))s. Logs: $LOG_DIR"
[ "$FAILS" -eq 0 ]