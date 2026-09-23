#!/usr/bin/env bash
# Meta-tests for check-api-zone-hard-spread.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-api-zone-hard-spread.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-zone-hard-out.$$ 2>/tmp/cp-zone-hard-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-zone-hard-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-zone-hard-err.$$ || true
  fi
  rm -f /tmp/cp-zone-hard-out.$$ /tmp/cp-zone-hard-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr" \
    "${dest}/deploy/terraform/modules/node_pool"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0095-api-zone-hard-spread.md" \
    "${dest}/docs/adr/0095-api-zone-hard-spread.md"
  cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
    "${dest}/deploy/terraform/modules/node_pool/main.tf"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-api-zone-hard-spread.sh"
  chmod +x "${dest}/deploy/k8s/check-api-zone-hard-spread.sh"
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-api-zone-hard-spread.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
# Soft zone spread lets every live pod pile into one labeled zone.
sed -i '/topologyKey: topology.kubernetes.io\/zone/{n;s/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/;}' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when the blue zone constraint is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-api-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Hard hostname spread is still the wrong follow-up.
sed -i '/topologyKey: kubernetes.io\/hostname/{n;s/whenUnsatisfiable: ScheduleAnyway/whenUnsatisfiable: DoNotSchedule/;}' \
  "${BROKEN}/deploy/k8s/deployment-green.yaml"
assert_exit 1 "check fails when the green hostname constraint is DoNotSchedule" \
  "${BROKEN}/deploy/k8s/check-api-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Ignore would count nodes outside the pool as empty zone domains.
python3 - "${BROKEN}/deploy/k8s/deployment-blue.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "topologyKey: topology.kubernetes.io/zone\n          whenUnsatisfiable: DoNotSchedule\n          nodeTaintsPolicy: Honor\n          nodeAffinityPolicy: Honor"
repl = needle.replace("nodeAffinityPolicy: Honor", "nodeAffinityPolicy: Ignore", 1)
if needle not in text:
    raise SystemExit("zone item not found")
path.write_text(text.replace(needle, repl, 1))
PY
assert_exit 1 "check fails when the blue zone nodeAffinityPolicy is Ignore" \
  "${BROKEN}/deploy/k8s/check-api-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# minDomains 2 treats one labeled zone as empty and leaves the laptop Pending.
python3 - "${BROKEN}/deploy/k8s/deployment-blue.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "topologyKey: topology.kubernetes.io/zone\n          whenUnsatisfiable: DoNotSchedule\n"
repl = needle + "          minDomains: 2\n"
if needle not in text:
    raise SystemExit("zone item not found")
path.write_text(text.replace(needle, repl, 1))
PY
assert_exit 1 "check fails when the blue zone constraint sets minDomains" \
  "${BROKEN}/deploy/k8s/check-api-zone-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i 's/minReplicas: 3/minReplicas: 2/' "${BROKEN}/deploy/k8s/hpa.yaml"
assert_exit 1 "check fails when the HPA floor drops below 3" \
  "${BROKEN}/deploy/k8s/check-api-zone-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i 's/minAvailable: 2/minAvailable: 1/' "${BROKEN}/deploy/k8s/pdb.yaml"
assert_exit 1 "check fails when the API PDB minAvailable drops below 2" \
  "${BROKEN}/deploy/k8s/check-api-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Required zone anti-affinity is not the follow-up.
python3 - "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
old = "              topologyKey: kubernetes.io/hostname\n"
new = """              topologyKey: kubernetes.io/hostname
            - labelSelector:
                matchLabels:
                  app: cluster-autoscaler
              namespaces:
                - kube-system
              topologyKey: topology.kubernetes.io/zone
"""
if text.count(old) != 1:
    raise SystemExit(f"hostname term count {text.count(old)}")
path.write_text(text.replace(old, new, 1))
PY
assert_exit 1 "check fails when cluster-autoscaler zone anti-affinity is required" \
  "${BROKEN}/deploy/k8s/check-api-zone-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i 's/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when metrics-server zone spread is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-api-zone-hard-spread.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
