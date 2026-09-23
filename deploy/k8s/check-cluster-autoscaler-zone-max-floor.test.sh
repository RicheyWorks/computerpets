#!/usr/bin/env bash
# Meta-tests for check-cluster-autoscaler-zone-max-floor.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ca-zone-floor-out.$$ 2>/tmp/cp-ca-zone-floor-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ca-zone-floor-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ca-zone-floor-err.$$ || true
  fi
  rm -f /tmp/cp-ca-zone-floor-out.$$ /tmp/cp-ca-zone-floor-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" \
    "${dest}/deploy/terraform/modules/node_pool" \
    "${dest}/deploy/terraform/modules/cluster_autoscaler" \
    "${dest}/docs/adr"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" "${dest}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/deploy/k8s/metrics-server.yaml" "${dest}/deploy/k8s/metrics-server.yaml"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${dest}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/hpa.yaml" "${dest}/deploy/k8s/hpa.yaml"
  cp "${ROOT}/deploy/k8s/deployment-blue.yaml" "${dest}/deploy/k8s/deployment-blue.yaml"
  cp "${ROOT}/deploy/k8s/deployment-green.yaml" "${dest}/deploy/k8s/deployment-green.yaml"
  cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
    "${dest}/deploy/terraform/modules/node_pool/main.tf"
  cp "${ROOT}/deploy/terraform/modules/cluster_autoscaler/main.tf" \
    "${dest}/deploy/terraform/modules/cluster_autoscaler/main.tf"
  cp "${ROOT}/deploy/terraform/variables.tf" "${dest}/deploy/terraform/variables.tf"
  cp "${ROOT}/docs/adr/0109-per-zone-node-max-floor.md" \
    "${dest}/docs/adr/0109-per-zone-node-max-floor.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"
  chmod +x "${dest}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"
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
assert_exit 0 "check-cluster-autoscaler-zone-max-floor.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 7"
assert_exit 1 "check fails when the max drops to the named pods with no drain node" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 6"
assert_exit 1 "check fails when the max is twice the HPA ceiling" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 3"
assert_exit 1 "check fails when the max is the HPA ceiling" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 8"
assert_exit 1 "check fails when the max sits on the floor with no spare" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 10"
assert_exit 1 "check fails when the max returns to the old starved local" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 21"
assert_exit 1 "check fails when the max exceeds the house ceiling" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/metrics-server.yaml" \
  "  replicas: 2" \
  "  replicas: 16"
assert_exit 1 "check fails when metrics-server replicas push the floor above 20" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "              cpu: 100m" \
  "              cpu: 900m"
assert_exit 1 "check fails when the busiest drain node no longer fits half a t3.medium" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/cluster_autoscaler/main.tf" \
  '    "autoscaling:DescribeAutoScalingGroups",' \
  '    "autoscaling:DescribeAutoScalingInstances",'
assert_exit 1 "check fails when DescribeAutoScalingGroups drops off the describe list" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/kustomization.yaml" \
  "  - deployment-green.yaml" \
  $'  - deployment-green.yaml\n  - cluster-autoscaler.yaml'
assert_exit 1 "check fails when kustomize would apply the autoscaler" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "          whenUnsatisfiable: DoNotSchedule" \
  $'          minDomains: 2\n          whenUnsatisfiable: DoNotSchedule'
assert_exit 1 "check fails when minDomains is set" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
