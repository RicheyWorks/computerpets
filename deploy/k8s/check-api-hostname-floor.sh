#!/usr/bin/env bash
# ADR 0105 — two hostnames per API zone for the HPA floor.
# min_size and create-time desired_size are 2. Two healthy zones are
# four hostnames, so minReplicas 3 does not land 2 and 1.
# HPA min stays 3 because the PDB keeps 2. The old floor of 1 is refused.
# No minDomains. No required hostname anti-affinity.
# No cluster. Does not kubectl apply. No terraform apply.
# Kind and minikube do not plan the pool. One hostname still schedules.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
POOL="${ROOT}/deploy/terraform/modules/node_pool/main.tf"
ROOT_MAIN="${ROOT}/deploy/terraform/main.tf"
VARS="${ROOT}/deploy/terraform/variables.tf"
HPA="${ROOT}/deploy/k8s/hpa.yaml"
PDB="${ROOT}/deploy/k8s/pdb.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
CA="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0105-api-hostname-floor.md"
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

echo "== API hostname floor files =="
need_file "$POOL"
need_file "$ROOT_MAIN"
need_file "$VARS"
need_file "$HPA"
need_file "$PDB"
need_file "$BLUE"
need_file "$GREEN"
need_file "$KUSTOM"
need_file "$CA"
need_file "$README"
need_file "$ADR"

echo "== docs and pins =="
need_grep "$ADR" 'min_size_per_zone' "ADR names the per-zone floor"
need_grep "$ADR" 'hostname-floor-nodes=4' "ADR names four healthy-zone hostnames"
need_grep "$ADR" 'minReplicas' "ADR names the HPA floor"
need_grep "$ADR" 'minAvailable' "ADR names the disruption budget"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'Required hostname anti-affinity is not set' "ADR does not require hostname anti-affinity"
need_grep "$ADR" 'Required zone anti-affinity is not the follow-up' "ADR does not require zone anti-affinity"
need_grep "$ADR" 'One hostname still schedules' "ADR is honest about one hostname"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'one unhealthy zone' "ADR names the single-zone remainder"
need_grep "$POOL" 'min-size-per-zone=2' "node pool names the house floor"
need_grep "$POOL" 'hostname-floor-nodes=4' "node pool names four hostnames"
need_grep "$POOL" 'hpa-min-replicas=3' "node pool names the HPA floor"
need_grep "$POOL" 'pdb-min-available=2' "node pool names the PDB"
need_grep "$POOL" 'min_size_per_zone[[:space:]]*=[[:space:]]*2' "min size per zone is 2"
need_grep "$POOL" 'desired_size_per_zone[[:space:]]*=[[:space:]]*2' "create-time desired size is 2"
need_grep "$HPA" 'minReplicas: 3' "HPA floor stays 3"
need_grep "$HPA" 'maxReplicas: 10' "HPA ceiling stays 10"
need_grep "$PDB" 'minAvailable: 2' "API disruption budget stays 2"
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
need_grep "$KUSTOM" 'ADR 0105' "kustomize comment names the hostname floor"
need_grep "$KUSTOM" 'One hostname here still schedules' "kustomize comment is honest about one hostname"
need_grep "$README" 'ADR 0105' "README names ADR 0105"
need_grep "$CA" 'ADR 0105' "manifest names ADR 0105"
need_grep "$CA" '--balance-similar-node-groups=true' "similar groups stay balanced"
need_grep "$VARS" 'variable "enable_node_pool"' "kind and minikube can leave the pool off"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*hpa\.yaml[[:space:]]*$' "kustomization still omits hpa.yaml"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*pdb\.yaml[[:space:]]*$' "kustomization still omits pdb.yaml"
need_not_grep "$POOL" 'variable "min_size_per_zone"' "node pool floor is not a module variable"
need_not_grep "$VARS" 'variable "min_size_per_zone"' "root module has no min_size_per_zone variable"
need_not_grep "$BLUE" 'requiredDuringSchedulingIgnoredDuringExecution' "blue has no required anti-affinity"
need_not_grep "$GREEN" 'requiredDuringSchedulingIgnoredDuringExecution' "green has no required anti-affinity"
need_not_grep "$BLUE" 'podAntiAffinity:' "blue does not also anti-affinity"
need_not_grep "$GREEN" 'podAntiAffinity:' "green does not also anti-affinity"

python3 - "$POOL" "$ROOT_MAIN" "$HPA" "$PDB" "$BLUE" "$GREEN" <<'PY'
import pathlib, re, sys

try:
    import yaml
except ImportError:
    print("not ok - PyYAML is installed")
    sys.exit(1)

pool = pathlib.Path(sys.argv[1]).read_text()
root = pathlib.Path(sys.argv[2]).read_text()
hpa = pathlib.Path(sys.argv[3]).read_text()
pdb = pathlib.Path(sys.argv[4]).read_text()
failed = False
HOUSE_MIN = 2
HOUSE_ZONES = 2
HOUSE_HPA_MIN = 3
HOUSE_PDB = 2

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
root_code = code_only(root)

def one_int(pattern, text, name):
    found = re.findall(pattern, text)
    check(len(found) == 1 and found[0].isdigit(), name)
    return int(found[0]) if len(found) == 1 and found[0].isdigit() else None

hpa_min = one_int(r"(?m)^[ \t]*minReplicas:[ \t]*(\d+)[ \t]*$", hpa, "HPA file has one minReplicas")
hpa_max = one_int(r"(?m)^[ \t]*maxReplicas:[ \t]*(\d+)[ \t]*$", hpa, "HPA file has one maxReplicas")
pdb_min = one_int(r"(?m)^[ \t]*minAvailable:[ \t]*(\d+)[ \t]*$", pdb, "PDB file has one minAvailable")
mins = re.findall(r"(?m)^[ \t]*min_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
desired = re.findall(r"(?m)^[ \t]*desired_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
sizes = re.findall(r"(?m)^[ \t]*max_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
resource_min = re.findall(r"(?m)^[ \t]*min_size[ \t]*=[ \t]*(\S+)[ \t]*$", pool_code)
resource_desired = re.findall(r"(?m)^[ \t]*desired_size[ \t]*=[ \t]*(\S+)[ \t]*$", pool_code)
zone_gate = re.findall(r"length\(var\.subnets\) >= (\d+)", pool_code)
root_gate = re.findall(r"length\(var\.node_pool_subnets\) >= (\d+)", root_code)

check(hpa_min == HOUSE_HPA_MIN, "HPA floor stays 3")
check(hpa_max == 10, "HPA ceiling stays 10")
check(pdb_min == HOUSE_PDB, "PDB minAvailable stays 2")
if hpa_min is not None and pdb_min is not None:
    check(hpa_min >= pdb_min + 1,
          "HPA floor keeps one spare pod above the disruption budget")
else:
    check(False, "HPA floor keeps one spare pod above the disruption budget")
check(mins == [str(HOUSE_MIN)], "configured min is 2, not the old floor of 1")
check(desired == [str(HOUSE_MIN)], "create-time desired size is the floor, not 1")
check(sizes == ["20"], "per-zone max stays 20")
if mins and desired and sizes and all(item.isdigit() for item in mins + desired + sizes):
    min_n, des_n, max_n = int(mins[0]), int(desired[0]), int(sizes[0])
    check(min_n <= des_n <= max_n, "desired size stays between min and max")
else:
    check(False, "desired size stays between min and max")
check(resource_min == ["local.min_size_per_zone"],
      "scaling_config min_size is the local, not a second literal")
check(resource_desired == ["local.desired_size_per_zone"],
      "scaling_config desired_size is the local, not a second literal")
check(zone_gate == [str(HOUSE_ZONES)], "node pool still refuses a single zone")
check(root_gate == [str(HOUSE_ZONES)], "root gate still refuses a single zone")
if mins and zone_gate and hpa_min is not None and mins[0].isdigit() and zone_gate[0].isdigit():
    zones = int(zone_gate[0])
    per_zone = int(mins[0])
    hostnames = zones * per_zone
    heavy = (hpa_min + zones - 1) // zones
    check(hostnames >= hpa_min,
          "healthy zones provide a hostname per HPA-floor pod")
    check(per_zone >= heavy,
          "each zone has a hostname per pod the heavy zone holds at the HPA floor")
else:
    check(False, "healthy zones provide a hostname per HPA-floor pod")
    check(False, "each zone has a hostname per pod the heavy zone holds at the HPA floor")

keys = ["kubernetes.io/hostname", "topology.kubernetes.io/zone"]
for path, color in ((sys.argv[5], "blue"), (sys.argv[6], "green")):
    doc = yaml.safe_load(pathlib.Path(path).read_text())
    pod = (((doc.get("spec") or {}).get("template") or {}).get("spec") or {})
    check("podAntiAffinity" not in (pod.get("affinity") or {}),
          f"parsed {color} has no pod anti-affinity")
    constraints = pod.get("topologySpreadConstraints") or []
    check(len(constraints) == 2, f"parsed {color} has two spread constraints")
    got = [item.get("topologyKey") for item in constraints]
    check(got == keys, f"parsed {color} spread keys stay hostname then zone")
    for item in constraints:
        key = item.get("topologyKey")
        check(item.get("maxSkew") == 1, f"parsed {color} {key} maxSkew is 1")
        check(item.get("whenUnsatisfiable") == "DoNotSchedule",
              f"parsed {color} {key} stays DoNotSchedule")
        check("minDomains" not in item, f"parsed {color} {key} has no minDomains")

if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
