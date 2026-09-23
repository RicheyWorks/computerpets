#!/usr/bin/env bash
# Meta-tests for check-cluster-autoscaler-scale-up-salvo.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ca-salvo-out.$$ 2>/tmp/cp-ca-salvo-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ca-salvo-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ca-salvo-err.$$ || true
  fi
  rm -f /tmp/cp-ca-salvo-out.$$ /tmp/cp-ca-salvo-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" "${dest}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${dest}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/README.md" "${dest}/deploy/k8s/README.md"
  cp "${ROOT}/docs/adr/0102-cluster-autoscaler-scale-up-salvo.md" \
    "${dest}/docs/adr/0102-cluster-autoscaler-scale-up-salvo.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"
  chmod +x "${dest}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"
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
assert_exit 0 "check-cluster-autoscaler-scale-up-salvo.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up=true" \
  "            - --salvo-scale-up=false"
assert_exit 1 "check fails when salvo scale-up is false" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up=true" \
  "            - --salvo-scale-up"
assert_exit 1 "check fails when salvo scale-up is bare" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up=true"$'\n' \
  ""
assert_exit 1 "check fails when the salvo flag is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up-budget=1m" \
  "            - --salvo-scale-up-budget=0s"
assert_exit 1 "check fails when the salvo budget is zero" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up-budget=1m" \
  "            - --salvo-scale-up-budget=1s"
assert_exit 1 "check fails when the salvo budget is one second" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --salvo-scale-up-budget=1m"$'\n' \
  ""
assert_exit 1 "check fails when the salvo budget is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true" \
  "            - --frequent-loops-enabled=false"
assert_exit 1 "check fails when frequent loops are false" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true"$'\n' \
  ""
assert_exit 1 "check fails when frequent loops are removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --expander=least-waste" \
  "            - --expander=priority,least-waste"
assert_exit 1 "check fails when the expander becomes a priority chain" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --balance-similar-node-groups=true" \
  "            - --balance-similar-node-groups=false"
assert_exit 1 "check fails when similar-group balance is turned off" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --expander=least-waste" \
  "            - --expander=least-waste"$'\n'"            - --scan-interval=1m"
assert_exit 1 "check fails when the scan interval is one minute" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "image: registry.k8s.io/autoscaling/cluster-autoscaler:v1.36.1" \
  "image: registry.k8s.io/autoscaling/cluster-autoscaler:v1.35.1"
assert_exit 1 "check fails when the image predates salvo scale-up" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
cat >> "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" <<'EOF'
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-autoscaler-priority-expander
  namespace: kube-system
data:
  priorities: |-
    10:
      - .*
EOF
assert_exit 1 "check fails when a priority expander ConfigMap is added" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

copy_tree "${BROKEN}"
printf '\n  - cluster-autoscaler.yaml\n' >> "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomization lists the manifest" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
