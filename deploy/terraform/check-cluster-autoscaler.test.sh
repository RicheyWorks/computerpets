#!/usr/bin/env bash
# Meta-tests for check-cluster-autoscaler.sh (no cloud account, no cluster).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/terraform/check-cluster-autoscaler.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ca-out.$$ 2>/tmp/cp-ca-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ca-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ca-err.$$ || true
  fi
  rm -f /tmp/cp-ca-out.$$ /tmp/cp-ca-err.$$
}

copy_tree() {
  local dest="$1"
  mkdir -p "${dest}/deploy/terraform/modules/cluster_autoscaler"
  mkdir -p "${dest}/deploy/terraform/modules/node_pool"
  mkdir -p "${dest}/deploy/k8s"
  mkdir -p "${dest}/docs/adr"
  cp "${ROOT}/deploy/terraform/modules/cluster_autoscaler/main.tf" \
    "${dest}/deploy/terraform/modules/cluster_autoscaler/main.tf"
  cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
    "${dest}/deploy/terraform/modules/node_pool/main.tf"
  cp "${ROOT}/deploy/terraform/variables.tf" "${dest}/deploy/terraform/variables.tf"
  cp "${ROOT}/deploy/terraform/main.tf" "${dest}/deploy/terraform/main.tf"
  cp "${ROOT}/deploy/terraform/outputs.tf" "${dest}/deploy/terraform/outputs.tf"
  cp "${ROOT}/deploy/terraform/terraform.tfvars.example" \
    "${dest}/deploy/terraform/terraform.tfvars.example"
  cp "${ROOT}/deploy/terraform/README.md" "${dest}/deploy/terraform/README.md"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" \
    "${dest}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${dest}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/hpa.yaml" "${dest}/deploy/k8s/hpa.yaml"
  cp "${ROOT}/deploy/k8s/deployment-blue.yaml" "${dest}/deploy/k8s/deployment-blue.yaml"
  cp "${ROOT}/deploy/k8s/deployment-green.yaml" "${dest}/deploy/k8s/deployment-green.yaml"
  cp "${ROOT}/deploy/k8s/README.md" "${dest}/deploy/k8s/README.md"
  cp "${ROOT}/docs/adr/0083-cluster-autoscaler.md" \
    "${dest}/docs/adr/0083-cluster-autoscaler.md"
  cp "${SCRIPT}" "${dest}/deploy/terraform/check-cluster-autoscaler.sh"
  chmod +x "${dest}/deploy/terraform/check-cluster-autoscaler.sh"
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-cluster-autoscaler.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
# A max under the HPA ceiling leaves the tenth pod Pending even after scale-up.
sed -i 's/max_size_per_zone     = 10/max_size_per_zone     = 4/' \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
assert_exit 1 "check fails when node-group max drops below the HPA ceiling" \
  "${BROKEN}/deploy/terraform/check-cluster-autoscaler.sh"

copy_tree "${BROKEN}"
# Without ignore_changes, the next apply writes desired_size back to 1.
sed -i '/ignore_changes = \[scaling_config\[0\].desired_size\]/d' \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
assert_exit 1 "check fails when terraform would reset desired_size" \
  "${BROKEN}/deploy/terraform/check-cluster-autoscaler.sh"

copy_tree "${BROKEN}"
# Local apply must not start the autoscaler on kind or minikube.
sed -i '/- deployment-green.yaml/a\  - cluster-autoscaler.yaml' \
  "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomize would apply the autoscaler" \
  "${BROKEN}/deploy/terraform/check-cluster-autoscaler.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
