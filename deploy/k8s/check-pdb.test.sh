#!/usr/bin/env bash
# Meta-tests for check-pdb.sh (no cluster).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-pdb.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-pdb-out.$$ 2>/tmp/cp-pdb-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-pdb-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-pdb-err.$$ || true
  fi
  rm -f /tmp/cp-pdb-out.$$ /tmp/cp-pdb-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-pdb.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

# Full kustomize tree so a client-side `kubectl kustomize` can render.
# The gate still reads the broken pdb.yaml, not the real one.
mkdir -p "${BROKEN}/deploy/k8s" "${BROKEN}/docs/adr"
cp -a "${ROOT}/deploy/k8s/." "${BROKEN}/deploy/k8s/"
cp "${ROOT}/docs/adr/0079-pod-disruption-budget.md" \
  "${BROKEN}/docs/adr/0079-pod-disruption-budget.md"
cp "${SCRIPT}" "${BROKEN}/deploy/k8s/check-pdb.sh"
chmod +x "${BROKEN}/deploy/k8s/check-pdb.sh"

# Drop the budget under 2. The gate must fail.
sed -i 's/minAvailable: 2/minAvailable: 1/' "${BROKEN}/deploy/k8s/pdb.yaml"
assert_exit 1 "check fails when minAvailable drops below 2" \
  "${BROKEN}/deploy/k8s/check-pdb.sh"

# Restore, then drop the live color. A selector of only app=computerpets
# would also match the idle color during a cutover.
cp "${ROOT}/deploy/k8s/pdb.yaml" "${BROKEN}/deploy/k8s/pdb.yaml"
sed -i '/color: blue/d' "${BROKEN}/deploy/k8s/pdb.yaml"
assert_exit 1 "check fails when the selector drops the live color" \
  "${BROKEN}/deploy/k8s/check-pdb.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
