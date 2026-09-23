#!/usr/bin/env bash
# Meta-tests for check-api-pool-taint.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-api-pool-taint.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-api-taint-out.$$ 2>/tmp/cp-api-taint-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-api-taint-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-api-taint-err.$$ || true
  fi
  rm -f /tmp/cp-api-taint-out.$$ /tmp/cp-api-taint-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr" \
    "${dest}/deploy/terraform/modules/node_pool"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0094-api-pool-taint.md" \
    "${dest}/docs/adr/0094-api-pool-taint.md"
  cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
    "${dest}/deploy/terraform/modules/node_pool/main.tf"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-api-pool-taint.sh"
  chmod +x "${dest}/deploy/k8s/check-api-pool-taint.sh"
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-api-pool-taint.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
# PreferNoSchedule still admits pods that do not tolerate the pool.
sed -i 's/effect[[:space:]]*=[[:space:]]*"NO_SCHEDULE"/effect = "PREFER_NO_SCHEDULE"/' \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
assert_exit 1 "check fails when the node group taint is PreferNoSchedule" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

copy_tree "${BROKEN}"
# NoExecute would evict pods that are already running.
sed -i 's/effect[[:space:]]*=[[:space:]]*"NO_SCHEDULE"/effect = "NO_EXECUTE"/' \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
assert_exit 1 "check fails when the node group taint is NoExecute" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

copy_tree "${BROKEN}"
# Dropping the block puts untolerated pods back on API workers.
sed -i 's/taint {/skipped {/' \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
assert_exit 1 "check fails when the node group taint block is removed" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

copy_tree "${BROKEN}"
# A softer effect on blue does not match NoSchedule.
sed -i 's/effect: NoSchedule/effect: PreferNoSchedule/' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when blue prefers the taint" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

copy_tree "${BROKEN}"
# Exists would tolerate any value of this key.
sed -i 's/operator: Equal/operator: Exists/' \
  "${BROKEN}/deploy/k8s/deployment-green.yaml"
assert_exit 1 "check fails when green uses operator Exists" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

copy_tree "${BROKEN}"
# A drifted value would tolerate a taint this module does not set.
sed -i 's/value: api/value: other/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when metrics-server tolerates a different value" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

copy_tree "${BROKEN}"
# Without the toleration the scaler stays Pending on the tainted pool.
sed -i '/key: computerpets\/node-pool/d' \
  "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
assert_exit 1 "check fails when cluster-autoscaler drops the toleration key" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

copy_tree "${BROKEN}"
# A toleration without the selector lets the API land on any tainted node
# and also on nodes outside the pool.
sed -i '/computerpets\/node-pool: api/d' \
  "${BROKEN}/deploy/k8s/deployment-blue.yaml"
assert_exit 1 "check fails when blue keeps the toleration but drops the selector" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

copy_tree "${BROKEN}"
# Stores must stay off API workers. A toleration would admit them.
python3 - "${BROKEN}/deploy/k8s/postgres.yaml" <<'PY'
import pathlib, sys
import yaml
path = pathlib.Path(sys.argv[1])
docs = list(yaml.safe_load_all(path.read_text()))
for doc in docs:
    if isinstance(doc, dict) and doc.get("kind") == "Deployment":
        spec = doc["spec"]["template"]["spec"]
        spec["tolerations"] = [{
            "key": "computerpets/node-pool",
            "operator": "Equal",
            "value": "api",
            "effect": "NoSchedule",
        }]
path.write_text(yaml.safe_dump_all([doc for doc in docs if doc], sort_keys=False))
PY
assert_exit 1 "check fails when postgres tolerates the api pool taint" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

copy_tree "${BROKEN}"
# No DaemonSet in this tree selects the pool. A new one is unreviewed.
cat > "${BROKEN}/deploy/k8s/example-daemonset.yaml" <<'YAML'
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: example-addon
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: example-addon
  template:
    metadata:
      labels:
        app: example-addon
    spec:
      containers:
        - name: addon
          image: example:1
YAML
assert_exit 1 "check fails when deploy/k8s gains a DaemonSet" \
  "${BROKEN}/deploy/k8s/check-api-pool-taint.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
