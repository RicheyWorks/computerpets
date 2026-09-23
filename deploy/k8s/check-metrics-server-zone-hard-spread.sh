#!/usr/bin/env bash
# ADR 0098 — hard zone spread for metrics-server.
# No cluster. Does not kubectl apply. No terraform apply.
# Zone is DoNotSchedule, maxSkew 1, nodeAffinityPolicy Honor,
# nodeTaintsPolicy Honor. No minDomains. Replicas stay 2.
# Required hostname anti-affinity stays. There is no required zone
# anti-affinity. One labeled zone still schedules. A node that omits
# the zone label does not. Kind and minikube do not apply this file.
# The pool selector and the taint toleration stay. Cluster Autoscaler
# zone spread is DoNotSchedule (ADR 0099). Required zone anti-affinity
# is not set.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0098-metrics-server-zone-hard-spread.md"
CA="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
METRICS="${ROOT}/deploy/k8s/metrics-server.yaml"
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
  if grep -qE "$pattern" "$file"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file"))"; fi
}

need_not_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE "$pattern" "$file"; then bad "$name"
  else ok "$name"; fi
}

echo "== metrics-server zone hard spread files =="
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"
need_file "$CA"
need_file "$METRICS"

echo "== neighbors stay =="
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization still omits metrics-server"
need_grep "$KUSTOM" 'ADR 0098' "kustomize comment names the hard zone spread"
need_grep "$KUSTOM" 'One labeled zone still schedules' "kustomize comment is honest about one zone"
need_grep "$KUSTOM" 'Do not set minDomains' "kustomize comment refuses minDomains"
need_grep "$CA" 'whenUnsatisfiable: DoNotSchedule' "cluster-autoscaler zone spread is DoNotSchedule (ADR 0099)"
need_grep "$CA" 'topologyKey: topology.kubernetes.io/zone' "cluster-autoscaler still names the zone key"
need_grep "$CA" 'topologySpreadConstraints:' "cluster-autoscaler zone rule is a spread constraint"
need_not_grep "$CA" 'preferredDuringSchedulingIgnoredDuringExecution' "cluster-autoscaler has no preferred zone term"

echo "== docs =="
need_grep "$README" 'ADR 0098' "README names ADR 0098"
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
need_grep "$ADR" 'Required zone anti-affinity is not the follow-up' "ADR does not require the scaler zone rule"
need_grep "$ADR" 'computerpets/node-pool' "ADR keeps the pool pin"

python3 - "$METRICS" "$CA" <<'PY'
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

docs = list(yaml.safe_load_all(pathlib.Path(sys.argv[1]).read_text()))
ms = next(doc for doc in docs if isinstance(doc, dict)
          and doc.get("kind") == "Deployment"
          and (doc.get("metadata") or {}).get("name") == "metrics-server")
spec = ms.get("spec") or {}
check(spec.get("replicas") == 2, "parsed metrics-server replicas is 2")
pod = ((spec.get("template") or {}).get("spec") or {})
check(pod.get("nodeSelector") == want_sel,
      "parsed metrics-server nodeSelector is linux plus the api pool label")
tols = pod.get("tolerations") or []
pool_tols = [item for item in tols if isinstance(item, dict)
             and item.get("key") == "computerpets/node-pool"]
check(pool_tols == [want_tol],
      "parsed metrics-server tolerates only computerpets/node-pool=api:NoSchedule")
constraints = pod.get("topologySpreadConstraints") or []
check(len(constraints) == 1, "parsed metrics-server has one spread constraint")
if constraints:
    item = constraints[0]
    check(item.get("topologyKey") == "topology.kubernetes.io/zone",
          "parsed metrics-server spread key is the zone")
    check(item.get("whenUnsatisfiable") == "DoNotSchedule",
          "parsed metrics-server zone spread is DoNotSchedule")
    check(item.get("maxSkew") == 1, "parsed metrics-server maxSkew is 1")
    check(item.get("nodeTaintsPolicy") == "Honor",
          "parsed metrics-server nodeTaintsPolicy is Honor")
    check(item.get("nodeAffinityPolicy") == "Honor",
          "parsed metrics-server nodeAffinityPolicy is Honor")
    check("minDomains" not in item, "parsed metrics-server has no minDomains")
    check("matchLabelKeys" not in item, "parsed metrics-server has no matchLabelKeys")
    labels = ((item.get("labelSelector") or {}).get("matchLabels") or {})
    check(labels.get("k8s-app") == "metrics-server",
          "parsed metrics-server selector stays k8s-app=metrics-server")
affinity = ((pod.get("affinity") or {}).get("podAntiAffinity") or {})
required = affinity.get("requiredDuringSchedulingIgnoredDuringExecution") or []
preferred = affinity.get("preferredDuringSchedulingIgnoredDuringExecution") or []
req_keys = [item.get("topologyKey") for item in required if isinstance(item, dict)]
check(req_keys == ["kubernetes.io/hostname"],
      "parsed metrics-server required anti-affinity is hostname only")
check("topology.kubernetes.io/zone" not in req_keys,
      "parsed metrics-server zone anti-affinity is not required")
check(preferred == [], "parsed metrics-server has no preferred anti-affinity")

ca_docs = list(yaml.safe_load_all(pathlib.Path(sys.argv[2]).read_text()))
ca = next(doc for doc in ca_docs if isinstance(doc, dict)
          and doc.get("kind") == "Deployment"
          and (doc.get("metadata") or {}).get("name") == "cluster-autoscaler")
ca_pod = ((ca.get("spec") or {}).get("template") or {}).get("spec") or {}
ca_constraints = ca_pod.get("topologySpreadConstraints") or []
check(len(ca_constraints) == 1, "parsed cluster-autoscaler has one zone spread constraint")
if ca_constraints:
    item = ca_constraints[0]
    check(item.get("topologyKey") == "topology.kubernetes.io/zone",
          "parsed cluster-autoscaler spread key is the zone")
    check(item.get("whenUnsatisfiable") == "DoNotSchedule",
          "parsed cluster-autoscaler zone spread is DoNotSchedule (ADR 0099)")
    check("minDomains" not in item, "parsed cluster-autoscaler has no minDomains")
ca_affinity = ((ca_pod.get("affinity") or {}).get("podAntiAffinity") or {})
ca_required = ca_affinity.get("requiredDuringSchedulingIgnoredDuringExecution") or []
ca_preferred = ca_affinity.get("preferredDuringSchedulingIgnoredDuringExecution") or []
ca_req_keys = [item.get("topologyKey") for item in ca_required if isinstance(item, dict)]
check(ca_req_keys == ["kubernetes.io/hostname"],
      "parsed cluster-autoscaler required anti-affinity is hostname only")
check("topology.kubernetes.io/zone" not in ca_req_keys,
      "parsed cluster-autoscaler zone anti-affinity is not required")
check(ca_preferred == [],
      "parsed cluster-autoscaler has no preferred zone anti-affinity")

if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
