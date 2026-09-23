#!/usr/bin/env bash
# ADR 0099 — hard zone spread for Cluster Autoscaler.
# No cluster. Does not kubectl apply. No terraform apply.
# Zone is DoNotSchedule, maxSkew 1, nodeAffinityPolicy Honor,
# nodeTaintsPolicy Honor. No minDomains. No preferred zone term.
# Replicas stay 2. Required hostname anti-affinity stays. There is no
# required zone anti-affinity. One labeled zone still schedules. A node
# that omits the zone label does not. Kind and minikube do not apply
# this file. The pool selector, the taint toleration, leader election,
# and minAvailable 1 stay.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0099-cluster-autoscaler-zone-hard-spread.md"
CA="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
METRICS="${ROOT}/deploy/k8s/metrics-server.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
PASS=0
FAIL=0

ok() { PASS=$((PASS + 1)); echo "ok - $*"; }
bad() { FAIL=$((FAIL + 1)); echo "not ok - $*"; }

need_file() {
  if [ -f "$1" ]; then ok "file $(basename "$1")"
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

need_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE -- "$pattern"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file") body)"; fi
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

echo "== cluster-autoscaler zone hard spread files =="
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"
need_file "$CA"
need_file "$METRICS"
need_file "$BLUE"
need_file "$GREEN"

echo "== neighbors stay =="
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization still omits cluster-autoscaler"
need_grep "$KUSTOM" 'ADR 0099' "kustomize comment names the hard zone spread"
need_grep "$KUSTOM" 'One labeled zone still schedules' "kustomize comment is honest about one zone"
need_grep "$KUSTOM" 'Do not set minDomains' "kustomize comment refuses minDomains"
need_grep "$BLUE" 'whenUnsatisfiable: DoNotSchedule' "API blue zone spread stays DoNotSchedule (ADR 0095)"
need_grep "$GREEN" 'whenUnsatisfiable: DoNotSchedule' "API green zone spread stays DoNotSchedule (ADR 0095)"
need_grep "$METRICS" 'whenUnsatisfiable: DoNotSchedule' "metrics-server zone spread stays DoNotSchedule (ADR 0098)"
need_not_grep_body "$CA" 'preferredDuringSchedulingIgnoredDuringExecution:' "cluster-autoscaler has no preferred zone term"
need_not_grep_body "$CA" 'minDomains:' "cluster-autoscaler zone spread has no minDomains"
need_not_grep_body "$CA" 'whenUnsatisfiable: ScheduleAnyway$' "cluster-autoscaler zone spread is not ScheduleAnyway"
need_grep_body "$CA" '^  replicas: 2$' "Deployment replicas is 2"
need_grep_body "$CA" '--leader-elect=true' "leader election stays on"
need_not_grep_body "$CA" '--leader-elect=false' "leader election is not turned off"
need_grep_body "$CA" '^  minAvailable: 1$' "budget minAvailable stays 1"
need_not_grep_body "$CA" 'minAvailable: 2' "minAvailable 2 is not set"

echo "== docs =="
need_grep "$README" 'ADR 0099' "README names ADR 0099"
need_grep "$README" 'DoNotSchedule' "README names the hard zone action"
need_grep "$README" 'One labeled zone still schedules' "README is honest about one zone"
need_grep "$README" 'Kind and minikube' "README names kind and minikube"
need_grep "$README" 'Do not set minDomains' "README refuses minDomains"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'One labeled zone still schedules' "ADR is honest about one zone"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'nodeAffinityPolicy: Honor' "ADR names Honor"
need_grep "$ADR" 'maxSkew: 1' "ADR names maxSkew 1"
need_grep "$ADR" 'replicas: 2' "ADR keeps two replicas"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'not in the kustomization' "ADR keeps the file out of kustomize"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'Required zone anti-affinity is not set' "ADR does not require zone anti-affinity"
need_grep "$ADR" 'computerpets/node-pool' "ADR keeps the pool pin"
need_grep "$ADR" 'minAvailable: 1' "ADR keeps the disruption budget"
need_grep "$ADR" '--leader-elect=true' "ADR keeps leader election"

python3 - "$CA" "$METRICS" "$BLUE" "$GREEN" <<'PY'
import pathlib, sys
import yaml

failed = False

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

want_sel = {
    "kubernetes.io/os": "linux",
    "computerpets/node-pool": "api",
}
want_tol = {
    "key": "computerpets/node-pool",
    "operator": "Equal",
    "value": "api",
    "effect": "NoSchedule",
}

def zone_item(pod):
    constraints = pod.get("topologySpreadConstraints") or []
    zones = [item for item in constraints if isinstance(item, dict)
             and item.get("topologyKey") == "topology.kubernetes.io/zone"]
    return constraints, zones

docs = list(yaml.safe_load_all(pathlib.Path(sys.argv[1]).read_text()))
ca = next(doc for doc in docs if isinstance(doc, dict)
          and doc.get("kind") == "Deployment"
          and (doc.get("metadata") or {}).get("name") == "cluster-autoscaler")
spec = ca.get("spec") or {}
check(spec.get("replicas") == 2, "parsed cluster-autoscaler replicas is 2")
pod = ((spec.get("template") or {}).get("spec") or {})
check(pod.get("nodeSelector") == want_sel,
      "parsed cluster-autoscaler nodeSelector is linux plus the api pool label")
tols = pod.get("tolerations") or []
pool_tols = [item for item in tols if isinstance(item, dict)
             and item.get("key") == "computerpets/node-pool"]
check(pool_tols == [want_tol],
      "parsed cluster-autoscaler tolerates only computerpets/node-pool=api:NoSchedule")
constraints, zones = zone_item(pod)
check(len(constraints) == 1, "parsed cluster-autoscaler has one spread constraint")
check(len(zones) == 1, "parsed cluster-autoscaler has one zone spread item")
if zones:
    item = zones[0]
    check(item.get("whenUnsatisfiable") == "DoNotSchedule",
          "parsed cluster-autoscaler zone spread is DoNotSchedule")
    check(item.get("maxSkew") == 1, "parsed cluster-autoscaler maxSkew is 1")
    check(item.get("nodeTaintsPolicy") == "Honor",
          "parsed cluster-autoscaler nodeTaintsPolicy is Honor")
    check(item.get("nodeAffinityPolicy") == "Honor",
          "parsed cluster-autoscaler nodeAffinityPolicy is Honor")
    check("minDomains" not in item, "parsed cluster-autoscaler has no minDomains")
    check("matchLabelKeys" not in item, "parsed cluster-autoscaler has no matchLabelKeys")
    labels = ((item.get("labelSelector") or {}).get("matchLabels") or {})
    check(labels == {"app": "cluster-autoscaler"},
          "parsed cluster-autoscaler selector stays app=cluster-autoscaler")
affinity = ((pod.get("affinity") or {}).get("podAntiAffinity") or {})
required = affinity.get("requiredDuringSchedulingIgnoredDuringExecution") or []
preferred = affinity.get("preferredDuringSchedulingIgnoredDuringExecution") or []
req_keys = [item.get("topologyKey") for item in required if isinstance(item, dict)]
check(req_keys == ["kubernetes.io/hostname"],
      "parsed cluster-autoscaler required anti-affinity is hostname only")
check("topology.kubernetes.io/zone" not in req_keys,
      "parsed cluster-autoscaler zone anti-affinity is not required")
check(preferred == [], "parsed cluster-autoscaler has no preferred anti-affinity")
containers = pod.get("containers") or []
command = (containers[0].get("command") if containers else []) or []
check("--leader-elect=true" in command, "command turns leader election on")
check("--leader-elect=false" not in command, "command does not turn leader election off")
pdbs = [doc for doc in docs if isinstance(doc, dict)
        and doc.get("kind") == "PodDisruptionBudget"]
check(len(pdbs) == 1, "one cluster-autoscaler PodDisruptionBudget")
if pdbs:
    check((pdbs[0].get("spec") or {}).get("minAvailable") == 1,
          "parsed cluster-autoscaler minAvailable is 1")

def neighbor_zone(path, name):
    loaded = list(yaml.safe_load_all(pathlib.Path(path).read_text()))
    dep = next(doc for doc in loaded if isinstance(doc, dict)
               and doc.get("kind") == "Deployment")
    npod = ((dep.get("spec") or {}).get("template") or {}).get("spec") or {}
    _all, nzones = zone_item(npod)
    check(len(nzones) == 1, f"parsed {name} has one zone spread item")
    if nzones:
        check(nzones[0].get("whenUnsatisfiable") == "DoNotSchedule",
              f"parsed {name} zone spread stays DoNotSchedule")
        check("minDomains" not in nzones[0], f"parsed {name} zone spread has no minDomains")

neighbor_zone(sys.argv[2], "metrics-server")
neighbor_zone(sys.argv[3], "blue")
neighbor_zone(sys.argv[4], "green")

if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
