#!/usr/bin/env bash
# Meta-tests for check-topology-spread.sh (no cluster).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-topology-spread.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-spread-out.$$ 2>/tmp/cp-spread-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-spread-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-spread-err.$$ || true
  fi
  rm -f /tmp/cp-spread-out.$$ /tmp/cp-spread-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-topology-spread.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

mkdir -p "${BROKEN}/deploy/k8s" "${BROKEN}/docs/adr"
cp -a "${ROOT}/deploy/k8s/." "${BROKEN}/deploy/k8s/"
cp "${ROOT}/docs/adr/0080-api-pod-topology-spread.md" \
  "${BROKEN}/docs/adr/0080-api-pod-topology-spread.md"
cp "${SCRIPT}" "${BROKEN}/deploy/k8s/check-topology-spread.sh"
chmod +x "${BROKEN}/deploy/k8s/check-topology-spread.sh"

# Soft hostname spread lets every live pod pile onto one node.
# The zone item stays DoNotSchedule (ADR 0095). Only the hostname line
# is flipped back to ScheduleAnyway.
sed -i '/topologyKey: kubernetes.io\/hostname/{n;s/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/;}' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when the blue hostname constraint is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-topology-spread.sh"

# A selector of only app=computerpets would count the other color during cutover.
cp "${ROOT}/deploy/k8s/deployment-blue.yaml" "${BROKEN}/deploy/k8s/deployment-blue.yaml"
sed -i '/^              color: blue$/d' "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when the blue spread selector drops its color" \
  "${BROKEN}/deploy/k8s/check-topology-spread.sh"

# Green is the next live color. A cutover must not pack it onto one node.
cp "${ROOT}/deploy/k8s/deployment-blue.yaml" "${BROKEN}/deploy/k8s/deployment-blue.yaml"
sed -i 's/topologySpreadConstraints:/notTopologySpread:/' \
  "${BROKEN}/deploy/k8s/deployment-green.yaml"
assert_exit 1 "check fails when green drops topology spread" \
  "${BROKEN}/deploy/k8s/check-topology-spread.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
