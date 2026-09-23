#!/usr/bin/env bash
# Meta-tests for check-cluster-autoscaler-zone-max.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ca-zone-max-out.$$ 2>/tmp/cp-ca-zone-max-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ca-zone-max-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ca-zone-max-err.$$ || true
  fi
  rm -f /tmp/cp-ca-zone-max-out.$$ /tmp/cp-ca-zone-max-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" \
    "${dest}/deploy/terraform/modules/node_pool" \
    "${dest}/deploy/terraform/modules/cluster_autoscaler" \
    "${dest}/docs/adr"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" "${dest}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${dest}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/README.md" "${dest}/deploy/k8s/README.md"
  cp "${ROOT}/deploy/k8s/hpa.yaml" "${dest}/deploy/k8s/hpa.yaml"
  cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
    "${dest}/deploy/terraform/modules/node_pool/main.tf"
  cp "${ROOT}/deploy/terraform/modules/cluster_autoscaler/main.tf" \
    "${dest}/deploy/terraform/modules/cluster_autoscaler/main.tf"
  cp "${ROOT}/deploy/terraform/variables.tf" "${dest}/deploy/terraform/variables.tf"
  cp "${ROOT}/docs/adr/0104-per-zone-node-max.md" \
    "${dest}/docs/adr/0104-per-zone-node-max.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"
  chmod +x "${dest}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"
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
assert_exit 0 "check-cluster-autoscaler-zone-max.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 10"
assert_exit 1 "check fails when the max stays at the old ceiling of 10" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 4"
assert_exit 1 "check fails when the max drops below the HPA ceiling" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 9"
assert_exit 1 "check fails when the max is one under the HPA pod count" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 21"
assert_exit 1 "check fails when the max exceeds the house ceiling" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 100"
assert_exit 1 "check fails when the max is an account-sized cap" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 20" \
  "max_size_per_zone     = 0"
assert_exit 1 "check fails when the max is zero" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "min_size_per_zone     = 3" \
  "min_size_per_zone     = 0"
assert_exit 1 "check fails when min drops below 1" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/hpa.yaml" \
  "  maxReplicas: 3" \
  "  maxReplicas: 21"
assert_exit 1 "check fails when the HPA pod ceiling exceeds the zone max" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "    max_size     = local.max_size_per_zone" \
  "    max_size     = 10"
assert_exit 1 "check fails when scaling_config max_size is a second literal" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/cluster_autoscaler/main.tf" \
  '    "autoscaling:DescribeAutoScalingGroups",' \
  '    "autoscaling:DescribeAutoScalingInstances",'
assert_exit 1 "check fails when DescribeAutoScalingGroups drops off the describe list" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/cluster_autoscaler/main.tf" \
  '    "eks:UpdateNodegroupConfig",' \
  ""
assert_exit 1 "check fails when UpdateNodegroupConfig is no longer denied" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --frequent-loops-enabled=true" \
  $'            - --frequent-loops-enabled=true\n            - --max-nodes-total=10'
assert_exit 1 "check fails when a cluster-wide node cap is pinned under the zone max" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/kustomization.yaml" \
  "  - deployment-green.yaml" \
  $'  - deployment-green.yaml\n  - cluster-autoscaler.yaml'
assert_exit 1 "check fails when kustomize would apply the autoscaler" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "          whenUnsatisfiable: DoNotSchedule" \
  $'          minDomains: 2\n          whenUnsatisfiable: DoNotSchedule'
assert_exit 1 "check fails when minDomains is set" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-max.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
