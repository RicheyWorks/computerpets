#!/usr/bin/env bash
# ADR 0094 — NoSchedule taint on the API node pool, and matching
# tolerations on the workloads that already select it.
# No cluster. Does not kubectl apply. No terraform apply.
# Kind and minikube are not tainted. A toleration does not require the
# taint. Do not taint a kind or minikube node.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
K8="${ROOT}/deploy/k8s"
KUSTOM="${K8}/kustomization.yaml"
BLUE="${K8}/deployment-blue.yaml"
GREEN="${K8}/deployment-green.yaml"
METRICS="${K8}/metrics-server.yaml"
CA="${K8}/cluster-autoscaler.yaml"
POSTGRES="${K8}/postgres.yaml"
REDIS="${K8}/redis.yaml"
HPA="${K8}/hpa.yaml"
PDB="${K8}/pdb.yaml"
README="${K8}/README.md"
ADR="${ROOT}/docs/adr/0094-api-pool-taint.md"
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

echo "== API pool taint files =="
need_file "$KUSTOM"
need_file "$BLUE"
need_file "$GREEN"
need_file "$METRICS"
need_file "$CA"
need_file "$POSTGRES"
need_file "$REDIS"
need_file "$HPA"
need_file "$PDB"
need_file "$README"
need_file "$ADR"
need_file "$POOL"

echo "== node group taint =="
need_grep "$POOL" 'api-pool-taint ADR 0094' "module names ADR 0094"
need_grep "$POOL" 'taint-key=computerpets/node-pool' "taint key marker"
need_grep "$POOL" 'taint-value=api' "taint value marker"
need_grep "$POOL" 'taint-effect=NO_SCHEDULE' "taint effect marker"
need_grep "$POOL" 'effect[[:space:]]*=[[:space:]]*"NO_SCHEDULE"' "node group effect is NO_SCHEDULE"
need_grep "$POOL" '"computerpets/node-pool"[[:space:]]*=[[:space:]]*"api"' "pool label stays computerpets/node-pool=api"
need_grep "$POOL" 'Do not taint a kind or minikube node' "module refuses a local taint"
need_grep "$POOL" 'Kind and minikube' "module names kind and minikube"

echo "== tolerations on workloads that select the pool =="
for pair in "blue:${BLUE}" "green:${GREEN}" "metrics-server:${METRICS}" "cluster-autoscaler:${CA}"; do
  name="${pair%%:*}"
  file="${pair#*:}"
  need_grep "$file" 'ADR 0094' "${name} names ADR 0094"
  need_grep "$file" '^[[:space:]]*tolerations:[[:space:]]*$' "${name} has a tolerations block"
  need_grep "$file" 'key: computerpets/node-pool$' "${name} tolerates the pool key"
  need_grep "$file" 'operator: Equal$' "${name} toleration operator is Equal"
  need_grep "$file" 'value: api$' "${name} toleration value is api"
  need_grep "$file" 'effect: NoSchedule$' "${name} toleration effect is NoSchedule"
  need_grep "$file" 'nodeSelector:' "${name} keeps its nodeSelector"
  need_grep "$file" 'computerpets/node-pool: api$' "${name} still selects the api pool label"
  need_grep "$file" 'kubernetes.io/os: linux$' "${name} still selects linux"
done

need_grep "$BLUE" 'Do not taint a kind or minikube node' "blue refuses a local taint"
need_grep "$GREEN" 'Do not taint a kind or minikube node' "green refuses a local taint"
need_grep "$BLUE" 'A toleration does not require the taint' "blue says a toleration is not a taint"
need_grep "$GREEN" 'A toleration does not require the taint' "green says a toleration is not a taint"
need_not_grep "$BLUE" 'effect: NoExecute' "blue does not tolerate NoExecute"
need_not_grep "$GREEN" 'effect: NoExecute' "green does not tolerate NoExecute"
need_not_grep "$METRICS" 'effect: NoExecute' "metrics-server does not tolerate NoExecute"
need_not_grep "$CA" 'effect: NoExecute' "cluster-autoscaler does not tolerate NoExecute"
need_not_grep "$BLUE" 'effect: PreferNoSchedule' "blue does not prefer the taint"
need_not_grep "$GREEN" 'effect: PreferNoSchedule' "green does not prefer the taint"
need_not_grep "$BLUE" 'operator: Exists' "blue toleration is not Exists"
need_not_grep "$GREEN" 'operator: Exists' "green toleration is not Exists"
need_not_grep "$METRICS" 'operator: Exists' "metrics-server toleration is not Exists"
need_not_grep "$CA" 'operator: Exists' "cluster-autoscaler toleration is not Exists"

echo "== stores stay off the pool =="
need_not_grep "$POSTGRES" 'tolerations:' "postgres has no tolerations"
need_not_grep "$REDIS" 'tolerations:' "redis has no tolerations"
need_not_grep "$POSTGRES" 'computerpets/node-pool' "postgres does not name the pool"
need_not_grep "$REDIS" 'computerpets/node-pool' "redis does not name the pool"
need_not_grep "$POSTGRES" 'nodeSelector:' "postgres stays unpinned"
need_not_grep "$REDIS" 'nodeSelector:' "redis stays unpinned"

echo "== local path and neighbors stay =="
need_grep "$KUSTOM" 'ADR 0094' "kustomize comment names the taint"
need_grep "$KUSTOM" 'Do not taint a kind or minikube node' "kustomize refuses a local taint"
need_grep "$KUSTOM" 'A toleration does not require the taint' "kustomize says a toleration is not a taint"
need_grep "$KUSTOM" 'deployment-blue.yaml' "kustomize still applies blue"
need_grep "$KUSTOM" 'deployment-green.yaml' "kustomize still applies green"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization still omits metrics-server"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization still omits cluster-autoscaler"
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
# Zone DoNotSchedule is ADR 0095. Hostname DoNotSchedule is ADR 0100.
# This check does not own those actions. It only refuses a drop back
# to ScheduleAnyway on the API colors.
need_not_grep "$BLUE" 'whenUnsatisfiable: ScheduleAnyway' "blue spread is not ScheduleAnyway"
need_not_grep "$GREEN" 'whenUnsatisfiable: ScheduleAnyway' "green spread is not ScheduleAnyway"
need_grep "$HPA" 'minReplicas: 3' "HPA floor stays 3"
need_grep "$HPA" 'maxReplicas: 6' "HPA ceiling stays 6"
need_grep "$PDB" 'minAvailable: 2' "API disruption budget stays 2"
node_hit=0
taint_cmd=0
for manifest in "$K8"/*.yaml; do
  if grep -qE 'kind: Node$' "$manifest"; then node_hit=1; fi
  if grep -qE 'kubectl taint' "$manifest"; then taint_cmd=1; fi
done
if [ "$node_hit" -eq 0 ]; then ok "k8s yaml has no Node object"
else bad "k8s yaml has a Node object"; fi
if [ "$taint_cmd" -eq 0 ]; then ok "k8s yaml does not run kubectl taint"
else bad "k8s yaml runs kubectl taint"; fi

echo "== docs =="
need_grep "$README" 'ADR 0094' "README names ADR 0094"
need_grep "$README" 'Do not taint a kind or minikube node' "README refuses a local taint"
need_grep "$README" 'A toleration does not require the taint' "README says a toleration is not a taint"
need_grep "$README" 'Kind and minikube' "README names kind and minikube"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'Do not taint a kind or minikube node' "ADR refuses a local taint"
need_grep "$ADR" 'A toleration does not require the taint' "ADR says a toleration is not a taint"
need_grep "$ADR" 'ScheduleAnyway' "taint ADR still records the old soft spread"
need_grep "$ADR" 'aws-node' "ADR names the VPC CNI DaemonSet this repo does not own"
need_grep "$ADR" 'kube-proxy' "ADR names kube-proxy this repo does not own"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"

python3 - "$POOL" "$K8" <<'PY'
import pathlib, re, sys
import yaml

pool_path = pathlib.Path(sys.argv[1])
k8 = pathlib.Path(sys.argv[2])
failed = False

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

def code_only(text):
    return "\n".join(line.split("#", 1)[0] for line in text.splitlines())

code = code_only(pool_path.read_text())
check("PREFER_NO_SCHEDULE" not in code, "module code does not set PREFER_NO_SCHEDULE")
check("NO_EXECUTE" not in code, "module code does not set NO_EXECUTE")
check(code.count("NO_SCHEDULE") == 1, "module code names NO_SCHEDULE once")
blocks = re.findall(r"taint\s*\{([^{}]*)\}", code)
check(len(blocks) == 1, "module has one taint block")
body = blocks[0] if blocks else ""

def assign(name):
    match = re.search(rf'{name}\s*=\s*"([^"]*)"', body)
    return match.group(1) if match else None

check(assign("key") == "computerpets/node-pool", "taint key is computerpets/node-pool")
check(assign("value") == "api", "taint value is api")
check(assign("effect") == "NO_SCHEDULE", "taint effect is NO_SCHEDULE")
labels = re.search(r"labels\s*=\s*\{([^}]*)\}", code, re.S)
label_body = labels.group(1) if labels else ""
check('"computerpets/node-pool"' in label_body and '"api"' in label_body,
      "labels block still sets computerpets/node-pool=api")
check("topology.kubernetes.io/zone" not in label_body,
      "labels block still does not stamp the zone label")

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
must = {
    "deployment-blue.yaml": {"computerpets-blue"},
    "deployment-green.yaml": {"computerpets-green"},
    "metrics-server.yaml": {"metrics-server"},
    "cluster-autoscaler.yaml": {"cluster-autoscaler"},
}
found = {name: set() for name in must}
daemonsets = []

def pool_tolerations(pod):
    tols = pod.get("tolerations") or []
    return [item for item in tols if isinstance(item, dict) and item.get("key") == "computerpets/node-pool"]

for path in sorted(k8.glob("*.yaml")):
    text = path.read_text()
    for doc in yaml.safe_load_all(text):
        if not isinstance(doc, dict):
            continue
        kind = doc.get("kind")
        if kind not in ("Deployment", "DaemonSet"):
            continue
        meta = doc.get("metadata") or {}
        name = meta.get("name") or ""
        pod = ((doc.get("spec") or {}).get("template") or {}).get("spec") or {}
        sel = pod.get("nodeSelector") or {}
        selects = sel.get("computerpets/node-pool") == "api"
        tols = pool_tolerations(pod)
        label = f"{path.name} {kind} {name}"
        if kind == "DaemonSet":
            daemonsets.append(label)
        if selects:
            check(sel == want_sel, f"{label} nodeSelector is linux plus the api pool")
            check(tols == [want_tol], f"{label} tolerates only computerpets/node-pool=api:NoSchedule")
        else:
            check(tols == [], f"{label} does not tolerate the api pool taint")
            check("computerpets/node-pool" not in sel, f"{label} does not select the pool")
        if path.name in must and name in must[path.name]:
            found[path.name].add(name)
            check(selects, f"{label} selects the api pool")

for filename, names in must.items():
    check(found[filename] == names, f"found required workload {filename} {sorted(names)}")

check(daemonsets == [], "deploy/k8s has no DaemonSet")
if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
