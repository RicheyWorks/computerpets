#!/usr/bin/env bash
# Meta-tests for check-cluster-autoscaler-pending-lease.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ca-pending-lease-out.$$ 2>/tmp/cp-ca-pending-lease-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ca-pending-lease-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ca-pending-lease-err.$$ || true
  fi
  rm -f /tmp/cp-ca-pending-lease-out.$$ /tmp/cp-ca-pending-lease-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" "${dest}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${dest}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/README.md" "${dest}/deploy/k8s/README.md"
  cp "${ROOT}/docs/adr/0110-cluster-autoscaler-pending-lease.md" \
    "${dest}/docs/adr/0110-cluster-autoscaler-pending-lease.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"
  chmod +x "${dest}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"
}

replace_once() {
  local file="$1"
  local old="$2"
  local new="$3"
  python3 - "$file" "$old" "$new" <<'PY'
import pathlib, sys
path, old, new = sys.argv[1:]
file = pathlib.Path(path)
text = file.read_text()
if text.count(old) != 1:
    raise SystemExit(f"count {text.count(old)} for {old!r} in {path}")
file.write_text(text.replace(old, new, 1))
PY
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-cluster-autoscaler-pending-lease.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "--leader-elect=true" \
  "--leader-elect=false"
assert_exit 1 "check fails when leader election is turned off" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "--leader-elect-resource-lock=leases" \
  "--leader-elect-resource-lock=endpointsleases"
assert_exit 1 "check fails when the lock is not leases" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "- --leader-elect=true" \
  "- --leader-elect=true
            - --leader-elect-lease-duration=1s"
assert_exit 1 "check fails when a lease duration pretends to start a Pending pod" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "- --namespace=kube-system" \
  "- --namespace=kube-system
            - --leader-elect-resource-namespace=default"
assert_exit 1 "check fails when the unused resource-namespace flag is set" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "priorityClassName: system-cluster-critical" \
  "priorityClassName: system-node-critical"
assert_exit 1 "check fails when the priority class becomes system-node-critical" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "      priorityClassName: system-cluster-critical" \
  "      # priorityClassName: system-cluster-critical"
assert_exit 1 "check fails when the priority class is dropped" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "  minAvailable: 1" \
  "  minAvailable: 0"
assert_exit 1 "check fails when the budget lets the Running leader drain" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "  replicas: 2" \
  "  replicas: 1"
assert_exit 1 "check fails when the Deployment drops to one replica" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "        - maxSkew: 1" \
  "        - maxSkew: 1
          minDomains: 1"
assert_exit 1 "check fails when minDomains is set" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "      containers:
        - name: cluster-autoscaler" \
  "      initContainers:
        - name: lease-holder
          image: registry.k8s.io/autoscaling/cluster-autoscaler:v1.36.1
      containers:
        - name: cluster-autoscaler"
assert_exit 1 "check fails when an init container is supposed to hold the lease" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "registry.k8s.io/autoscaling/cluster-autoscaler:v1.36.1" \
  "registry.k8s.io/autoscaling/cluster-autoscaler:v1.36.2"
assert_exit 1 "check fails when the image is not the inventoried binary" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/kustomization.yaml" \
  "  - deployment-blue.yaml" \
  "  - deployment-blue.yaml
  - cluster-autoscaler.yaml"
assert_exit 1 "check fails when kustomization lists the autoscaler file" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

copy_tree "${BROKEN}"
python3 - "${BROKEN}/docs/adr/0110-cluster-autoscaler-pending-lease.md" <<'PY'
import pathlib, sys
file = pathlib.Path(sys.argv[1])
text = file.read_text()
if "OnStartedLeading" not in text:
    raise SystemExit("callback name missing before the regression")
file.write_text(text.replace("OnStartedLeading", "on the started callback"))
PY
assert_exit 1 "check fails when the ADR drops the scale-loop callback" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-pending-lease.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
