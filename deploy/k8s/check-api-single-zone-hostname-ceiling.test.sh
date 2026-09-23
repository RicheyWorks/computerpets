#!/usr/bin/env bash
# Meta-tests for check-api-single-zone-hostname-ceiling.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-sz-hostname-ceiling-out.$$ 2>/tmp/cp-sz-hostname-ceiling-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-sz-hostname-ceiling-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-sz-hostname-ceiling-err.$$ || true
  fi
  rm -f /tmp/cp-sz-hostname-ceiling-out.$$ /tmp/cp-sz-hostname-ceiling-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" \
    "${dest}/deploy/terraform/modules/node_pool" \
    "${dest}/docs/adr"
  cp "${ROOT}/deploy/k8s/hpa.yaml" "${dest}/deploy/k8s/hpa.yaml"
  cp "${ROOT}/deploy/k8s/pdb.yaml" "${dest}/deploy/k8s/pdb.yaml"
  cp "${ROOT}/deploy/k8s/deployment-blue.yaml" "${dest}/deploy/k8s/deployment-blue.yaml"
  cp "${ROOT}/deploy/k8s/deployment-green.yaml" "${dest}/deploy/k8s/deployment-green.yaml"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${dest}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" "${dest}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/deploy/k8s/README.md" "${dest}/deploy/k8s/README.md"
  cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
    "${dest}/deploy/terraform/modules/node_pool/main.tf"
  cp "${ROOT}/deploy/terraform/main.tf" "${dest}/deploy/terraform/main.tf"
  cp "${ROOT}/deploy/terraform/variables.tf" "${dest}/deploy/terraform/variables.tf"
  cp "${ROOT}/docs/adr/0108-api-single-zone-hostname-ceiling.md" \
    "${dest}/docs/adr/0108-api-single-zone-hostname-ceiling.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"
  chmod +x "${dest}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"
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
assert_exit 0 "check-api-single-zone-hostname-ceiling.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/hpa.yaml" \
  "  maxReplicas: 3" \
  "  maxReplicas: 6"
assert_exit 1 "check fails when the ceiling returns to 6 and stacks 2, 2, and 2" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/hpa.yaml" \
  "  maxReplicas: 3" \
  "  maxReplicas: 4"
assert_exit 1 "check fails when the ceiling is 4 and stacks 2, 1, and 1" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/hpa.yaml" \
  "  maxReplicas: 3" \
  "  maxReplicas: 5"
assert_exit 1 "check fails when the ceiling is 5 and still stacks on one zone" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/hpa.yaml" \
  "  maxReplicas: 3" \
  "  maxReplicas: 10"
assert_exit 1 "check fails when the ceiling returns to 10" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "min_size_per_zone     = 3" \
  "min_size_per_zone     = 4"
assert_exit 1 "check fails when the floor rises to four per zone (eight nodes)" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "min_size_per_zone     = 3" \
  "min_size_per_zone     = 6"
assert_exit 1 "check fails when the floor rises to six per zone (twelve nodes)" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "min_size_per_zone     = 3" \
  "min_size_per_zone     = 10"
assert_exit 1 "check fails when the floor rises to ten per zone (twenty nodes)" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "hpa-max-replicas=3" \
  "hpa-max-replicas=6"
assert_exit 1 "check fails when the node pool still pins the six-pod ceiling" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/deployment-blue.yaml" \
  "          topologyKey: kubernetes.io/hostname" \
  $'          minDomains: 2\n          topologyKey: kubernetes.io/hostname'
assert_exit 1 "check fails when minDomains is set" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/deployment-blue.yaml" \
  $'          topologyKey: kubernetes.io/hostname\n          whenUnsatisfiable: DoNotSchedule' \
  $'          topologyKey: kubernetes.io/hostname\n          whenUnsatisfiable: ScheduleAnyway'
assert_exit 1 "check fails when hostname spread is only a preference" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/deployment-blue.yaml" \
  $'        - maxSkew: 1\n          topologyKey: kubernetes.io/hostname' \
  $'        - maxSkew: 2\n          topologyKey: kubernetes.io/hostname'
assert_exit 1 "check fails when hostname maxSkew allows two pods on one hostname" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/deployment-blue.yaml" \
  "    spec:" \
  $'    spec:\n      affinity:\n        podAntiAffinity:\n          requiredDuringSchedulingIgnoredDuringExecution:\n          - topologyKey: kubernetes.io/hostname'
assert_exit 1 "check fails when required hostname anti-affinity is added" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/kustomization.yaml" \
  "  - deployment-green.yaml" \
  $'  - deployment-green.yaml\n  - hpa.yaml'
assert_exit 1 "check fails when kustomize would apply the HPA" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "length(var.subnets) >= 2" \
  "length(var.subnets) >= 1"
assert_exit 1 "check fails when the node pool allows a single zone" \
  "${BROKEN}/deploy/k8s/check-api-single-zone-hostname-ceiling.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
