#!/usr/bin/env bash
# Meta-tests for check-hpa.sh (no cluster, no metrics-server).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-hpa.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-hpa-out.$$ 2>/tmp/cp-hpa-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-hpa-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-hpa-err.$$ || true
  fi
  rm -f /tmp/cp-hpa-out.$$ /tmp/cp-hpa-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-hpa.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

mkdir -p "${BROKEN}/deploy/k8s" "${BROKEN}/docs/adr"
cp "${ROOT}/deploy/k8s/hpa.yaml" "${BROKEN}/deploy/k8s/hpa.yaml"
cp "${ROOT}/deploy/k8s/kustomization.yaml" "${BROKEN}/deploy/k8s/kustomization.yaml"
cp "${ROOT}/deploy/k8s/deployment-blue.yaml" "${BROKEN}/deploy/k8s/deployment-blue.yaml"
cp "${ROOT}/deploy/k8s/deployment-green.yaml" "${BROKEN}/deploy/k8s/deployment-green.yaml"
cp "${ROOT}/deploy/k8s/service.yaml" "${BROKEN}/deploy/k8s/service.yaml"
cp "${ROOT}/deploy/k8s/README.md" "${BROKEN}/deploy/k8s/README.md"
cp "${ROOT}/docs/adr/0078-horizontal-pod-autoscaling.md" \
  "${BROKEN}/docs/adr/0078-horizontal-pod-autoscaling.md"
# Drop the floor under the architecture diagram. The gate must fail.
sed -i 's/minReplicas: 3/minReplicas: 1/' "${BROKEN}/deploy/k8s/hpa.yaml"
cp "${SCRIPT}" "${BROKEN}/deploy/k8s/check-hpa.sh"
chmod +x "${BROKEN}/deploy/k8s/check-hpa.sh"

assert_exit 1 "check fails when minReplicas drops below 3" \
  "${BROKEN}/deploy/k8s/check-hpa.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
