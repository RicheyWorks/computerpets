#!/usr/bin/env bash
# Meta-tests for check-cluster-autoscaler-leader-scale.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ca-leader-out.$$ 2>/tmp/cp-ca-leader-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ca-leader-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ca-leader-err.$$ || true
  fi
  rm -f /tmp/cp-ca-leader-out.$$ /tmp/cp-ca-leader-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" \
    "${dest}/deploy/terraform/modules/node_pool" \
    "${dest}/deploy/terraform/modules/cluster_autoscaler" \
    "${dest}/docs/adr"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" "${dest}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${dest}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/README.md" "${dest}/deploy/k8s/README.md"
  cp "${ROOT}/deploy/k8s/hpa.yaml" "${dest}/deploy/k8s/hpa.yaml"
  cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
    "${dest}/deploy/terraform/modules/node_pool/main.tf"
  cp "${ROOT}/deploy/terraform/modules/cluster_autoscaler/main.tf" \
    "${dest}/deploy/terraform/modules/cluster_autoscaler/main.tf"
  cp "${ROOT}/deploy/terraform/main.tf" "${dest}/deploy/terraform/main.tf"
  cp "${ROOT}/docs/adr/0101-cluster-autoscaler-leader-scale.md" \
    "${dest}/docs/adr/0101-cluster-autoscaler-leader-scale.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"
  chmod +x "${dest}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"
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
assert_exit 0 "check-cluster-autoscaler-leader-scale.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --expander=least-waste" \
  "            - --expander=random"
assert_exit 1 "check fails when the expander is random" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --expander=least-waste" \
  "            - --expander=most-pods"
assert_exit 1 "check fails when the expander is most-pods" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --expander=least-waste" \
  "            - --expander=priority,least-waste"
assert_exit 1 "check fails when the expander is a chain" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --expander=least-waste"$'\n' \
  ""
assert_exit 1 "check fails when the expander arg is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --balance-similar-node-groups=true" \
  "            - --balance-similar-node-groups=false"
assert_exit 1 "check fails when similar node groups are not balanced" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --balance-similar-node-groups=true"$'\n' \
  ""
assert_exit 1 "check fails when the balance arg is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --skip-nodes-with-system-pods=false" \
  "            - --skip-nodes-with-system-pods=true"
assert_exit 1 "check fails when skip-nodes-with-system-pods is true" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --skip-nodes-with-system-pods=false" \
  "            - --skip-nodes-with-system-pods"
assert_exit 1 "check fails when skip-nodes-with-system-pods is bare" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --expander=least-waste" \
  "            - --expander=least-waste"$'\n'"            - --allowed-scheduler-names=default"
assert_exit 1 "check fails when a scheduler allow-list is set" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --expander=least-waste" \
  "            - --expander=least-waste"$'\n'"            - --nodes=1:10:only-one-zone"
assert_exit 1 "check fails when --nodes names a single group" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --namespace=kube-system" \
  "            - --namespace=default"
assert_exit 1 "check fails when namespace is not kube-system" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "            - --leader-elect=true" \
  "            - --leader-elect=false"
assert_exit 1 "check fails when leader election is off" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "          whenUnsatisfiable: DoNotSchedule" \
  "          whenUnsatisfiable: DoNotSchedule"$'\n'"          minDomains: 2"
assert_exit 1 "check fails when minDomains is set" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml" \
  "              topologyKey: kubernetes.io/hostname" \
  "              topologyKey: kubernetes.io/hostname"$'\n'"            - labelSelector:"$'\n'"                matchLabels:"$'\n'"                  app: cluster-autoscaler"$'\n'"              namespaces:"$'\n'"                - kube-system"$'\n'"              topologyKey: topology.kubernetes.io/zone"
assert_exit 1 "check fails when zone anti-affinity is required" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "length(var.subnets) >= 2" \
  "length(var.subnets) >= 1"
assert_exit 1 "check fails when the node pool allows a single zone" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/main.tf" \
  "length(var.node_pool_subnets) >= 2" \
  "length(var.node_pool_subnets) >= 1"
assert_exit 1 "check fails when the root gate allows a single zone" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "subnet_ids      = [each.value]" \
  "subnet_ids      = values(var.subnets)"
assert_exit 1 "check fails when one group takes every subnet" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "instance_types  = var.instance_types" \
  "instance_types  = each.key == \"a\" ? [\"t3.large\"] : [\"t3.medium\"]"
assert_exit 1 "check fails when instance types differ by zone" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "setproduct(sort(keys(var.subnets)), sort(keys(local.ca_discovery_tags)))" \
  "setproduct([\"us-east-1a\"], sort(keys(local.ca_discovery_tags)))"
assert_exit 1 "check fails when discovery tags cover one zone" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/node_pool/main.tf" \
  "max_size_per_zone     = 10" \
  "max_size_per_zone     = 1"
assert_exit 1 "check fails when max size cannot grow past the floor" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
replace_once "${BROKEN}/deploy/terraform/modules/cluster_autoscaler/main.tf" \
  "    \"eks:DescribeNodegroup\","$'\n' \
  ""
assert_exit 1 "check fails when DescribeNodegroup is removed" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

copy_tree "${BROKEN}"
printf '\n  - cluster-autoscaler.yaml\n' >> "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomization lists the manifest" \
  "${BROKEN}/deploy/k8s/check-cluster-autoscaler-leader-scale.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
