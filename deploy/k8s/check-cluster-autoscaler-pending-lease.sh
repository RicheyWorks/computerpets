#!/usr/bin/env bash
# ADR 0110 — a Pending Cluster Autoscaler pod never holds the lease.
# The Running leader remains the scaler. v1.36.1 acquires the lease
# inside the container. No flag hands it to a pod that has not started.
# No cluster. Does not kubectl apply. No terraform apply.
# Kind and minikube stay off this file. Do not set minDomains.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0110-cluster-autoscaler-pending-lease.md"
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

echo "== cluster-autoscaler pending lease files =="
need_file "$MANIFEST"
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"

echo "== docs =="
need_grep "$ADR" 'never holds' "ADR says a Pending pod never holds the lease"
need_grep "$ADR" 'Running leader remains the scaler' "ADR says the Running leader remains the scaler"
need_grep "$ADR" 'OnStartedLeading' "ADR names the callback that starts the scale loop"
need_grep "$ADR" 'os\.Hostname' "ADR names the holder identity"
need_grep "$ADR" 'system-cluster-critical' "ADR keeps the built-in priority class"
need_grep "$ADR" 'system-node-critical' "ADR records why the node class is refused"
need_grep "$ADR" 'kubectl top' "ADR names the next gap outside this loop"
need_grep "$ADR" 'caBundle' "ADR names the serving-certificate gap"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'Required hostname anti-affinity is not the follow-up' "ADR does not make hostname anti-affinity the follow-up"
need_grep "$ADR" 'Required zone anti-affinity is not the follow-up' "ADR does not make zone anti-affinity the follow-up"
need_grep "$MANIFEST" 'ADR 0110' "manifest names ADR 0110"
need_grep "$MANIFEST" 'never holds the lease' "manifest says a Pending pod never holds the lease"
need_grep "$MANIFEST" 'Running leader remains the scaler' "manifest says the Running leader remains the scaler"
need_grep "$README" 'ADR 0110' "README names ADR 0110"
need_grep "$README" 'never holds the lease' "README says a Pending pod never holds the lease"
need_grep "$KUSTOM" 'ADR 0110' "kustomize comment names the pending lease"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization still omits cluster-autoscaler"
need_not_grep_body "$MANIFEST" 'minDomains:' "zone spread does not set minDomains"
need_not_grep_body "$MANIFEST" 'preemptionPolicy:[[:space:]]*Never' "preemption is not disabled"
need_not_grep_body "$MANIFEST" 'safe-to-evict' "safe-to-evict is not a lease handoff"
need_not_grep_body "$MANIFEST" 'kind:[[:space:]]*PriorityClass' "no custom PriorityClass"

python3 - "$MANIFEST" <<'PY'
import pathlib, sys

manifest = pathlib.Path(sys.argv[1]).read_text()
failed = False

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

try:
    import yaml
except ImportError:
    check(False, "PyYAML is installed")
    sys.exit(1)

docs = [doc for doc in yaml.safe_load_all(manifest) if isinstance(doc, dict)]
check(not any(doc.get("kind") == "PriorityClass" for doc in docs),
      "the file does not define a PriorityClass")
check(not any(doc.get("kind") == "DaemonSet" for doc in docs),
      "the scaler is not a DaemonSet")
deps = [doc for doc in docs if doc.get("kind") == "Deployment"]
check(len(deps) == 1, "one Cluster Autoscaler Deployment")
pdbs = [doc for doc in docs if doc.get("kind") == "PodDisruptionBudget"]
check(len(pdbs) == 1, "one Cluster Autoscaler disruption budget")
dep = deps[0] if deps else {}
spec = dep.get("spec") or {}
check(spec.get("replicas") == 2, "replicas stay 2")
strategy = ((spec.get("strategy") or {}).get("rollingUpdate") or {})
check(strategy.get("maxUnavailable") == 1, "rolling update maxUnavailable stays 1")
check(strategy.get("maxSurge") == 0, "rolling update maxSurge stays 0")
pod = ((spec.get("template") or {}).get("spec") or {})
meta = (spec.get("template") or {}).get("metadata") or {}
annotations = meta.get("annotations") or {}
check("cluster-autoscaler.kubernetes.io/safe-to-evict" not in annotations,
      "safe-to-evict stays unset")
check(pod.get("priorityClassName") == "system-cluster-critical",
      "priority class stays system-cluster-critical")
check(not pod.get("initContainers"), "no init container holds the lease")
containers = pod.get("containers") or []
check(len(containers) == 1, "one container; a sidecar does not start while Pending")
container = containers[0] if containers else {}
check(container.get("name") == "cluster-autoscaler", "the container is cluster-autoscaler")
check(container.get("image") == "registry.k8s.io/autoscaling/cluster-autoscaler:v1.36.1",
      "image stays the inventoried v1.36.1 binary")
command = list(container.get("command") or [])

def count(arg):
    return sum(1 for item in command if item == arg)

def prefixed(prefix):
    return [item for item in command if item == prefix or item.startswith(prefix + "=") or item.startswith(prefix)]

check(count("--leader-elect=true") == 1, "leader election is on")
check(count("--leader-elect-resource-lock=leases") == 1, "leader lock is leases")
check(count("--leader-elect-resource-name=cluster-autoscaler") == 1,
      "leader lock name is cluster-autoscaler")
check(count("--namespace=kube-system") == 1, "lease namespace is kube-system")
check(not any(item.startswith("--leader-elect=false") or item == "--leader-elect=false" for item in command),
      "leader election is not turned off")
for flag in (
    "--leader-elect-lease-duration",
    "--leader-elect-renew-deadline",
    "--leader-elect-retry-period",
    "--leader-elect-resource-namespace",
):
    check(not prefixed(flag), f"{flag} stays unset; it does not start a Pending pod")
check(not any(item.startswith("--leader-elect-resource-lock=") and item != "--leader-elect-resource-lock=leases"
              for item in command),
      "the lock is not endpoints, configmaps, or another resource")
check(count("--balance-similar-node-groups=true") == 1, "similar node groups stay balanced")
check(count("--expander=least-waste") == 1, "expander stays least-waste")
check(count("--skip-nodes-with-system-pods=false") == 1, "system-pod scale-down pin stays false")
check(count("--salvo-scale-up=true") == 1, "salvo stays on")
check(count("--salvo-scale-up-budget=1m") == 1, "salvo budget stays 1m")
check(count("--frequent-loops-enabled=true") == 1, "frequent loops stay on")

selector = pod.get("nodeSelector") or {}
check(selector.get("kubernetes.io/os") == "linux", "pool pin keeps linux")
check(selector.get("computerpets/node-pool") == "api", "pool pin keeps the api pool")
tolerations = pod.get("tolerations") or []
check(any(
    item.get("key") == "computerpets/node-pool"
    and item.get("value") == "api"
    and item.get("effect") == "NoSchedule"
    for item in tolerations
), "api pool taint stays tolerated")

constraints = pod.get("topologySpreadConstraints") or []
check(len(constraints) == 1, "one zone spread item")
if constraints:
    item = constraints[0]
    check(item.get("topologyKey") == "topology.kubernetes.io/zone", "zone key stays the zone")
    check(item.get("whenUnsatisfiable") == "DoNotSchedule", "zone spread stays DoNotSchedule")
    check(item.get("maxSkew") == 1, "zone spread maxSkew stays 1")
    check("minDomains" not in item, "minDomains stays unset")
affinity = pod.get("affinity") or {}
anti = (affinity.get("podAntiAffinity") or {})
required = anti.get("requiredDuringSchedulingIgnoredDuringExecution") or []
req_keys = [term.get("topologyKey") for term in required]
check(req_keys == ["kubernetes.io/hostname"], "required anti-affinity stays hostname only")
check("topology.kubernetes.io/zone" not in req_keys, "required zone anti-affinity is not set")

pdb = pdbs[0] if pdbs else {}
pdb_spec = pdb.get("spec") or {}
check(pdb_spec.get("minAvailable") == 1, "disruption budget minAvailable stays 1")
check("maxUnavailable" not in pdb_spec, "disruption budget does not switch to maxUnavailable")
match = ((pdb_spec.get("selector") or {}).get("matchLabels") or {})
check(match.get("app") == "cluster-autoscaler", "disruption budget selects the Deployment")

roles = [doc for doc in docs if doc.get("kind") == "ClusterRole"]
check(len(roles) == 1, "one ClusterRole")
rules = (roles[0].get("rules") or []) if roles else []
lease_rules = [
    rule for rule in rules
    if "coordination.k8s.io" in (rule.get("apiGroups") or [])
    and "leases" in (rule.get("resources") or [])
]
check(len(lease_rules) == 2, "lease RBAC is create plus the named get/update")
create_rules = [rule for rule in lease_rules if rule.get("verbs") == ["create"] and not rule.get("resourceNames")]
named_rules = [
    rule for rule in lease_rules
    if rule.get("resourceNames") == ["cluster-autoscaler"]
    and set(rule.get("verbs") or []) == {"get", "update"}
]
check(len(create_rules) == 1, "the Running process may create the lease")
check(len(named_rules) == 1, "the Running process may get and update the named lease")
check(not any("delete" in (rule.get("verbs") or []) for rule in lease_rules),
      "lease RBAC does not delete the lease to fake a handoff")

if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
