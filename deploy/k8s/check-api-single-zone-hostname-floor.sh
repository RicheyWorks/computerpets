#!/usr/bin/env bash
# ADR 0106 — three hostnames in the one Ready API zone.
# min_size and create-time desired_size are 3. One Ready zone is three
# hostnames, so minReplicas 3 is 1 and 1 and 1 under hostname maxSkew 1.
# The zone gate stays two. The ADR 0105 floor of 2 is refused.
# HPA min stays 3 because the PDB keeps 2.
# No minDomains. No required hostname anti-affinity. No required zone anti-affinity.
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
ADR="${ROOT}/docs/adr/0106-api-single-zone-hostname-floor.md"
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

echo "== single-zone API hostname floor files =="
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
need_grep "$ADR" 'single-zone-hostname-floor=3' "ADR names three hostnames in one Ready zone"
need_grep "$ADR" 'hostname-floor-nodes=6' "ADR names six healthy-zone hostnames"
need_grep "$ADR" 'minReplicas' "ADR names the HPA floor"
need_grep "$ADR" 'minAvailable' "ADR names the disruption budget"
need_grep "$ADR" 'still 2' "ADR names a group whose desired size is still 2"
need_grep "$ADR" 'still 1' "ADR names a group whose desired size is still 1"
need_grep "$ADR" 'ignore_changes' "ADR names the desired_size ignore"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'Required hostname anti-affinity is not set' "ADR does not require hostname anti-affinity"
need_grep "$ADR" 'Required zone anti-affinity is not the follow-up' "ADR does not require zone anti-affinity"
need_grep "$ADR" 'One hostname still schedules' "ADR is honest about one hostname"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'third AZ' "ADR refuses a third AZ as a substitute for this floor"
need_grep "$POOL" 'min-size-per-zone=3' "node pool names the house floor"
need_grep "$POOL" 'single-zone-hostname-floor=3' "node pool names the one-zone hostname floor"
need_grep "$POOL" 'hostname-floor-nodes=6' "node pool names six hostnames"
need_grep "$POOL" 'hpa-min-replicas=3' "node pool names the HPA floor"
need_grep "$POOL" 'pdb-min-available=2' "node pool names the PDB"
need_grep "$POOL" 'surviving-zones=1' "node pool names the one Ready zone"
need_grep "$POOL" 'min_size_per_zone[[:space:]]*=[[:space:]]*3' "min size per zone is 3"
need_grep "$POOL" 'desired_size_per_zone[[:space:]]*=[[:space:]]*3' "create-time desired size is 3"
need_grep "$HPA" 'minReplicas: 3' "HPA floor stays 3"
need_grep "$HPA" 'maxReplicas: 3' "HPA ceiling stays 3 (ADR 0108)"
need_grep "$PDB" 'minAvailable: 2' "API disruption budget stays 2"
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
need_grep "$KUSTOM" 'ADR 0106' "kustomize comment names the single-zone floor"
need_grep "$KUSTOM" 'One hostname here still schedules' "kustomize comment is honest about one hostname"
need_grep "$README" 'ADR 0106' "README names ADR 0106"
need_grep "$CA" 'ADR 0106' "manifest names ADR 0106"
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
# One Ready zone. Not the healthy-zone product, and not a third AZ.
SURVIVING_ZONES = 1
HOUSE_MIN = 3
HOUSE_ZONES = 2
HOUSE_HPA_MIN = 3
HOUSE_PDB = 2
HOUSE_SKEW = 1
OLD_FLOOR = 2

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

def code_only(text):
    return "\n".join(line.split("#", 1)[0] for line in text.splitlines())

def stacks(pods, hostnames, max_skew):
    """True when some feasible placement puts two pods on one hostname.

    maxSkew 1 refuses a second pod on a hostname while any eligible
    hostname is still empty (skew would be 2). Stacking is feasible
    only after every hostname already holds one, which needs more pods
    than hostnames. maxSkew of 2 or more allows that second pod immediately.
    """
    if hostnames < 1 or pods < 1 or max_skew < 1:
        return True
    if max_skew >= 2:
        return pods >= 2
    return pods > hostnames

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
check(hpa_max == 3, "HPA ceiling stays 3 (ADR 0108)")
check(pdb_min == HOUSE_PDB, "PDB minAvailable stays 2")
if hpa_min is not None and pdb_min is not None:
    check(hpa_min >= pdb_min + 1,
          "HPA floor keeps one spare pod above the disruption budget")
else:
    check(False, "HPA floor keeps one spare pod above the disruption budget")
check(mins == [str(HOUSE_MIN)], "configured min is 3, not the 0105 floor of 2")
check(desired == [str(HOUSE_MIN)], "create-time desired size is the floor, not 2")
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
check(zone_gate == [str(HOUSE_ZONES)], "node pool still refuses a single zone and does not require a third")
check(root_gate == [str(HOUSE_ZONES)], "root gate still refuses a single zone and does not require a third")

keys = ["kubernetes.io/hostname", "topology.kubernetes.io/zone"]
hostname_skew = None
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
        check(item.get("maxSkew") == HOUSE_SKEW, f"parsed {color} {key} maxSkew is 1")
        check(item.get("whenUnsatisfiable") == "DoNotSchedule",
              f"parsed {color} {key} stays DoNotSchedule")
        check("minDomains" not in item, f"parsed {color} {key} has no minDomains")
        if color == "blue" and key == "kubernetes.io/hostname":
            hostname_skew = item.get("maxSkew")

if mins and hpa_min is not None and mins[0].isdigit() and isinstance(hostname_skew, int):
    per_zone = int(mins[0])
    surviving = SURVIVING_ZONES * per_zone
    check(surviving >= hpa_min,
          "one Ready zone has a hostname per HPA-floor pod")
    check(not stacks(hpa_min, surviving, hostname_skew),
          "one Ready zone does not stack two HPA-floor pods on one hostname")
    check(stacks(hpa_min, OLD_FLOOR, hostname_skew),
          "the floor of 2 still stacks the HPA floor as 2 and 1")
    check(per_zone == hpa_min,
          "the per-zone floor is the HPA min, not a larger bill")
else:
    check(False, "one Ready zone has a hostname per HPA-floor pod")
    check(False, "one Ready zone does not stack two HPA-floor pods on one hostname")
    check(False, "the floor of 2 still stacks the HPA floor as 2 and 1")
    check(False, "the per-zone floor is the HPA min, not a larger bill")

if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
