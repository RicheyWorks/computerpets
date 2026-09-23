#!/usr/bin/env bash
# ADR 0101 — the scheduled Cluster Autoscaler leader scales the
# underfilled zone. The Pending standby is not the scaler.
# No cluster. Does not kubectl apply. No terraform apply.
# Kind and minikube stay off this file. Do not set minDomains.
# Required hostname anti-affinity and required zone anti-affinity
# are not this slice.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
HPA="${ROOT}/deploy/k8s/hpa.yaml"
POOL="${ROOT}/deploy/terraform/modules/node_pool/main.tf"
CA="${ROOT}/deploy/terraform/modules/cluster_autoscaler/main.tf"
ROOT_MAIN="${ROOT}/deploy/terraform/main.tf"
ADR="${ROOT}/docs/adr/0101-cluster-autoscaler-leader-scale.md"
PASS=0
FAIL=0

ok() { PASS=$((PASS + 1)); echo "ok - $*"; }
bad() { FAIL=$((FAIL + 1)); echo "not ok - $*"; }

need_file() {
  if [ -f "$1" ]; then ok "file ${1#"${ROOT}/"}"
  else bad "missing $1"; fi
}

need_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE -- "$pattern" "$file"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file"))"; fi
}

need_not_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE -- "$pattern" "$file"; then bad "$name"
  else ok "$name"; fi
}

yaml_body() {
  grep -vE '^[[:space:]]*#' "$1" || true
}

need_not_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE -- "$pattern"; then bad "$name"
  else ok "$name"; fi
}

echo "== cluster-autoscaler leader scale files =="
need_file "$MANIFEST"
need_file "$KUSTOM"
need_file "$README"
need_file "$HPA"
need_file "$POOL"
need_file "$CA"
need_file "$ROOT_MAIN"
need_file "$ADR"

echo "== docs =="
need_grep "$ADR" 'The standby is not the scaler' "ADR says the standby is not the scaler"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'least-waste' "ADR names least-waste"
need_grep "$ADR" 'balance-similar-node-groups' "ADR names similar-group balance"
need_grep "$ADR" 'skip-nodes-with-system-pods' "ADR names the system-pod scale-down flag"
need_grep "$ADR" 'not a pod filter' "ADR says namespace is not a pod filter"
need_grep "$ADR" 'Required zone anti-affinity is not set' "ADR does not require zone anti-affinity"
need_grep "$ADR" 'Required hostname anti-affinity is not the follow-up' "ADR does not make hostname anti-affinity the follow-up"
need_grep "$MANIFEST" 'The standby is not the scaler' "manifest says the standby is not the scaler"
need_grep "$MANIFEST" 'ADR 0101' "manifest names ADR 0101"
need_grep "$MANIFEST" 'Kind and minikube' "manifest names kind and minikube"
need_grep "$README" 'ADR 0101' "README names ADR 0101"
need_grep "$README" 'standby is not the scaler' "README says the standby is not the scaler"
need_grep "$KUSTOM" 'ADR 0101' "kustomize comment names the leader scale path"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization still omits cluster-autoscaler"
need_not_grep_body "$MANIFEST" 'minDomains:' "zone spread does not set minDomains"
need_grep "$HPA" 'maxReplicas: 6' "HPA ceiling is still 6"

python3 - "$MANIFEST" "$POOL" "$CA" "$ROOT_MAIN" <<'PY'
import pathlib, re, sys

manifest = pathlib.Path(sys.argv[1]).read_text()
pool = pathlib.Path(sys.argv[2]).read_text()
ca = pathlib.Path(sys.argv[3]).read_text()
root_main = pathlib.Path(sys.argv[4]).read_text()
failed = False

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

def code_only(text):
    return "\n".join(line.split("#", 1)[0] for line in text.splitlines())

try:
    import yaml
except ImportError:
    check(False, "PyYAML is installed")
    sys.exit(1)

docs = [doc for doc in yaml.safe_load_all(manifest) if doc]
deps = [doc for doc in docs if doc.get("kind") == "Deployment"]
check(len(deps) == 1, "one Cluster Autoscaler Deployment")
check(not any(doc.get("kind") == "DaemonSet" for doc in docs),
      "the scaler is not a DaemonSet")
dep = deps[0] if deps else {}
spec = dep.get("spec") or {}
check(spec.get("replicas") == 2, "parsed replicas is 2")
pod = ((spec.get("template") or {}).get("spec") or {})
containers = pod.get("containers") or []
command = list(containers[0].get("command") or []) if containers else []

def count(arg):
    return sum(1 for item in command if item == arg)

def forbidden(prefix):
    return [item for item in command if item == prefix or item.startswith(prefix)]

check(count("./cluster-autoscaler") == 1, "command starts the autoscaler binary once")
check(count("--cloud-provider=aws") == 1, "cloud provider is aws")
check(count("--namespace=kube-system") == 1, "namespace is the kube-system lease namespace")
check(count("--leader-elect=true") == 1, "leader election is on")
check(count("--leader-elect-resource-lock=leases") == 1, "leader lock is leases")
check(count("--leader-elect-resource-name=cluster-autoscaler") == 1, "leader lock name is cluster-autoscaler")
check(count("--node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled=true,k8s.io/cluster-autoscaler/CLUSTER_NAME=owned") == 1,
      "auto-discovery selects every tagged group")
check(count("--balance-similar-node-groups=true") == 1, "similar node groups stay balanced")
check(count("--skip-nodes-with-system-pods=false") == 1, "system pods do not pin scale-down")
check(count("--expander=least-waste") == 1, "expander is least-waste")
check(not any(item.startswith("--leader-elect=false") for item in command),
      "leader election is not turned off")
check(not forbidden("--balance-similar-node-groups=") or
      forbidden("--balance-similar-node-groups=") == ["--balance-similar-node-groups=true"],
      "balance-similar-node-groups is not false and is not bare")
check(not any(item == "--balance-similar-node-groups" for item in command),
      "balance-similar-node-groups is not a bare flag")
check(not any(item.startswith("--expander=") and item != "--expander=least-waste" for item in command),
      "expander is not random, most-pods, price, priority, grpc, or a chain")
check(not any(item == "--skip-nodes-with-system-pods" or item.startswith("--skip-nodes-with-system-pods=")
              and item != "--skip-nodes-with-system-pods=false" for item in command),
      "skip-nodes-with-system-pods is not true and is not bare")
check(not any(item == "--namespace" or (item.startswith("--namespace=") and item != "--namespace=kube-system")
              for item in command),
      "namespace is not a different pod filter")
check(not any(item == "--allowed-scheduler-names" or item.startswith("--allowed-scheduler-names")
              for item in command),
      "no scheduler allow-list drops kube-system Pending pods")
check(not any(item == "--nodes" or item.startswith("--nodes=") for item in command),
      "no explicit --nodes list replaces multi-AZ discovery")

constraints = pod.get("topologySpreadConstraints") or []
check(len(constraints) == 1, "one zone spread item")
if constraints:
    item = constraints[0]
    check(item.get("whenUnsatisfiable") == "DoNotSchedule", "zone spread stays DoNotSchedule")
    check(item.get("maxSkew") == 1, "zone spread maxSkew stays 1")
    check("minDomains" not in item, "minDomains stays unset")
affinity = pod.get("affinity") or {}
anti = affinity.get("podAntiAffinity") or {}
required = anti.get("requiredDuringSchedulingIgnoredDuringExecution") or []
req_keys = [term.get("topologyKey") for term in required]
check(req_keys == ["kubernetes.io/hostname"], "required anti-affinity stays hostname only")
check("topology.kubernetes.io/zone" not in req_keys, "required zone anti-affinity is not set")

pool_code = code_only(pool)
ca_code = code_only(ca)
root_code = code_only(root_main)
check("length(var.subnets) >= 2" in pool_code, "node pool refuses a single zone")
check("length(var.subnets) >= 1" not in pool_code, "node pool floor is not one zone")
check("length(var.node_pool_subnets) >= 2" in root_code, "root gate refuses a single zone")
check("length(var.node_pool_subnets) >= 1" not in root_code, "root gate floor is not one zone")
check('for_each        = local.ready ? var.subnets : {}' in pool_code
      or "for_each        = local.ready ? var.subnets : {}" in pool
      or re.search(r"for_each\s*=\s*local\.ready \? var\.subnets : \{\}", pool_code),
      "one node group per subnet zone")
check(re.search(r"subnet_ids\s*=\s*\[each\.value\]", pool_code) is not None,
      "each group takes one subnet")
check(len(re.findall(r'resource "aws_eks_node_group"', pool_code)) == 1,
      "one managed node group resource")
assigns = re.findall(r"(?m)^[ \t]*instance_types\s*=\s*(\S+)\s*$", pool_code)
check(assigns == ["var.instance_types"], "every zone shares instance_types")
check(re.search(r'"computerpets/node-pool"\s*=\s*"api"', pool_code) is not None,
      "every zone labels computerpets/node-pool=api")
check(re.search(r'effect\s*=\s*"NO_SCHEDULE"', pool_code) is not None,
      "every zone taints NoSchedule")
check("setproduct(sort(keys(var.subnets)), sort(keys(local.ca_discovery_tags)))" in pool_code,
      "discovery tags cover every zone")
mins = re.findall(r"(?m)^[ \t]*min_size_per_zone\s*=\s*(\d+)\s*$", pool_code)
maxes = re.findall(r"(?m)^[ \t]*max_size_per_zone\s*=\s*(\d+)\s*$", pool_code)
check(mins == ["3"], "min size per zone is 3 (ADR 0106)")
check(maxes == ["20"] and int(maxes[0]) > int(mins[0]),
      "max size per zone is 20, above the floor")
check('resource "aws_autoscaling_group"' not in pool_code, "no raw single ASG")

def list_body(name, text):
    match = re.search(rf"{name}\s*=\s*\[(.*?)\]", text, re.S)
    return match.group(1) if match else ""

describe = list_body("describe_actions", ca_code)
denied = list_body("denied_actions", ca_code)
check("eks:DescribeNodegroup" in describe, "DescribeNodegroup stays on the describe list")
check("eks:DescribeNodegroup" not in denied, "DescribeNodegroup is not denied")
check("autoscaling:SetDesiredCapacity" in list_body("scale_actions", ca_code),
      "the leader can set desired capacity")
if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
