#!/usr/bin/env bash
# ADR 0104 — each API zone's node-group max is 20.
# Cluster Autoscaler reads that as the Auto Scaling group MaxSize.
# The old local of 10 is refused. The max stays at least the HPA
# ceiling. min is 3 (ADR 0106). No cluster. Does not kubectl apply.
# No terraform apply. Kind and minikube stay off this file.
# Do not set minDomains.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
POOL="${ROOT}/deploy/terraform/modules/node_pool/main.tf"
CA="${ROOT}/deploy/terraform/modules/cluster_autoscaler/main.tf"
VARS="${ROOT}/deploy/terraform/variables.tf"
HPA="${ROOT}/deploy/k8s/hpa.yaml"
MANIFEST="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0104-per-zone-node-max.md"
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

echo "== per-zone node max files =="
need_file "$POOL"
need_file "$CA"
need_file "$VARS"
need_file "$HPA"
need_file "$MANIFEST"
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"

echo "== docs =="
need_grep "$ADR" 'max_size_per_zone' "ADR names the per-zone max"
need_grep "$ADR" 'DescribeAutoScalingGroups' "ADR names how the leader reads MaxSize"
need_grep "$ADR" 'MaxLimitReached' "ADR names the skip at the ceiling"
need_grep "$ADR" 'zone-max-nodes=20' "ADR names the house ceiling"
need_grep "$ADR" 'twice' "ADR records why 20 is twice the HPA ceiling"
need_grep "$ADR" 'UpdateNodegroupConfig' "ADR records that the leader cannot lift the ceiling"
need_grep "$ADR" 'not a root variable' "ADR refuses a tfvars override"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" '0105-api-hostname-floor' "hostname floor moved to ADR 0105"
need_grep "$POOL" 'zone-max-nodes=20' "node pool names the house ceiling"
need_grep "$POOL" 'hpa-max-replicas=6' "node pool still names the HPA pod ceiling"
need_grep "$POOL" 'max_size_per_zone[[:space:]]*=[[:space:]]*20' "max size per zone is 20"
need_grep "$MANIFEST" 'ADR 0104' "manifest names ADR 0104"
need_grep "$MANIFEST" 'Kind and minikube' "manifest names kind and minikube"
need_grep "$README" 'ADR 0104' "README names ADR 0104"
need_grep "$KUSTOM" 'ADR 0104' "kustomize comment names the zone max"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization still omits cluster-autoscaler"
need_not_grep "$POOL" 'variable "max_size_per_zone"' "node pool max is not a module variable"
need_not_grep "$VARS" 'variable "max_size_per_zone"' "root module has no max_size_per_zone variable"
need_not_grep_body "$MANIFEST" 'minDomains:' "zone spread does not set minDomains"
need_grep "$CA" 'autoscaling:DescribeAutoScalingGroups' "describe list can read the group max"
need_grep "$CA" 'eks:UpdateNodegroupConfig' "UpdateNodegroupConfig stays named so it can be denied"

python3 - "$POOL" "$CA" "$HPA" "$MANIFEST" <<'PY'
import pathlib, re, sys

pool = pathlib.Path(sys.argv[1]).read_text()
ca = pathlib.Path(sys.argv[2]).read_text()
hpa = pathlib.Path(sys.argv[3]).read_text()
manifest = pathlib.Path(sys.argv[4]).read_text()
failed = False
HOUSE_MAX = 20

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

def code_only(text):
    return "\n".join(line.split("#", 1)[0] for line in text.splitlines())

pool_code = code_only(pool)
ca_code = code_only(ca)

hpa_max = re.findall(r"(?m)^[ \t]*maxReplicas:[ \t]*(\d+)[ \t]*$", hpa)
sizes = re.findall(r"(?m)^[ \t]*max_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
mins = re.findall(r"(?m)^[ \t]*min_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
desired = re.findall(r"(?m)^[ \t]*desired_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
resource_max = re.findall(r"(?m)^[ \t]*max_size[ \t]*=[ \t]*(\S+)[ \t]*$", pool_code)

check(len(hpa_max) == 1, "HPA file has one maxReplicas")
check(sizes == [str(HOUSE_MAX)], "configured max is 20, not the old ceiling of 10")
if hpa_max and sizes and sizes[0].isdigit() and hpa_max[0].isdigit():
    check(int(sizes[0]) >= int(hpa_max[0]),
          "configured max is at least the HPA max pods one zone can be asked to hold")
    check(int(sizes[0]) != 10, "configured max is not silently 10")
else:
    check(False, "configured max is at least the HPA max pods one zone can be asked to hold")
check(mins == ["3"], "min size per zone is 3 (ADR 0106)")
check(desired == ["3"], "create-time desired size is 3 (ADR 0106)")
if mins and sizes and mins[0].isdigit() and sizes[0].isdigit():
    check(int(mins[0]) >= 1 and int(mins[0]) < int(sizes[0]),
          "min stays at least 1 and below the max")
check(resource_max == ["local.max_size_per_zone"],
      "scaling_config max_size is the local, not a second literal")
check("length(var.subnets) >= 2" in pool_code, "node pool still refuses a single zone")
check(re.search(r'"computerpets/node-pool"\s*=\s*"api"', pool_code) is not None,
      "pool label stays computerpets/node-pool=api")
check(re.search(r'effect\s*=\s*"NO_SCHEDULE"', pool_code) is not None,
      "pool taint stays NoSchedule")
check("k8s.io/cluster-autoscaler/enabled" in pool_code, "enabled discovery tag stays")
check('"owned"' in pool_code, "cluster discovery tag value stays owned")

def list_body(name, text):
    match = re.search(rf"{name}\s*=\s*\[(.*?)\]", text, re.S)
    return match.group(1) if match else ""

describe = list_body("describe_actions", ca_code)
denied = list_body("denied_actions", ca_code)
check("autoscaling:DescribeAutoScalingGroups" in describe,
      "DescribeAutoScalingGroups stays on the describe list")
check("eks:DescribeNodegroup" in describe, "DescribeNodegroup stays on the describe list")
check("eks:UpdateNodegroupConfig" in denied, "UpdateNodegroupConfig stays denied")
check("autoscaling:UpdateAutoScalingGroup" in denied, "ASG max updates stay denied")
check("autoscaling:SetDesiredCapacity" in list_body("scale_actions", ca_code),
      "the leader can still set desired capacity")

try:
    import yaml
except ImportError:
    check(False, "PyYAML is installed")
    sys.exit(1)

docs = [doc for doc in yaml.safe_load_all(manifest) if doc]
deps = [doc for doc in docs if doc.get("kind") == "Deployment"]
check(len(deps) == 1, "one Cluster Autoscaler Deployment")
dep = deps[0] if deps else {}
pod = (((dep.get("spec") or {}).get("template") or {}).get("spec") or {})
containers = pod.get("containers") or []
command = list((containers[0].get("command") if containers else None) or [])

def count(arg):
    return sum(1 for item in command if item == arg)

def present(name):
    return any(item == name or item.startswith(name + "=") for item in command)

check(count("--balance-similar-node-groups=true") == 1, "similar node groups stay balanced")
check(count("--expander=least-waste") == 1, "expander stays least-waste")
check(count("--skip-nodes-with-system-pods=false") == 1, "system pods do not pin scale-down")
check(count("--salvo-scale-up=true") == 1, "salvo stays on")
check(count("--salvo-scale-up-budget=1m") == 1, "salvo budget stays 1m")
check(count("--frequent-loops-enabled=true") == 1, "frequent loops stay on")
for flag, name in (
    ("--max-nodes-total", "no cluster-wide node cap under the per-zone max"),
    ("--cores-total", "no cluster-wide core cap under the per-zone max"),
    ("--memory-total", "no cluster-wide memory cap under the per-zone max"),
):
    check(not present(flag), name)

constraints = pod.get("topologySpreadConstraints") or []
check(len(constraints) == 1 and "minDomains" not in constraints[0], "minDomains stays unset")
if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
