#!/usr/bin/env bash
# ADR 0103 — the salvo keeps the 1m budget when a later option does not start.
# Salvo, the 1m budget, and frequent loops stay. Node-provision time and
# node-group failure backoff stay at the v1.36.1 defaults (unset).
# No cluster. Does not kubectl apply. No terraform apply.
# Kind and minikube stay off this file. Do not set minDomains.
# Required hostname anti-affinity and required zone anti-affinity
# are not this slice.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0103-cluster-autoscaler-salvo-early-stop.md"
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

echo "== cluster-autoscaler salvo early-stop files =="
need_file "$MANIFEST"
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"

echo "== docs =="
need_grep "$ADR" 'salvo-scale-up-budget' "ADR names the salvo budget"
need_grep "$ADR" 'budget exhausted|budget is already gone|budget context' "ADR records the budget early stop"
need_grep "$ADR" 'snapshot update returns an error' "ADR records the snapshot-update early stop"
need_grep "$ADR" 'not successful' "ADR records the unsuccessful scale-up early stop"
need_grep "$ADR" 'next main loop' "ADR names the next main loop"
need_grep "$ADR" 'max-node-provision-time' "ADR names the node-provision clock"
need_grep "$ADR" 'max-binpacking-time' "ADR names the binpacking cap"
need_grep "$ADR" 'max-nodegroup-binpacking-duration' "ADR names the per-group binpacking cap"
need_grep "$ADR" 'initial-node-group-backoff-duration' "ADR names node-group backoff"
need_grep "$ADR" 'frequent-loops-enabled' "ADR names frequent loops"
need_grep "$ADR" 'parallel-scale-up' "ADR names parallel scale-up"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'Do not set minDomains' "ADR refuses minDomains"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$MANIFEST" 'ADR 0103' "manifest names ADR 0103"
need_grep "$MANIFEST" 'Kind and minikube' "manifest names kind and minikube"
need_grep "$README" 'ADR 0103' "README names ADR 0103"
need_grep "$KUSTOM" 'ADR 0103' "kustomize comment names the early stop"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization still omits cluster-autoscaler"
need_not_grep_body "$MANIFEST" 'minDomains:' "zone spread does not set minDomains"

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
      "image is v1.36.1")

def count(arg):
    return sum(1 for item in command if item == arg)

def present(name):
    return any(item == name or item.startswith(name + "=") for item in command)

check(count("--balance-similar-node-groups=true") == 1, "similar node groups stay balanced")
check(count("--skip-nodes-with-system-pods=false") == 1, "system pods do not pin scale-down")
check(count("--expander=least-waste") == 1, "expander stays least-waste")
check(count("--salvo-scale-up=true") == 1, "salvo scale-up is on")
check(not any(item == "--salvo-scale-up" or (item.startswith("--salvo-scale-up=") and item != "--salvo-scale-up=true")
              for item in command),
      "salvo-scale-up is not false and is not bare")
check(count("--salvo-scale-up-budget=1m") == 1, "salvo budget is 1m")
check(not any(item == "--salvo-scale-up-budget" or (item.startswith("--salvo-scale-up-budget=")
              and item != "--salvo-scale-up-budget=1m") for item in command),
      "salvo budget is not 0s, 5m, 15m, or another duration")
check(count("--frequent-loops-enabled=true") == 1, "frequent loops stay on")
check(not any(item == "--frequent-loops-enabled" or (item.startswith("--frequent-loops-enabled=")
              and item != "--frequent-loops-enabled=true") for item in command),
      "frequent loops are not false and are not bare")

forbidden = [
    ("--initial-node-group-backoff-duration", "node-group backoff initial duration stays the 5m default"),
    ("--max-node-group-backoff-duration", "node-group backoff cap stays the 30m default"),
    ("--node-group-backoff-reset-timeout", "node-group backoff reset stays the 3h default"),
    ("--max-node-provision-time", "node-provision time stays the 15m default"),
    ("--max-node-startup-time", "node-startup time stays the 15m default"),
    ("--max-binpacking-time", "binpacking cap stays the 5m default"),
    ("--max-nodegroup-binpacking-duration", "per-group binpacking cap stays the 10s default"),
    ("--parallel-scale-up", "parallel scale-up stays unset"),
    ("--new-pod-scale-up-delay", "new-pod scale-up delay stays the 0s default"),
    ("--provisioning-request-initial-backoff-time", "provisioning-request initial backoff stays unset"),
    ("--provisioning-request-max-backoff-time", "provisioning-request max backoff stays unset"),
    ("--provisioning-request-max-backoff-cache-size", "provisioning-request backoff cache stays unset"),
    ("--enable-provisioning-requests", "provisioning requests stay disabled"),
]
for flag, name in forbidden:
    check(not present(flag), name)

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
