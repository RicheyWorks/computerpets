#!/usr/bin/env bash
# Meta-tests for check-api-node-pool.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-api-node-pool.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-api-pool-out.$$ 2>/tmp/cp-api-pool-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-api-pool-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-api-pool-err.$$ || true
  fi
  rm -f /tmp/cp-api-pool-out.$$ /tmp/cp-api-pool-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr" \
    "${dest}/deploy/terraform/modules/node_pool"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0093-api-node-pool.md" \
    "${dest}/docs/adr/0093-api-node-pool.md"
  cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
    "${dest}/deploy/terraform/modules/node_pool/main.tf"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-api-node-pool.sh"
  chmod +x "${dest}/deploy/k8s/check-api-node-pool.sh"
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-api-node-pool.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
# Without the pool key, any linux node can take an API pod.
sed -i '/computerpets\/node-pool: api/d' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when blue drops the pool nodeSelector" \
  "${BROKEN}/deploy/k8s/check-api-node-pool.sh"

copy_tree "${BROKEN}"
# linux is the other required key, matching metrics-server and the scaler.
sed -i '/kubernetes.io\/os: linux/d' \
  "${BROKEN}/deploy/k8s/deployment-green.yaml"
assert_exit 1 "check fails when green drops the linux nodeSelector" \
  "${BROKEN}/deploy/k8s/check-api-node-pool.sh"

copy_tree "${BROKEN}"
# Ignore would count nodes outside the pool as empty domains again.
sed -i 's/nodeAffinityPolicy: Honor/nodeAffinityPolicy: Ignore/' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when blue sets nodeAffinityPolicy Ignore" \
  "${BROKEN}/deploy/k8s/check-api-node-pool.sh"

copy_tree "${BROKEN}"
# A preference would still admit nodes that lack the pool label.
sed -i '/nodeSelector:/i\      affinity:\n        nodeAffinity: {}' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when blue adds nodeAffinity" \
  "${BROKEN}/deploy/k8s/check-api-node-pool.sh"

copy_tree "${BROKEN}"
# A drifted pool label would pin the API to nodes this module does not create.
sed -i 's/"computerpets\/node-pool" = "api"/"computerpets\/node-pool" = "other"/' \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
assert_exit 1 "check fails when the node pool label value drifts" \
  "${BROKEN}/deploy/k8s/check-api-node-pool.sh"

copy_tree "${BROKEN}"
# Soft zone spread is no longer the contract (ADR 0095). Only the zone item
# is flipped back. Hostname stays DoNotSchedule (ADR 0100).
sed -i '/topologyKey: topology.kubernetes.io\/zone/{n;s/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/;}' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when the blue zone constraint is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-api-node-pool.sh"

copy_tree "${BROKEN}"
# Scaffolding must still schedule on a kind node that lacks the pool label.
printf '\n      nodeSelector:\n        computerpets/node-pool: api\n' \
  >> "${BROKEN}/deploy/k8s/postgres.yaml"
assert_exit 1 "check fails when postgres gains a pool nodeSelector" \
  "${BROKEN}/deploy/k8s/check-api-node-pool.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
