#!/usr/bin/env bash
# ADR 0100 — hard hostname spread for the API colors.
# No cluster. Does not kubectl apply. No terraform apply.
# Hostname is DoNotSchedule, maxSkew 1, nodeAffinityPolicy Honor,
# nodeTaintsPolicy Honor. No minDomains. Zone stays DoNotSchedule.
# One hostname still schedules. The second local replica is not left
# Pending by this item. Required hostname anti-affinity is not set.
# Do not set minDomains. HPA, PDB, the pool selector, and the taint
# toleration stay.
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
ADR="${ROOT}/docs/adr/0100-api-hostname-hard-spread.md"
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

echo "== API hostname hard spread files =="
need_file "$KUSTOM"
need_file "$BLUE"
need_file "$GREEN"
need_file "$POSTGRES"
need_file "$REDIS"
need_file "$HPA"
need_file "$PDB"
need_file "$README"
need_file "$ADR"

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
need_not_grep "$BLUE" 'requiredDuringSchedulingIgnoredDuringExecution' "blue has no required anti-affinity"
need_not_grep "$GREEN" 'requiredDuringSchedulingIgnoredDuringExecution' "green has no required anti-affinity"
need_not_grep "$BLUE" 'podAntiAffinity:' "blue does not also anti-affinity"
need_not_grep "$GREEN" 'podAntiAffinity:' "green does not also anti-affinity"
need_not_grep "$POSTGRES" 'topologySpreadConstraints:' "postgres scaffolding is not spread"
need_not_grep "$REDIS" 'topologySpreadConstraints:' "redis scaffolding is not spread"
need_not_grep "$POSTGRES" 'tolerations:' "postgres still has no tolerations"
need_not_grep "$REDIS" 'tolerations:' "redis still has no tolerations"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*hpa\.yaml[[:space:]]*$' "kustomization still omits hpa.yaml"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*pdb\.yaml[[:space:]]*$' "kustomization still omits pdb.yaml"
need_grep "$KUSTOM" 'ADR 0100' "kustomize comment names the hard hostname spread"
need_grep "$KUSTOM" 'One hostname still schedules' "kustomize comment is honest about one hostname"
need_grep "$KUSTOM" 'Do not set minDomains' "kustomize comment refuses minDomains"
need_grep "$KUSTOM" 'not left Pending' "kustomize comment says the second replica is not left Pending"

echo "== docs =="
need_grep "$README" 'ADR 0100' "README names ADR 0100"
need_grep "$README" 'DoNotSchedule' "README names the hard hostname action"
need_grep "$README" 'One hostname still schedules' "README is honest about one hostname"
need_grep "$README" 'Kind and minikube' "README names kind and minikube"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'One hostname still schedules' "ADR is honest about one hostname"
need_grep "$ADR" 'not left Pending' "ADR says the second pod is not left Pending"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'nodeAffinityPolicy: Honor' "ADR names Honor"
need_grep "$ADR" 'nodeTaintsPolicy: Honor' "ADR names taint Honor"
need_grep "$ADR" 'maxSkew: 1' "ADR names maxSkew 1"
need_grep "$ADR" 'Required hostname anti-affinity is not set' "ADR does not require hostname anti-affinity"
need_grep "$ADR" 'Required zone anti-affinity is not the follow-up' "ADR does not require the zone rule"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'kube-proxy' "ADR names the kube-proxy cross-link"

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
    check("affinity" not in pod or "podAntiAffinity" not in (pod.get("affinity") or {}),
          f"parsed {color} has no pod anti-affinity")
    constraints = pod.get("topologySpreadConstraints") or []
    check(len(constraints) == 2, f"parsed {color} has two spread constraints")
    got_keys = [item.get("topologyKey") for item in constraints]
    check(got_keys == keys, f"parsed {color} spread keys stay hostname then zone")
    for item in constraints:
        key = item.get("topologyKey")
        check(item.get("maxSkew") == 1, f"parsed {color} {key} maxSkew is 1")
        check(item.get("whenUnsatisfiable") == "DoNotSchedule",
              f"parsed {color} {key} whenUnsatisfiable is DoNotSchedule")
        check(item.get("nodeTaintsPolicy") == "Honor",
              f"parsed {color} {key} nodeTaintsPolicy is Honor")
        check(item.get("nodeAffinityPolicy") == "Honor",
              f"parsed {color} {key} nodeAffinityPolicy is Honor")
        check("minDomains" not in item, f"parsed {color} {key} has no minDomains")
        check("matchLabelKeys" not in item, f"parsed {color} {key} has no matchLabelKeys")
        labels = ((item.get("labelSelector") or {}).get("matchLabels") or {})
        check(labels.get("app") == "computerpets" and labels.get("color") == color,
              f"parsed {color} {key} selector stays color={color}")

if failed:
    sys.exit(1)
PY

if command -v kubectl >/dev/null 2>&1; then
  kust_out="$(mktemp)"
  if kubectl kustomize "${ROOT}/deploy/k8s" >"${kust_out}" 2>/tmp/cp-host-hard-kust.err; then
    zone_n="$(grep -c 'topologyKey: topology.kubernetes.io/zone' "${kust_out}" || true)"
    host_n="$(grep -c 'topologyKey: kubernetes.io/hostname' "${kust_out}" || true)"
    soft_n="$(grep -c 'whenUnsatisfiable: ScheduleAnyway' "${kust_out}" || true)"
    hard_n="$(grep -c 'whenUnsatisfiable: DoNotSchedule' "${kust_out}" || true)"
    if [ "${zone_n}" = "2" ] && [ "${host_n}" = "2" ] && [ "${soft_n}" = "0" ] && [ "${hard_n}" = "4" ]; then
      ok "kustomize output keeps hard hostname spread beside hard zone spread"
    else
      bad "kustomize output keeps hard hostname spread beside hard zone spread (zone=${zone_n} host=${host_n} soft=${soft_n} hard=${hard_n})"
    fi
  else
    bad "kubectl kustomize deploy/k8s failed"
    cat /tmp/cp-host-hard-kust.err || true
  fi
  rm -f "${kust_out}" /tmp/cp-host-hard-kust.err
else
  ok "kubectl not installed; skipped kustomize"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
