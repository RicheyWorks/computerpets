#!/usr/bin/env bash
# Meta-tests for check-api-hostname-hard-spread.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-api-hostname-hard-spread.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-host-hard-out.$$ 2>/tmp/cp-host-hard-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-host-hard-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-host-hard-err.$$ || true
  fi
  rm -f /tmp/cp-host-hard-out.$$ /tmp/cp-host-hard-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0100-api-hostname-hard-spread.md" \
    "${dest}/docs/adr/0100-api-hostname-hard-spread.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-api-hostname-hard-spread.sh"
  chmod +x "${dest}/deploy/k8s/check-api-hostname-hard-spread.sh"
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-api-hostname-hard-spread.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
# Soft hostname spread lets every live pod pile onto one node.
sed -i '/topologyKey: kubernetes.io\/hostname/{n;s/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/;}' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when the blue hostname constraint is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i '/topologyKey: kubernetes.io\/hostname/{n;s/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/;}' \
  "${BROKEN}/deploy/k8s/deployment-green.yaml"
assert_exit 1 "check fails when the green hostname constraint is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
# Ignore would count nodes outside the pool as empty hostname domains.
python3 - "${BROKEN}/deploy/k8s/deployment-blue.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "topologyKey: kubernetes.io/hostname\n          whenUnsatisfiable: DoNotSchedule\n          nodeTaintsPolicy: Honor\n          nodeAffinityPolicy: Honor"
repl = needle.replace("nodeAffinityPolicy: Honor", "nodeAffinityPolicy: Ignore", 1)
if needle not in text:
    raise SystemExit("hostname item not found")
path.write_text(text.replace(needle, repl, 1))
PY
assert_exit 1 "check fails when the blue hostname nodeAffinityPolicy is Ignore" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
python3 - "${BROKEN}/deploy/k8s/deployment-blue.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "topologyKey: kubernetes.io/hostname\n          whenUnsatisfiable: DoNotSchedule\n          nodeTaintsPolicy: Honor\n"
repl = needle.replace("nodeTaintsPolicy: Honor", "nodeTaintsPolicy: Ignore", 1)
if needle not in text:
    raise SystemExit("hostname item not found")
path.write_text(text.replace(needle, repl, 1))
PY
assert_exit 1 "check fails when the blue hostname nodeTaintsPolicy is Ignore" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
# minDomains 2 treats one hostname as empty and leaves the laptop Pending.
python3 - "${BROKEN}/deploy/k8s/deployment-blue.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "topologyKey: kubernetes.io/hostname\n          whenUnsatisfiable: DoNotSchedule\n"
repl = needle + "          minDomains: 2\n"
if needle not in text:
    raise SystemExit("hostname item not found")
path.write_text(text.replace(needle, repl, 1))
PY
assert_exit 1 "check fails when the blue hostname constraint sets minDomains" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
python3 - "${BROKEN}/deploy/k8s/deployment-green.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
old = "        - maxSkew: 1\n          topologyKey: kubernetes.io/hostname\n"
new = "        - maxSkew: 2\n          topologyKey: kubernetes.io/hostname\n"
if text.count(old) != 1:
    raise SystemExit(f"hostname maxSkew count {text.count(old)}")
path.write_text(text.replace(old, new, 1))
PY
assert_exit 1 "check fails when the green hostname maxSkew is 2" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
python3 - "${BROKEN}/deploy/k8s/deployment-blue.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "topologyKey: kubernetes.io/hostname\n          whenUnsatisfiable: DoNotSchedule\n"
repl = needle + "          matchLabelKeys:\n            - pod-template-hash\n"
if needle not in text:
    raise SystemExit("hostname item not found")
path.write_text(text.replace(needle, repl, 1))
PY
assert_exit 1 "check fails when the blue hostname constraint sets matchLabelKeys" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
# Required hostname anti-affinity would leave the second pod Pending on one node.
python3 - "${BROKEN}/deploy/k8s/deployment-blue.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
needle = "      topologySpreadConstraints:\n"
repl = """      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchLabels:
                  app: computerpets
                  color: blue
              topologyKey: kubernetes.io/hostname
      topologySpreadConstraints:
"""
if text.count(needle) != 1:
    raise SystemExit(f"spread header count {text.count(needle)}")
path.write_text(text.replace(needle, repl, 1))
PY
assert_exit 1 "check fails when blue adds required hostname anti-affinity" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i '/topologyKey: topology.kubernetes.io\/zone/{n;s/whenUnsatisfiable: DoNotSchedule/whenUnsatisfiable: ScheduleAnyway/;}' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when the blue zone constraint is ScheduleAnyway" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i 's/minReplicas: 3/minReplicas: 2/' "${BROKEN}/deploy/k8s/hpa.yaml"
assert_exit 1 "check fails when the HPA floor drops below 3" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
sed -i 's/minAvailable: 2/minAvailable: 1/' "${BROKEN}/deploy/k8s/pdb.yaml"
assert_exit 1 "check fails when the API PDB minAvailable drops below 2" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

copy_tree "${BROKEN}"
python3 - "${BROKEN}/deploy/k8s/deployment-blue.yaml" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
old = "        computerpets/node-pool: api\n"
if text.count(old) != 1:
    raise SystemExit(f"pool key count {text.count(old)}")
path.write_text(text.replace(old, "", 1))
PY
assert_exit 1 "check fails when blue drops the pool selector" \
  "${BROKEN}/deploy/k8s/check-api-hostname-hard-spread.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
