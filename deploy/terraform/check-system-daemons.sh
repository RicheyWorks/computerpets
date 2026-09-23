#!/usr/bin/env bash
# ADR 0096 — API pool toleration for aws-node (vpc-cni) and kube-proxy.
# No cloud account. Does not terraform apply. Does not kubectl.
# Kind and minikube stay untainted. The kube-proxy addon schema is not
# sent a tolerations field.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MODULE="${ROOT}/deploy/terraform/modules/system_daemons/main.tf"
JSON="${ROOT}/deploy/terraform/modules/system_daemons/vpc-cni-configuration-values.json"
PATCH="${ROOT}/deploy/terraform/modules/system_daemons/kube-proxy-api-pool-toleration.yaml"
ROOT_MAIN="${ROOT}/deploy/terraform/main.tf"
README="${ROOT}/deploy/terraform/README.md"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
CA="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
ADR="${ROOT}/docs/adr/0096-system-daemon-api-pool-toleration.md"
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

echo "== system daemon files =="
need_file "$MODULE"
need_file "$JSON"
need_file "$PATCH"
need_file "$ADR"
need_file "$ROOT_MAIN"

echo "== vpc-cni is the live-apply path for aws-node =="
need_grep "$MODULE" 'system-daemons ADR 0096' "module names ADR 0096"
need_grep "$MODULE" 'addon=vpc-cni' "module names the vpc-cni addon"
need_grep "$MODULE" 'daemonset=aws-node' "module names the aws-node DaemonSet"
need_grep "$MODULE" 'kube-proxy-configuration-values=rejected' "module rejects kube-proxy configuration_values"
need_grep "$MODULE" 'image-fork=false' "module does not fork an image"
need_grep "$MODULE" 'addon-version-pinned=false' "module does not pin an addon version"
need_grep "$MODULE" 'kind-minikube=untainted' "module leaves kind and minikube untainted"
need_grep "$MODULE" 'aws_eks_addon" "vpc_cni"' "vpc-cni addon resource exists"
need_grep "$MODULE" 'addon_name[[:space:]]*=[[:space:]]*"vpc-cni"' "addon name is vpc-cni"
need_grep "$MODULE" 'resolve_conflicts_on_create[[:space:]]*=[[:space:]]*"OVERWRITE"' "create writes the toleration document"
need_grep "$MODULE" 'resolve_conflicts_on_update[[:space:]]*=[[:space:]]*"OVERWRITE"' "update writes the toleration document"
need_grep "$MODULE" 'configuration_values' "vpc-cni sets configuration_values"
need_grep "$ROOT_MAIN" 'module "system_daemons"' "root plans the system daemon module"
need_grep "$ROOT_MAIN" 'count[[:space:]]*=[[:space:]]*var.enable_node_pool' "module follows the node pool flag"
need_grep "$ROOT_MAIN" 'depends_on = \[module.system_daemons\]' "node pool waits on the daemon module"
need_grep "$README" 'ADR 0096' "terraform README names ADR 0096"
need_grep "$README" 'describe-addon' "README tells the keeper to read the live addon first"
need_grep "$README" ':vpc-cni' "README records the vpc-cni import id"
need_grep "$README" 'kube-proxy-api-pool-toleration.yaml' "README names the kube-proxy patch"
need_grep "$README" 'Do not taint a kind or minikube node' "README refuses a local taint"
need_grep "$README" 'Do not run that patch on kind or minikube' "README refuses the patch on a laptop cluster"
need_not_grep "$KUSTOM" 'kube-proxy-api-pool-toleration' "kustomization does not apply the kube-proxy patch"
need_not_grep "$KUSTOM" 'vpc-cni-configuration-values' "kustomization does not apply the vpc-cni document"
need_grep "$CA" 'preferredDuringSchedulingIgnoredDuringExecution' "cluster-autoscaler zone rule stays preferred"
need_not_grep "$CA" 'DoNotSchedule' "cluster-autoscaler zone rule is not DoNotSchedule"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'Do not taint a kind or minikube node' "ADR refuses a local taint"
need_grep "$ADR" 'A toleration does not require the taint' "ADR says a toleration is not a taint"
need_grep "$ADR" 'Required zone anti-affinity is not the follow-up' "ADR does not require the scaler zone rule"
need_grep "$ADR" 'aws-node' "ADR names aws-node"
need_grep "$ADR" 'kube-proxy' "ADR names kube-proxy"

python3 - "$MODULE" "$JSON" "$PATCH" "$ROOT_MAIN" <<'PY'
import json, pathlib, sys
import yaml

module = pathlib.Path(sys.argv[1]).read_text()
root = pathlib.Path(sys.argv[4]).read_text()
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

code = code_only(module)
root_code = code_only(root)

check('addon_version' not in code, "module code does not pin addon_version")
check('service_account_role_arn' not in code, "module code does not set a CNI role")
check('overrideRepository' not in code and 'nameOverride' not in code,
      "module code does not override the addon image or name")
check(code.count('addon_name') == 1, "module code names one addon")
check('addon_name' in code and '"vpc-cni"' in code, "the one addon is vpc-cni")
check('"kube-proxy"' not in code, "module code does not create a kube-proxy addon")
check('configuration_values' not in code_only(pathlib.Path(sys.argv[3]).read_text()),
      "kube-proxy patch is not an addon configuration_values document")

exact = {
    "key": "computerpets/node-pool",
    "operator": "Equal",
    "value": "api",
    "effect": "NoSchedule",
}
exists = {"operator": "Exists"}
try:
    doc = json.loads(pathlib.Path(sys.argv[2]).read_text())
except json.JSONDecodeError as exc:
    doc = None
    check(False, f"vpc-cni configuration JSON parses ({exc})")

if isinstance(doc, dict):
    check(list(doc.keys()) == ["tolerations"], "vpc-cni document has only tolerations")
    tols = doc.get("tolerations")
    check(tols == [exists, exact], "vpc-cni tolerations are Exists then the exact API pool entry")
    blob = json.dumps(doc)
    check("NoExecute" not in blob, "vpc-cni document does not set NoExecute")
    check("PreferNoSchedule" not in blob, "vpc-cni document does not set PreferNoSchedule")
    check("overrideRepository" not in blob and "image" not in blob,
          "vpc-cni document does not name an image")
else:
    check(False, "vpc-cni configuration is a JSON object")

try:
    patch = yaml.safe_load(pathlib.Path(sys.argv[3]).read_text())
except yaml.YAMLError as exc:
    patch = None
    check(False, f"kube-proxy patch parses ({exc})")

if isinstance(patch, dict):
    meta = patch.get("metadata") or {}
    spec = (((patch.get("spec") or {}).get("template") or {}).get("spec") or {})
    tols = spec.get("tolerations")
    check(patch.get("kind") == "DaemonSet", "kube-proxy patch is a DaemonSet")
    check(meta.get("name") == "kube-proxy", "kube-proxy patch names kube-proxy")
    check(meta.get("namespace") == "kube-system", "kube-proxy patch targets kube-system")
    check(list(spec.keys()) == ["tolerations"], "kube-proxy patch pod spec is only tolerations")
    check(tols == [exact], "kube-proxy patch toleration is the exact API pool entry")
    check("containers" not in spec, "kube-proxy patch does not set containers")
    raw = pathlib.Path(sys.argv[3]).read_text()
    check("image:" not in raw, "kube-proxy patch does not name an image")
    check("operator: Exists" not in raw, "kube-proxy patch does not replace the list with Exists")
else:
    check(False, "kube-proxy patch is a YAML object")

check('module "system_daemons"' in root_code, "root code calls the system daemon module")
check("depends_on = [module.system_daemons]" in root_code,
      "root code orders the node pool after the daemon module")
check(root_code.count('source = "./modules/system_daemons"') == 1,
      "root code has one system daemon module")

if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
