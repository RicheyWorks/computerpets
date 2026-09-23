#!/usr/bin/env bash
# Meta-tests for check-cluster-autoscaler-zone-hard-spread.sh (no cluster).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ca-zone-out.$$ 2>/tmp/cp-ca-zone-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ca-zone-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ca-zone-err.$$ || true
  fi
  rm -f /tmp/cp-ca-zone-out.$$ /tmp/cp-ca-zone-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0099-cluster-autoscaler-zone-hard-spread.md" \
    "${dest}/docs/adr/0099-cluster-autoscaler-zone-hard-spread.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"
  chmod +x "${dest}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"
}

require_zone_anti() {
  python3 - "$1" <<'PY'
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
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-cluster-autoscaler-zone-hard-spread.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
# ScheduleAnyway lets both replicas pile into one labeled zone.
sed -i 's/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when the zone constraint is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# minDomains 2 treats a single labeled zone as an empty second domain.
sed -i '/whenUnsatisfiable: DoNotSchedule/a\          minDomains: 2' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when the zone constraint sets minDomains" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Ignore counts nodes that fail the pool selector.
sed -i 's/nodeAffinityPolicy: Honor/nodeAffinityPolicy: Ignore/' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when nodeAffinityPolicy is Ignore" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Dropping the taint policy counts nodes this pod cannot tolerate.
sed -i '/nodeTaintsPolicy: Honor/d' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when nodeTaintsPolicy is dropped" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# maxSkew 2 allows 2 and 0 again.
sed -i 's/maxSkew: 1/maxSkew: 2/' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when maxSkew is 2" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# One replica is the single-pod shape this spread replaced.
sed -i 's/replicas: 2/replicas: 1/' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when replicas drop to 1" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Without the hostname rule both pods can land on the node that then dies.
sed -i '/topologyKey: kubernetes.io\/hostname/d' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when hostname anti-affinity is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Required zone anti-affinity leaves the second pod Pending in one zone.
require_zone_anti "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when zone anti-affinity is required" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# A preferred zone term is a second zone rule beside the hard spread.
python3 - "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
old = "              topologyKey: kubernetes.io/hostname\n"
new = """              topologyKey: kubernetes.io/hostname
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
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
assert_exit 1 "check fails when a preferred zone term returns" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Without the pool key, two hostnames outside the groups satisfy anti-affinity.
sed -i '/computerpets\/node-pool: api/d' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when the pool nodeSelector is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Without the toleration the tainted pool cannot take the pod.
python3 - "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
start = text.find("      tolerations:\n")
end = text.find("      serviceAccountName:", start)
if start < 0 or end < 0:
    raise SystemExit("tolerations block not found")
path.write_text(text[:start] + text[end:])
PY
assert_exit 1 "check fails when the pool toleration is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Both replicas would call SetDesiredCapacity if the election flag is off.
sed -i 's/--leader-elect=true/--leader-elect=false/' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when leader election is turned off" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# minAvailable 2 with replicas 2 allows zero voluntary evictions.
python3 - "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
marker = "kind: PodDisruptionBudget"
idx = text.rfind(marker)
if idx < 0:
    raise SystemExit("pdb missing")
head, tail = text[:idx], text[idx:]
tail = tail.replace("minAvailable: 1", "minAvailable: 2", 1)
path.write_text(head + tail)
PY
assert_exit 1 "check fails when minAvailable would block every eviction" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Local apply must not start the autoscaler on kind or minikube.
sed -i '/- deployment-green.yaml/a\  - cluster-autoscaler.yaml' \
  "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomize would apply the autoscaler" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

copy_tree "${BROKEN}"
# Softening metrics-server is not this slice, and it must not pass unnoticed.
sed -i 's/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when metrics-server zone spread is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
