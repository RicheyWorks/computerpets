#!/usr/bin/env bash
# Meta-tests for check-node-pool.sh (no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/terraform/check-node-pool.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-node-pool-out.$$ 2>/tmp/cp-node-pool-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-node-pool-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-node-pool-err.$$ || true
  fi
  rm -f /tmp/cp-node-pool-out.$$ /tmp/cp-node-pool-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-node-pool.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

mkdir -p "${BROKEN}/deploy/terraform/modules/node_pool"
mkdir -p "${BROKEN}/deploy/k8s"
mkdir -p "${BROKEN}/docs/adr"
cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
cp "${ROOT}/deploy/terraform/variables.tf" "${BROKEN}/deploy/terraform/variables.tf"
cp "${ROOT}/deploy/terraform/outputs.tf" "${BROKEN}/deploy/terraform/outputs.tf"
cp "${ROOT}/deploy/terraform/main.tf" "${BROKEN}/deploy/terraform/main.tf"
cp "${ROOT}/deploy/terraform/terraform.tfvars.example" \
  "${BROKEN}/deploy/terraform/terraform.tfvars.example"
cp "${ROOT}/deploy/terraform/README.md" "${BROKEN}/deploy/terraform/README.md"
cp "${ROOT}/docs/adr/0082-multi-az-node-pool.md" \
  "${BROKEN}/docs/adr/0082-multi-az-node-pool.md"
cp "${ROOT}/deploy/k8s/deployment-blue.yaml" "${BROKEN}/deploy/k8s/deployment-blue.yaml"
cp "${ROOT}/deploy/k8s/deployment-green.yaml" "${BROKEN}/deploy/k8s/deployment-green.yaml"
cp "${SCRIPT}" "${BROKEN}/deploy/terraform/check-node-pool.sh"
chmod +x "${BROKEN}/deploy/terraform/check-node-pool.sh"

# A public IP on the worker ENI puts the API node on the internet.
sed -i 's/associate_public_ip_address = false/associate_public_ip_address = true/' \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
assert_exit 1 "check fails when the launch template assigns a public IP" \
  "${BROKEN}/deploy/terraform/check-node-pool.sh"

# SSH on the managed node group is the open door this slice refuses.
cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
sed -i '/resource "aws_eks_node_group" "zone"/a\  remote_access {\n    ec2_ssh_key = "open"\n  }' \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
assert_exit 1 "check fails when the node group opens remote_access" \
  "${BROKEN}/deploy/terraform/check-node-pool.sh"

# One zone is the gap this slice closes. The plan gate must keep two.
cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
sed -i 's/length(var.node_pool_subnets) >= 2/length(var.node_pool_subnets) >= 1/' \
  "${BROKEN}/deploy/terraform/main.tf"
assert_exit 1 "check fails when the plan gate allows a single zone" \
  "${BROKEN}/deploy/terraform/check-node-pool.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
