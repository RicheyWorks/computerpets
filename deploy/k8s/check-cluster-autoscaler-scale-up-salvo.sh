#!/usr/bin/env bash
# ADR 0102 — the leader scales another group in the same loop.
# Salvo stays on. least-waste and similar-group balance stay.
# No cluster. Does not kubectl apply. No terraform apply.
# Kind and minikube stay off this file. Do not set minDomains.
# Required hostname anti-affinity and required zone anti-affinity
# are not this slice.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0102-cluster-autoscaler-scale-up-salvo.md"
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

echo "== cluster-autoscaler scale-up salvo files =="
need_file "$MANIFEST"
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"

echo "== docs =="
need_grep "$ADR" 'salvo-scale-up' "ADR names salvo scale-up"
need_grep "$ADR" 'least-waste' "ADR keeps least-waste"
need_grep "$ADR" 'balance-similar-node-groups' "ADR keeps similar-group balance"
need_grep "$ADR" 'frequent-loops-enabled' "ADR names frequent loops"
need_grep "$ADR" 'priority expander' "ADR names the priority expander"
need_grep "$ADR" 'scan-interval' "ADR names the scan interval"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'experimental' "ADR records the experimental note"
need_grep "$MANIFEST" 'ADR 0102' "manifest names ADR 0102"
need_grep "$MANIFEST" 'Kind and minikube' "manifest names kind and minikube"
need_grep "$README" 'ADR 0102' "README names ADR 0102"
need_grep "$KUSTOM" 'ADR 0102' "kustomize comment names the salvo"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization still omits cluster-autoscaler"
need_not_grep_body "$MANIFEST" 'minDomains:' "zone spread does not set minDomains"
need_not_grep_body "$MANIFEST" 'kind: ConfigMap' "manifest does not add a ConfigMap"

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

docs = [doc for doc in yaml.safe_load_all(manifest) if doc]
deps = [doc for doc in docs if doc.get("kind") == "Deployment"]
check(len(deps) == 1, "one Cluster Autoscaler Deployment")
dep = deps[0] if deps else {}
pod = (((dep.get("spec") or {}).get("template") or {}).get("spec") or {})
containers = pod.get("containers") or []
container = containers[0] if containers else {}
command = list(container.get("command") or [])
check(container.get("image") == "registry.k8s.io/autoscaling/cluster-autoscaler:v1.36.1",
      "image is v1.36.1, which has salvo-scale-up")

def count(arg):
    return sum(1 for item in command if item == arg)

check(count("--balance-similar-node-groups=true") == 1, "similar node groups stay balanced")
check(count("--skip-nodes-with-system-pods=false") == 1, "system pods do not pin scale-down")
check(count("--expander=least-waste") == 1, "expander stays least-waste")
check(not any(item.startswith("--expander=") and item != "--expander=least-waste" for item in command),
      "expander is not priority, a chain, or another strategy")
check(count("--salvo-scale-up=true") == 1, "salvo scale-up is on")
check(not any(item == "--salvo-scale-up" or (item.startswith("--salvo-scale-up=") and item != "--salvo-scale-up=true")
              for item in command),
      "salvo-scale-up is not false and is not bare")
check(count("--salvo-scale-up-budget=1m") == 1, "salvo budget is 1m")
check(not any(item == "--salvo-scale-up-budget" or (item.startswith("--salvo-scale-up-budget=")
              and item != "--salvo-scale-up-budget=1m") for item in command),
      "salvo budget is not a different duration")
check(count("--frequent-loops-enabled=true") == 1, "frequent loops stay on")
check(not any(item == "--frequent-loops-enabled" or (item.startswith("--frequent-loops-enabled=")
              and item != "--frequent-loops-enabled=true") for item in command),
      "frequent loops are not false and are not bare")
scan = [item for item in command if item == "--scan-interval" or item.startswith("--scan-interval")]
check(scan == [] or scan == ["--scan-interval=10s"], "scan-interval stays the 10s default")
check(not any(item == "--max-nodes-per-scaleup" or item.startswith("--max-nodes-per-scaleup")
              for item in command),
      "max-nodes-per-scaleup stays unset")
check(not any(item == "--aws-use-static-instance-list" or item.startswith("--aws-use-static-instance-list")
              for item in command),
      "the AWS instance-type list flag stays unset")
names = [(doc.get("metadata") or {}).get("name") for doc in docs if doc.get("kind") == "ConfigMap"]
check("cluster-autoscaler-priority-expander" not in names, "no priority expander ConfigMap")
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
