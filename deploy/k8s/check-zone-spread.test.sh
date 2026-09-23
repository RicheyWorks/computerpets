#!/usr/bin/env bash
# Meta-tests for check-zone-spread.sh (no cluster).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-zone-spread.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-zone-out.$$ 2>/tmp/cp-zone-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-zone-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-zone-err.$$ || true
  fi
  rm -f /tmp/cp-zone-out.$$ /tmp/cp-zone-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-zone-spread.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

mkdir -p "${BROKEN}/deploy/k8s" "${BROKEN}/docs/adr"
cp -a "${ROOT}/deploy/k8s/." "${BROKEN}/deploy/k8s/"
cp "${ROOT}/docs/adr/0081-api-pod-zone-spread.md" \
  "${BROKEN}/docs/adr/0081-api-pod-zone-spread.md"
cp "${ROOT}/docs/adr/0080-api-pod-topology-spread.md" \
  "${BROKEN}/docs/adr/0080-api-pod-topology-spread.md"
cp "${SCRIPT}" "${BROKEN}/deploy/k8s/check-zone-spread.sh"
chmod +x "${BROKEN}/deploy/k8s/check-zone-spread.sh"

# Soft zone spread lets every live pod pile into one labeled zone.
# Only the zone item is flipped; hostname stays soft.
sed -i '/topologyKey: topology.kubernetes.io\/zone/{n;s/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/;}' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when the blue zone constraint is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-zone-spread.sh"

# The zone selector must not count the other color during a cutover.
cp "${ROOT}/deploy/k8s/deployment-blue.yaml" "${BROKEN}/deploy/k8s/deployment-blue.yaml"
awk '
  BEGIN { seen=0 }
  /topologyKey: topology.kubernetes.io\/zone/ { inzone=1 }
  inzone && /^              color: blue$/ && seen==0 { seen=1; next }
  /^        - maxSkew:/ && inzone && seen==1 { inzone=0 }
  { print }
' "${BROKEN}/deploy/k8s/deployment-blue.yaml" >"${BROKEN}/deploy/k8s/deployment-blue.yaml.zone-color"
mv "${BROKEN}/deploy/k8s/deployment-blue.yaml.zone-color" \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when the blue zone selector drops its color" \
  "${BROKEN}/deploy/k8s/check-zone-spread.sh"

# Green is the next live color. A cutover must not pack it into one zone.
cp "${ROOT}/deploy/k8s/deployment-blue.yaml" "${BROKEN}/deploy/k8s/deployment-blue.yaml"
sed -i '/topologyKey: topology.kubernetes.io\/zone/d' \
  "${BROKEN}/deploy/k8s/deployment-green.yaml"
assert_exit 1 "check fails when green drops the zone key" \
  "${BROKEN}/deploy/k8s/check-zone-spread.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
