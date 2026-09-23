#!/usr/bin/env bash
# Meta-tests for check-metrics-server-zone-hard-spread.sh (no cluster).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ms-zone-out.$$ 2>/tmp/cp-ms-zone-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ms-zone-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ms-zone-err.$$ || true
  fi
  rm -f /tmp/cp-ms-zone-out.$$ /tmp/cp-ms-zone-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0098-metrics-server-zone-hard-spread.md" \
    "${dest}/docs/adr/0098-metrics-server-zone-hard-spread.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"
  chmod +x "${dest}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-metrics-server-zone-hard-spread.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
# Soft zone spread lets both replicas pile into one labeled zone.
sed -i 's/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the zone constraint is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# minDomains 2 treats one labeled zone as empty and leaves the second pod Pending.
python3 - "${BROKEN}/deploy/k8s/metrics-server.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "topologyKey: topology.kubernetes.io/zone\n        whenUnsatisfiable: DoNotSchedule\n"
repl = needle + "        minDomains: 2\n"
if needle not in text:
    raise SystemExit("zone item not found")
path.write_text(text.replace(needle, repl, 1))
PY
assert_exit 1 "check fails when the zone constraint sets minDomains" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Ignore would count nodes outside the pool as empty zone domains.
sed -i 's/nodeAffinityPolicy: Honor/nodeAffinityPolicy: Ignore/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when nodeAffinityPolicy is Ignore" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# A missing taint policy counts nodes this pod cannot tolerate.
sed -i '/nodeTaintsPolicy: Honor/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when nodeTaintsPolicy is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i 's/maxSkew: 1/maxSkew: 2/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when maxSkew is not 1" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i 's/^  replicas: 2$/  replicas: 1/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the addon drops to one replica" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i '/podAntiAffinity:/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when required hostname anti-affinity is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# A required zone term leaves the second pod Pending on one zone.
python3 - "${BROKEN}/deploy/k8s/metrics-server.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "            topologyKey: kubernetes.io/hostname\n"
repl = needle + """          - labelSelector:
              matchLabels:
                k8s-app: metrics-server
            namespaces:
            - kube-system
            topologyKey: topology.kubernetes.io/zone
"""
if needle not in text:
    raise SystemExit("hostname term not found")
path.write_text(text.replace(needle, repl, 1))
PY
assert_exit 1 "check fails when zone anti-affinity is required" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i '/computerpets\/node-pool: api/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the pool nodeSelector is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
python3 - "${BROKEN}/deploy/k8s/metrics-server.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
start = text.find("      tolerations:\n")
end = text.find("      priorityClassName:", start)
if start < 0 or end < 0:
    raise SystemExit("tolerations block not found")
path.write_text(text[:start] + text[end:])
PY
assert_exit 1 "check fails when the pool toleration is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i '/- service.yaml/a\  - metrics-server.yaml' \
  "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomize would apply metrics-server" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Required zone anti-affinity is not the follow-up.
sed -i '/preferredDuringSchedulingIgnoredDuringExecution:/,/topologyKey: topology.kubernetes.io\/zone/s/preferredDuringSchedulingIgnoredDuringExecution:/requiredDuringSchedulingIgnoredDuringExecution:/' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when cluster-autoscaler zone anti-affinity is required" \
  "${BROKEN}/deploy/k8s/check-metrics-server-zone-hard-spread.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
