#!/usr/bin/env bash
# ADR 0093 — pin blue and green to the multi-AZ API node pool.
# No cluster. Does not kubectl apply. No terraform apply.
# Kind and minikube apply these Deployments. Nodes that omit the pool
# label leave the API pods Pending. Do not delete the pool key for a laptop.
# Hostname spread is DoNotSchedule (ADR 0100). Zone spread is
# DoNotSchedule (ADR 0095). HPA and PDB stay put.
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
ADR="${ROOT}/docs/adr/0093-api-node-pool.md"
POOL="${ROOT}/deploy/terraform/modules/node_pool/main.tf"
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

echo "== API node pool files =="
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

echo "== required selector =="
for pair in "blue:${BLUE}" "green:${GREEN}"; do
  name="${pair%%:*}"
  file="${pair#*:}"
  need_grep "$file" 'nodeSelector:' "${name} has a nodeSelector"
  need_grep "$file" 'kubernetes.io/os: linux$' "${name} nodeSelector requires linux"
  need_grep "$file" 'computerpets/node-pool: api$' "${name} nodeSelector requires the api pool label"
  need_grep "$file" 'Do not delete the pool key' "${name} refuses dropping the pool key for laptops"
  need_grep "$file" 'ADR 0093' "${name} names ADR 0093"
  need_not_grep "$file" 'nodeAffinity:' "${name} pin is nodeSelector, not node affinity"
  need_not_grep "$file" 'preferredDuringSchedulingIgnoredDuringExecution' "${name} has no preferred node affinity"
  selector_count="$(grep -c 'nodeSelector:' "$file" || true)"
  if [ "${selector_count}" = "1" ]; then ok "${name} has one nodeSelector"
  else bad "${name} has one nodeSelector (found ${selector_count})"; fi
  pool_count="$(grep -c 'computerpets/node-pool: api$' "$file" || true)"
  if [ "${pool_count}" = "1" ]; then ok "${name} names the pool label once"
  else bad "${name} names the pool label once (found ${pool_count})"; fi
  os_count="$(grep -c 'kubernetes.io/os: linux$' "$file" || true)"
  if [ "${os_count}" = "1" ]; then ok "${name} names linux once"
  else bad "${name} names linux once (found ${os_count})"; fi
  honor_count="$(grep -c 'nodeAffinityPolicy: Honor$' "$file" || true)"
  if [ "${honor_count}" = "2" ]; then ok "${name} honors node affinity on both spread items"
  else bad "${name} honors node affinity on both spread items (found ${honor_count})"; fi
done

need_not_grep "$BLUE" 'nodeAffinityPolicy: Ignore' "blue does not ignore node affinity"
need_not_grep "$GREEN" 'nodeAffinityPolicy: Ignore' "green does not ignore node affinity"
need_grep "$BLUE" 'whenUnsatisfiable: DoNotSchedule' "blue hostname spread is DoNotSchedule"
need_grep "$GREEN" 'whenUnsatisfiable: DoNotSchedule' "green hostname spread is DoNotSchedule"
need_grep "$BLUE" 'whenUnsatisfiable: DoNotSchedule' "blue zone spread is DoNotSchedule"
need_grep "$GREEN" 'whenUnsatisfiable: DoNotSchedule' "green zone spread is DoNotSchedule"
need_grep "$BLUE" 'topologyKey: kubernetes.io/hostname' "blue keeps the hostname key"
need_grep "$GREEN" 'topologyKey: kubernetes.io/hostname' "green keeps the hostname key"
need_grep "$BLUE" 'topologyKey: topology.kubernetes.io/zone' "blue keeps the zone key"
need_grep "$GREEN" 'topologyKey: topology.kubernetes.io/zone' "green keeps the zone key"
need_grep "$BLUE" 'nodeTaintsPolicy: Honor' "blue keeps nodeTaintsPolicy Honor"
need_grep "$GREEN" 'nodeTaintsPolicy: Honor' "green keeps nodeTaintsPolicy Honor"

echo "== stays the API colors only =="
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
need_not_grep "$POSTGRES" 'nodeSelector:' "postgres scaffolding is not pinned"
need_not_grep "$REDIS" 'nodeSelector:' "redis scaffolding is not pinned"
need_not_grep "$POSTGRES" 'computerpets/node-pool' "postgres does not select the pool label"
need_not_grep "$REDIS" 'computerpets/node-pool' "redis does not select the pool label"
need_grep "$HPA" 'minReplicas: 3' "HPA floor stays 3"
need_grep "$HPA" 'maxReplicas: 3' "HPA ceiling stays 3 (ADR 0108)"
need_grep "$PDB" 'minAvailable: 2' "API disruption budget stays 2"
need_grep "$KUSTOM" 'deployment-blue.yaml' "kustomize still applies blue"
need_grep "$KUSTOM" 'deployment-green.yaml' "kustomize still applies green"
need_grep "$KUSTOM" 'ADR 0093' "kustomize comment names the API pool pin"
need_grep "$KUSTOM" 'Do not delete the pool key' "kustomize comment refuses dropping the pool key"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*hpa\.yaml[[:space:]]*$' "kustomization still omits hpa.yaml"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*pdb\.yaml[[:space:]]*$' "kustomization still omits pdb.yaml"
need_grep "$POOL" '"computerpets/node-pool"[[:space:]]*=[[:space:]]*"api"' "node pool label is computerpets/node-pool=api"

echo "== docs =="
need_grep "$README" 'ADR 0093' "README names ADR 0093"
need_grep "$README" 'computerpets/node-pool' "README names the pool label"
need_grep "$README" 'Kind and minikube' "README names kind and minikube"
need_grep "$README" 'Do not delete the pool key' "README refuses dropping the pool key"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'ScheduleAnyway' "pool ADR still records the old soft spread"
need_grep "$ADR" 'computerpets/node-pool' "ADR names the pool label"
need_grep "$ADR" 'nodeAffinityPolicy: Honor' "ADR names Honor"

python3 - "$BLUE" "$GREEN" <<'PY'
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

want = {
    "kubernetes.io/os": "linux",
    "computerpets/node-pool": "api",
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
    check(pod.get("nodeSelector") == want,
          f"parsed {color} nodeSelector is linux plus the api pool label")
    affinity = pod.get("affinity") or {}
    check("nodeAffinity" not in affinity, f"parsed {color} has no nodeAffinity")
    constraints = pod.get("topologySpreadConstraints") or []
    check(len(constraints) == 2, f"parsed {color} has two spread constraints")
    got_keys = [item.get("topologyKey") for item in constraints]
    check(got_keys == keys, f"parsed {color} spread keys stay hostname then zone")
    actions = {
        "kubernetes.io/hostname": "DoNotSchedule",
        "topology.kubernetes.io/zone": "DoNotSchedule",
    }
    for item in constraints:
        key = item.get("topologyKey")
        check(item.get("maxSkew") == 1, f"parsed {color} {key} maxSkew is 1")
        check(item.get("whenUnsatisfiable") == actions.get(key),
              f"parsed {color} {key} whenUnsatisfiable is {actions.get(key)}")
        check(item.get("nodeTaintsPolicy") == "Honor",
              f"parsed {color} {key} nodeTaintsPolicy stays Honor")
        check(item.get("nodeAffinityPolicy") == "Honor",
              f"parsed {color} {key} nodeAffinityPolicy is Honor")
        check("minDomains" not in item, f"parsed {color} {key} has no minDomains")
        labels = ((item.get("labelSelector") or {}).get("matchLabels") or {})
        check(labels.get("app") == "computerpets" and labels.get("color") == color,
              f"parsed {color} {key} selector stays color={color}")

if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
