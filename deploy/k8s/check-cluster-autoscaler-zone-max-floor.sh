#!/usr/bin/env bash
# ADR 0109 — per-zone max stays 20, above the one-zone floor of 8.
# The floor is maxReplicas 3 + Cluster Autoscaler 2 + metrics-server 2
# + one drain node. Twice the HPA ceiling is 6 and is refused.
# The live set binds on min_size 3, so MaxLimitReached at 20 is
# unreachable in this design. No cluster. Does not kubectl apply.
# No terraform apply. Kind and minikube stay off this file.
# Do not set minDomains.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
POOL="${ROOT}/deploy/terraform/modules/node_pool/main.tf"
CA="${ROOT}/deploy/terraform/modules/cluster_autoscaler/main.tf"
VARS="${ROOT}/deploy/terraform/variables.tf"
HPA="${ROOT}/deploy/k8s/hpa.yaml"
MANIFEST="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
METRICS="${ROOT}/deploy/k8s/metrics-server.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
ADR="${ROOT}/docs/adr/0109-per-zone-node-max-floor.md"
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

echo "== per-zone max floor files =="
need_file "$POOL"
need_file "$CA"
need_file "$VARS"
need_file "$HPA"
need_file "$MANIFEST"
need_file "$METRICS"
need_file "$BLUE"
need_file "$GREEN"
need_file "$KUSTOM"
need_file "$ADR"

echo "== docs =="
need_grep "$ADR" 'zone-max-nodes=20' "ADR names the house ceiling"
need_grep "$ADR" 'zone-max-floor=8' "ADR names the one-zone floor"
need_grep "$ADR" 'DescribeAutoScalingGroups' "ADR names how the leader reads MaxSize"
need_grep "$ADR" 'at 20 is unreachable' "ADR names why the cap is not the live skip"
need_grep "$ADR" 'twice' "ADR records why twice the new ceiling is under the floor"
need_grep "$ADR" 'drain' "ADR names the drain node in the floor"
need_grep "$ADR" 'metrics-server' "ADR counts metrics-server in the floor"
need_grep "$ADR" 't3.medium' "ADR names the default worker"
need_grep "$ADR" 'UpdateNodegroupConfig' "ADR records that the leader cannot lift the ceiling"
need_grep "$ADR" 'Pending standby' "ADR names the next gap"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$POOL" 'zone-max-nodes=20' "node pool names the house ceiling"
need_grep "$POOL" 'zone-max-floor=8' "node pool names the one-zone floor"
need_grep "$POOL" 'hpa-max-replicas=3' "node pool still names the HPA pod ceiling"
need_grep "$POOL" 'max_size_per_zone[[:space:]]*=[[:space:]]*20' "max size per zone is 20"
need_grep "$VARS" 'default[[:space:]]*=[[:space:]]*\["t3\.medium"\]' "default worker stays t3.medium"
need_grep "$CA" 'autoscaling:DescribeAutoScalingGroups' "describe list can read the group max"
need_grep "$CA" 'eks:UpdateNodegroupConfig' "UpdateNodegroupConfig stays named so it can be denied"
need_not_grep "$POOL" 'variable "max_size_per_zone"' "node pool max is not a module variable"
need_not_grep "$VARS" 'variable "max_size_per_zone"' "root module has no max_size_per_zone variable"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization still omits cluster-autoscaler"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization still omits metrics-server"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*hpa\.yaml[[:space:]]*$' "kustomization still omits the HPA"
need_not_grep_body "$MANIFEST" 'minDomains:' "autoscaler zone spread does not set minDomains"
need_not_grep_body "$METRICS" 'minDomains:' "metrics-server zone spread does not set minDomains"

python3 - "$POOL" "$CA" "$HPA" "$MANIFEST" "$METRICS" "$BLUE" "$GREEN" <<'PY'
import pathlib, re, sys

pool = pathlib.Path(sys.argv[1]).read_text()
ca = pathlib.Path(sys.argv[2]).read_text()
hpa = pathlib.Path(sys.argv[3]).read_text()
manifest = pathlib.Path(sys.argv[4]).read_text()
metrics = pathlib.Path(sys.argv[5]).read_text()
blue = pathlib.Path(sys.argv[6]).read_text()
green = pathlib.Path(sys.argv[7]).read_text()
failed = False
HOUSE_MAX = 20
NAMED_FLOOR = 8
DRAIN_NODES = 1
# Half of t3.medium (2 vCPU, 4 GiB). The other half is the kubelet
# reservation and the DaemonSets that sit on every node.
HALF_CPU_M = 1000
HALF_MEM_MI = 2048

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

def code_only(text):
    return "\n".join(line.split("#", 1)[0] for line in text.splitlines())

def cpu_m(value):
    text = str(value).strip()
    if text.endswith("m"):
        return int(text[:-1])
    return int(text) * 1000

def mem_mi(value):
    text = str(value).strip()
    if text.endswith("Mi"):
        return int(text[:-2])
    if text.endswith("Gi"):
        return int(text[:-2]) * 1024
    raise ValueError(text)

def pod_requests(dep):
    containers = (((dep.get("spec") or {}).get("template") or {}).get("spec") or {}).get("containers") or []
    cpu = mem = 0
    for container in containers:
        req = ((container.get("resources") or {}).get("requests") or {})
        cpu += cpu_m(req["cpu"])
        mem += mem_mi(req["memory"])
    return cpu, mem, len(containers)

def deployment(text, name):
    try:
        import yaml
    except ImportError:
        check(False, "PyYAML is installed")
        return None
    docs = [doc for doc in yaml.safe_load_all(text) if isinstance(doc, dict)]
    found = [doc for doc in docs if doc.get("kind") == "Deployment" and (doc.get("metadata") or {}).get("name") == name]
    return found[0] if len(found) == 1 else None

def required_hostname(dep):
    spec = ((dep.get("spec") or {}).get("template") or {}).get("spec") or {}
    terms = (((spec.get("affinity") or {}).get("podAntiAffinity") or {}).get("requiredDuringSchedulingIgnoredDuringExecution") or [])
    return any(term.get("topologyKey") == "kubernetes.io/hostname" for term in terms)

pool_code = code_only(pool)
ca_code = code_only(ca)

hpa_max = re.findall(r"(?m)^[ \t]*maxReplicas:[ \t]*(\d+)[ \t]*$", hpa)
hpa_min = re.findall(r"(?m)^[ \t]*minReplicas:[ \t]*(\d+)[ \t]*$", hpa)
sizes = re.findall(r"(?m)^[ \t]*max_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
mins = re.findall(r"(?m)^[ \t]*min_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
desired = re.findall(r"(?m)^[ \t]*desired_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
resource_max = re.findall(r"(?m)^[ \t]*max_size[ \t]*=[ \t]*(\S+)[ \t]*$", pool_code)

try:
    import yaml
except ImportError:
    check(False, "PyYAML is installed")
    sys.exit(1)

ca_dep = deployment(manifest, "cluster-autoscaler")
ms_dep = deployment(metrics, "metrics-server")
blue_dep = deployment(blue, "computerpets-blue")
green_dep = deployment(green, "computerpets-green")
check(ca_dep is not None, "one Cluster Autoscaler Deployment")
check(ms_dep is not None, "one metrics-server Deployment")
check(blue_dep is not None, "one blue Deployment")
check(green_dep is not None, "one green Deployment")

ca_replicas = (ca_dep or {}).get("spec", {}).get("replicas")
ms_replicas = (ms_dep or {}).get("spec", {}).get("replicas")
blue_replicas = (blue_dep or {}).get("spec", {}).get("replicas")
green_replicas = (green_dep or {}).get("spec", {}).get("replicas")

check(hpa_max == ["3"], "HPA maxReplicas stays 3")
check(hpa_min == ["3"], "HPA minReplicas stays 3")
check(ca_replicas == 2, "Cluster Autoscaler stays 2 replicas")
check(ms_replicas == 2, "metrics-server stays 2 replicas")
check(blue_replicas == 2, "local blue stays 2")
check(green_replicas == 0, "green stays 0 and is not in the floor")
check(len(sizes) == 1 and sizes[0].isdigit(), "node pool has one numeric max")
check(mins == ["3"], "min size per zone is 3")
check(desired == ["3"], "create-time desired size is 3")
check(resource_max == ["local.max_size_per_zone"],
      "scaling_config max_size is the local, not a second literal")

if (
    hpa_max and hpa_max[0].isdigit()
    and isinstance(ca_replicas, int)
    and isinstance(ms_replicas, int)
    and mins == ["3"]
    and sizes and sizes[0].isdigit()
    and blue_dep and green_dep and ca_dep and ms_dep
):
    api = int(hpa_max[0])
    floor = api + ca_replicas + ms_replicas + DRAIN_NODES
    named = api + ca_replicas + ms_replicas
    configured = int(sizes[0])
    check(floor == NAMED_FLOOR, "computed floor is 8")
    check(configured >= floor, "configured max stays at or above the floor")
    check(configured == HOUSE_MAX, "configured max stays 20, not the floor and not above it")
    check(2 * api < floor, "twice the HPA ceiling is under the floor")
    check(named < floor, "the named pods without a drain node are under the floor")
    check(api < floor, "the HPA ceiling is not a large enough node cap")
    check(int(mins[0]) >= api, "min_size covers one API pod per floor hostname")
    check(int(mins[0]) >= ca_replicas, "min_size covers Cluster Autoscaler anti-affinity")
    check(int(mins[0]) >= ms_replicas, "min_size covers metrics-server anti-affinity")
    check(int(mins[0]) < configured, "min stays below the max")
    api_cpu, api_mem, api_n = pod_requests(blue_dep)
    green_cpu, green_mem, green_n = pod_requests(green_dep)
    ca_cpu, ca_mem, ca_n = pod_requests(ca_dep)
    ms_cpu, ms_mem, ms_n = pod_requests(ms_dep)
    check(api_n == 1 and green_n == 1 and ca_n == 1 and ms_n == 1,
          "each pinned workload is one container")
    check((green_cpu, green_mem) == (api_cpu, api_mem),
          "green requests match blue")
    steady_cpu = api_cpu + ca_cpu + ms_cpu
    steady_mem = api_mem + ca_mem + ms_mem
    drain_cpu = (2 * api_cpu) + ca_cpu + ms_cpu
    drain_mem = (2 * api_mem) + ca_mem + ms_mem
    check(steady_cpu < HALF_CPU_M and steady_mem < HALF_MEM_MI,
          "the busiest steady floor node fits under half a t3.medium")
    check(drain_cpu < HALF_CPU_M and drain_mem < HALF_MEM_MI,
          "the busiest drain node fits under half a t3.medium")
    check(required_hostname(ca_dep), "Cluster Autoscaler keeps required hostname anti-affinity")
    check(required_hostname(ms_dep), "metrics-server keeps required hostname anti-affinity")
    check(not required_hostname(blue_dep), "API does not gain required hostname anti-affinity")
else:
    check(False, "floor inputs are the house counts")

def list_body(name, text):
    match = re.search(rf"{name}\s*=\s*\[(.*?)\]", text, re.S)
    return match.group(1) if match else ""

describe = list_body("describe_actions", ca_code)
denied = list_body("denied_actions", ca_code)
check("autoscaling:DescribeAutoScalingGroups" in describe,
      "DescribeAutoScalingGroups stays on the describe list")
check("eks:UpdateNodegroupConfig" in denied, "UpdateNodegroupConfig stays denied")
check("autoscaling:UpdateAutoScalingGroup" in denied, "ASG max updates stay denied")

if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
