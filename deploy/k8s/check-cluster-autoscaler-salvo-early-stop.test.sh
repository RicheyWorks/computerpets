#!/usr/bin/env bash
# Meta-tests for check-cluster-autoscaler-salvo-early-stop.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ca-early-out.$$ 2>/tmp/cp-ca-early-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ca-early-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ca-early-err.$$ || true
  fi
  rm -f /tmp/cp-ca-early-out.$$ /tmp/cp-ca-early-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" "${dest}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${dest}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/README.md" "${dest}/deploy/k8s/README.md"
  cp "${ROOT}/docs/adr/0103-cluster-autoscaler-salvo-early-stop.md" \
    "${dest}/docs/adr/0103-cluster-autoscaler-salvo-early-stop.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"
  chmod +x "${dest}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"
}

replace_once() {
  local file="$1"
  local old="$2"
  local new="$3"
  python3 - "$file" "$old" "$new" <<'PY'
import pathlib, sys
path, old, new = sys.argv[1:]
file = pathlib.Path(path)
text = file.read_text()
if text.count(old) != 1:
    raise SystemExit(f"count {text.count(old)} for {old!r} in {path}")
file.write_text(text.replace(old, new, 1))
PY
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-cluster-autoscaler-salvo-early-stop.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up=true" \
  "            - --salvo-scale-up=false"
assert_exit 1 "check fails when salvo scale-up is false" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up=true"$'\n' \
  ""
assert_exit 1 "check fails when the salvo flag is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up-budget=1m" \
  "            - --salvo-scale-up-budget=0s"
assert_exit 1 "check fails when the salvo budget is zero" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up-budget=1m" \
  "            - --salvo-scale-up-budget=5m"
assert_exit 1 "check fails when the salvo budget copies the 5m binpacking cap" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up-budget=1m" \
  "            - --salvo-scale-up-budget=15m"
assert_exit 1 "check fails when the salvo budget copies the 15m node-provision wait" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up-budget=1m"$'\n' \
  ""
assert_exit 1 "check fails when the salvo budget is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true" \
  "            - --frequent-loops-enabled=false"
assert_exit 1 "check fails when frequent loops are false" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true"$'\n' \
  ""
assert_exit 1 "check fails when frequent loops are removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true" \
  "            - --frequent-loops-enabled=true"$'\n'"            - --initial-node-group-backoff-duration=1m"
assert_exit 1 "check fails when node-group backoff is shortened" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true" \
  "            - --frequent-loops-enabled=true"$'\n'"            - --initial-node-group-backoff-duration=5m"
assert_exit 1 "check fails when the 5m backoff default is pinned on the command" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true" \
  "            - --frequent-loops-enabled=true"$'\n'"            - --max-node-provision-time=1m"
assert_exit 1 "check fails when node-provision time is set to the salvo budget" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true" \
  "            - --frequent-loops-enabled=true"$'\n'"            - --max-nodegroup-binpacking-duration=2m"
assert_exit 1 "check fails when per-group binpacking can use the whole budget" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true" \
  "            - --frequent-loops-enabled=true"$'\n'"            - --parallel-scale-up=true"
assert_exit 1 "check fails when parallel scale-up is turned on" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/docs/adr/0103-cluster-autoscaler-salvo-early-stop.md" \
  "when the snapshot update returns an error" \
  "when the snapshot refresh returns an error"
assert_exit 1 "check fails when the ADR drops the snapshot-update early stop" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

copy_tree "${BROKEN}"
printf '\n  - cluster-autoscaler.yaml\n' >> "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomization lists the manifest" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
