#!/usr/bin/env bash
# ADR 0095 — hard zone spread for the API colors.
# No cluster. Does not kubectl apply. No terraform apply.
# Hostname is DoNotSchedule (ADR 0100). Zone is DoNotSchedule, maxSkew 1,
# nodeAffinityPolicy Honor, nodeTaintsPolicy Honor. No minDomains.
# One labeled zone still schedules. A node that omits the zone label
# does not. HPA, PDB, the pool selector, and the taint toleration stay.
# Cluster Autoscaler zone spread is DoNotSchedule (ADR 0099). Required
# zone anti-affinity is not set. metrics-server zone spread is
# DoNotSchedule (ADR 0098).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
POSTGRES="${ROOT}/deploy/k8s/postgres.yaml"
REDIS="${ROOT}/deploy/k8s/redis.yaml"
HPA="${ROOT}/deploy/k8s/hpa.yaml"
PDB="${ROOT}/deploy/k8s/pdb.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0095-api-zone-hard-spread.md"
POOL="${ROOT}/deploy/terraform/modules/node_pool/main.tf"
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

echo "== API zone hard spread files =="
need_file "$KUSTOM"
need_file "$BLUE"
need_file "$GREEN"
need_file "$POSTGRES"
need_file "$REDIS"
need_file "$HPA"
need_file "$PDB"
need_file "$README"
need_file "$ADR"
need_file "$POOL"
need_file "$CA"
need_file "$METRICS"

echo "== budgets, pin, and neighbors stay =="
need_grep "$HPA" 'minReplicas: 3' "HPA floor stays 3"
need_grep "$HPA" 'maxReplicas: 3' "HPA ceiling stays 3 (ADR 0108)"
need_grep "$PDB" 'minAvailable: 2' "API disruption budget stays 2"
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
need_grep "$BLUE" 'computerpets/node-pool: api$' "blue still selects the api pool"
need_grep "$GREEN" 'computerpets/node-pool: api$' "green still selects the api pool"
need_grep "$BLUE" 'effect: NoSchedule' "blue still tolerates the pool taint"
need_grep "$GREEN" 'effect: NoSchedule' "green still tolerates the pool taint"
need_grep "$POOL" 'min-availability-zones=2' "node pool still refuses a single zone"
need_not_grep "$POSTGRES" 'topology.kubernetes.io/zone' "postgres scaffolding is not zone-spread"
need_not_grep "$REDIS" 'topology.kubernetes.io/zone' "redis scaffolding is not zone-spread"
need_not_grep "$POSTGRES" 'tolerations:' "postgres still has no tolerations"
need_not_grep "$REDIS" 'tolerations:' "redis still has no tolerations"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*hpa\.yaml[[:space:]]*$' "kustomization still omits hpa.yaml"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*pdb\.yaml[[:space:]]*$' "kustomization still omits pdb.yaml"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization still omits cluster-autoscaler"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization still omits metrics-server"
need_grep "$KUSTOM" 'ADR 0095' "kustomize comment names the hard zone spread"
need_grep "$KUSTOM" 'One labeled zone still schedules' "kustomize comment is honest about one zone"
need_grep "$KUSTOM" 'Do not set minDomains' "kustomize comment refuses minDomains"

echo "== scaler zone spread is ADR 0099; metrics-server zone spread is ADR 0098 =="
need_grep "$CA" 'whenUnsatisfiable: DoNotSchedule' "cluster-autoscaler zone spread is DoNotSchedule (ADR 0099)"
need_grep "$CA" 'topologyKey: topology.kubernetes.io/zone' "cluster-autoscaler still names the zone key"
need_grep "$CA" 'topologySpreadConstraints:' "cluster-autoscaler zone rule is a spread constraint"
need_not_grep "$CA" 'preferredDuringSchedulingIgnoredDuringExecution' "cluster-autoscaler has no preferred zone term"
need_grep "$METRICS" 'whenUnsatisfiable: DoNotSchedule' "metrics-server zone spread is DoNotSchedule (ADR 0098)"
need_not_grep "$METRICS" 'whenUnsatisfiable: ScheduleAnyway' "metrics-server zone spread is not ScheduleAnyway"
need_not_grep "$METRICS" 'minDomains:' "metrics-server zone spread has no minDomains"

echo "== docs =="
need_grep "$README" 'ADR 0095' "README names ADR 0095"
need_grep "$README" 'DoNotSchedule' "README names the hard zone action"
need_grep "$README" 'One labeled zone still schedules' "README is honest about one zone"
need_grep "$README" 'Kind and minikube' "README names kind and minikube"
need_grep "$README" 'aws-node' "README names aws-node"
need_grep "$README" 'kube-proxy' "README names kube-proxy"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'One labeled zone still schedules' "ADR is honest about one zone"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'nodeAffinityPolicy: Honor' "ADR names Honor"
need_grep "$ADR" 'maxSkew: 1' "ADR names maxSkew 1"
need_grep "$ADR" 'ScheduleAnyway' "zone ADR still records the old hostname preference"
need_grep "$ROOT/docs/adr/0100-api-hostname-hard-spread.md" 'DoNotSchedule' "hostname hard spread is ADR 0100"
need_grep "$ADR" 'aws-node' "ADR names aws-node"
need_grep "$ADR" 'kube-proxy' "ADR names kube-proxy"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'Required zone anti-affinity is not the follow-up' "ADR does not require the scaler zone rule"

python3 - "$BLUE" "$GREEN" "$CA" "$METRICS" <<'PY'
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
actions = {
    "kubernetes.io/hostname": "DoNotSchedule",
    "topology.kubernetes.io/zone": "DoNotSchedule",
}
keys = ["kubernetes.io/hostname", "topology.kubernetes.io/zone"]

for path, color, replicas in (
    (sys.argv[1], "blue", 2),
    (sys.argv[2], "green", 0),
):
    doc = yaml.safe_load(pathlib.Path(path).read_text())
    spec = doc.get("spec") or {}
    check(spec.get("replicas") == replicas, f"parsed {color} replicas is {replicas}")
    pod = ((spec.get("template") or {}).get("spec") or {})
    check(pod.get("nodeSelector") == want_sel,
          f"parsed {color} nodeSelector is linux plus the api pool label")
    tols = pod.get("tolerations") or []
    pool_tols = [item for item in tols if isinstance(item, dict)
                 and item.get("key") == "computerpets/node-pool"]
    check(pool_tols == [want_tol],
          f"parsed {color} tolerates only computerpets/node-pool=api:NoSchedule")
    constraints = pod.get("topologySpreadConstraints") or []
    check(len(constraints) == 2, f"parsed {color} has two spread constraints")
    got_keys = [item.get("topologyKey") for item in constraints]
    check(got_keys == keys, f"parsed {color} spread keys stay hostname then zone")
    for item in constraints:
        key = item.get("topologyKey")
        check(item.get("maxSkew") == 1, f"parsed {color} {key} maxSkew is 1")
        check(item.get("whenUnsatisfiable") == actions.get(key),
              f"parsed {color} {key} whenUnsatisfiable is {actions.get(key)}")
        check(item.get("nodeTaintsPolicy") == "Honor",
              f"parsed {color} {key} nodeTaintsPolicy is Honor")
        check(item.get("nodeAffinityPolicy") == "Honor",
              f"parsed {color} {key} nodeAffinityPolicy is Honor")
        check("minDomains" not in item, f"parsed {color} {key} has no minDomains")
        check("matchLabelKeys" not in item, f"parsed {color} {key} has no matchLabelKeys")
        labels = ((item.get("labelSelector") or {}).get("matchLabels") or {})
        check(labels.get("app") == "computerpets" and labels.get("color") == color,
              f"parsed {color} {key} selector stays color={color}")

docs = list(yaml.safe_load_all(pathlib.Path(sys.argv[3]).read_text()))
ca = next(doc for doc in docs if isinstance(doc, dict)
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
    check(item.get("maxSkew") == 1, "parsed cluster-autoscaler maxSkew is 1")
    check("minDomains" not in item, "parsed cluster-autoscaler has no minDomains")
affinity = ((ca_pod.get("affinity") or {}).get("podAntiAffinity") or {})
required = affinity.get("requiredDuringSchedulingIgnoredDuringExecution") or []
preferred = affinity.get("preferredDuringSchedulingIgnoredDuringExecution") or []
req_keys = [item.get("topologyKey") for item in required if isinstance(item, dict)]
check(req_keys == ["kubernetes.io/hostname"],
      "parsed cluster-autoscaler required anti-affinity is hostname only")
check("topology.kubernetes.io/zone" not in req_keys,
      "parsed cluster-autoscaler zone anti-affinity is not required")
check(preferred == [],
      "parsed cluster-autoscaler has no preferred zone anti-affinity")

ms_docs = list(yaml.safe_load_all(pathlib.Path(sys.argv[4]).read_text()))
ms = next(doc for doc in ms_docs if isinstance(doc, dict)
          and doc.get("kind") == "Deployment"
          and (doc.get("metadata") or {}).get("name") == "metrics-server")
ms_pod = ((ms.get("spec") or {}).get("template") or {}).get("spec") or {}
ms_constraints = ms_pod.get("topologySpreadConstraints") or []
check(len(ms_constraints) == 1, "parsed metrics-server has one spread constraint")
if ms_constraints:
    item = ms_constraints[0]
    check(item.get("topologyKey") == "topology.kubernetes.io/zone",
          "parsed metrics-server spread key stays the zone")
    check(item.get("whenUnsatisfiable") == "DoNotSchedule",
          "parsed metrics-server zone spread is DoNotSchedule (ADR 0098)")
    check(item.get("maxSkew") == 1, "parsed metrics-server maxSkew stays 1")
    check("minDomains" not in item, "parsed metrics-server has no minDomains")

if failed:
    sys.exit(1)
PY

if command -v kubectl >/dev/null 2>&1; then
  kust_out="$(mktemp)"
  if kubectl kustomize "${ROOT}/deploy/k8s" >"${kust_out}" 2>/tmp/cp-zone-hard-kust.err; then
    zone_n="$(grep -c 'topologyKey: topology.kubernetes.io/zone' "${kust_out}" || true)"
    host_n="$(grep -c 'topologyKey: kubernetes.io/hostname' "${kust_out}" || true)"
    soft_n="$(grep -c 'whenUnsatisfiable: ScheduleAnyway' "${kust_out}" || true)"
    hard_n="$(grep -c 'whenUnsatisfiable: DoNotSchedule' "${kust_out}" || true)"
    if [ "${zone_n}" = "2" ] && [ "${host_n}" = "2" ] && [ "${soft_n}" = "0" ] && [ "${hard_n}" = "4" ]; then
      ok "kustomize output keeps hard zone spread beside hard hostname"
    else
      bad "kustomize output keeps hard zone spread beside hard hostname (zone=${zone_n} host=${host_n} soft=${soft_n} hard=${hard_n})"
    fi
  else
    bad "kubectl kustomize deploy/k8s failed"
    cat /tmp/cp-zone-hard-kust.err || true
  fi
  rm -f "${kust_out}" /tmp/cp-zone-hard-kust.err
else
  ok "kubectl not installed; skipped kustomize"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
