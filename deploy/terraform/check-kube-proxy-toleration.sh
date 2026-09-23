#!/usr/bin/env bash
# ADR 0097 — kube-proxy API pool toleration stays covered, or the hook
# fails closed. No cloud account. Does not terraform apply. Does not
# kubectl. Kind and minikube stay untainted. vpc-cni configuration_values
# stay ADR 0096.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MODULE="${ROOT}/deploy/terraform/modules/system_daemons/main.tf"
MOD_VER="${ROOT}/deploy/terraform/modules/system_daemons/versions.tf"
HOOK="${ROOT}/deploy/terraform/modules/system_daemons/reassert-kube-proxy-toleration.sh"
PATCH="${ROOT}/deploy/terraform/modules/system_daemons/kube-proxy-api-pool-toleration.yaml"
ROOT_MAIN="${ROOT}/deploy/terraform/main.tf"
ROOT_VAR="${ROOT}/deploy/terraform/variables.tf"
ROOT_VER="${ROOT}/deploy/terraform/versions.tf"
README="${ROOT}/deploy/terraform/README.md"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
CA="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
METRICS="${ROOT}/deploy/k8s/metrics-server.yaml"
ADR="${ROOT}/docs/adr/0097-kube-proxy-toleration-hook.md"
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
  if grep -qE -e "$pattern" "$file"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file"))"; fi
}

need_not_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE -e "$pattern" "$file"; then bad "$name"
  else ok "$name"; fi
}

echo "== kube-proxy hook files =="
need_file "$MODULE"
need_file "$MOD_VER"
need_file "$HOOK"
need_file "$PATCH"
need_file "$ADR"
need_file "$ROOT_MAIN"
need_file "$ROOT_VAR"
need_file "$ROOT_VER"

echo "== hook is the durable path =="
need_grep "$MODULE" 'kube-proxy-hook=ADR-0097' "module names ADR 0097"
need_grep "$MODULE" 'kube-proxy-reassert-default=false' "module records the default off"
need_grep "$MODULE" 'coverage=keyless-Exists-or-exact-Equal' "module names the coverage rule"
need_grep "$MODULE" 'kind-minikube-hook=refused' "module refuses the hook on kind and minikube"
need_grep "$MODULE" 'data "external" "kube_proxy_toleration"' "plan probes with the external data source"
need_grep "$MODULE" 'reassert-kube-proxy-toleration.sh' "module points at the reassert script"
need_grep "$MODULE" '--probe' "probe is read-only"
need_grep "$MODULE" '--live' "apply reasserts with --live"
need_grep "$MODULE" 'terraform_data" "kube_proxy_toleration_reassert"' "reassert resource exists"
need_grep "$MODULE" 'triggers_replace' "reassert replaces when coverage or the patch changes"
need_grep "$MODULE" 'vpc-cni-configuration-values.json' "vpc-cni document path stays ADR 0096"
need_grep "$ROOT_MAIN" 'reassert_kube_proxy_toleration[[:space:]]*=[[:space:]]*var\.reassert_kube_proxy_toleration' "root passes the reassert flag"
need_grep "$ROOT_VER" 'hashicorp/external' "root declares the external provider"
need_grep "$MOD_VER" 'hashicorp/external' "module declares the external provider"
need_grep "$README" 'ADR 0097' "terraform README names ADR 0097"
need_grep "$README" 'reassert_kube_proxy_toleration=true' "README tells the keeper how to arm the hook"
need_grep "$README" 'Do not taint a kind or minikube node' "README refuses a local taint"
need_not_grep "$KUSTOM" 'reassert-kube-proxy-toleration' "kustomization does not run the hook"
need_not_grep "$KUSTOM" 'kube-proxy-api-pool-toleration' "kustomization does not apply the kube-proxy patch"
need_grep "$CA" 'preferredDuringSchedulingIgnoredDuringExecution' "cluster-autoscaler zone rule stays preferred"
need_not_grep "$CA" 'DoNotSchedule' "cluster-autoscaler zone rule is not DoNotSchedule"
need_grep "$METRICS" 'whenUnsatisfiable: ScheduleAnyway' "metrics-server zone spread stays ScheduleAnyway"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply Terraform"
need_grep "$ADR" 'Do not taint a kind or minikube node' "ADR refuses a local taint"
need_grep "$ADR" 'Required zone anti-affinity is not the follow-up' "ADR does not require the scaler zone rule"
need_grep "$HOOK" 'fail closed' "hook fails closed"
need_grep "$HOOK" 'minikube' "hook names minikube"
need_grep "$HOOK" 'kind-' "hook names a kind context"
need_grep "$HOOK" 'BLANKET_EXISTS' "hook names the blanket Exists operator"
need_not_grep "$HOOK" 'kubectl taint' "hook does not taint"
need_not_grep "$HOOK" 'configuration_values' "hook does not send addon values"

python3 - "$MODULE" "$ROOT_VAR" "$ROOT_MAIN" "$ROOT_VER" <<'PY'
import pathlib, re, sys

module = pathlib.Path(sys.argv[1]).read_text()
variables = pathlib.Path(sys.argv[2]).read_text()
root = pathlib.Path(sys.argv[3]).read_text()
versions = pathlib.Path(sys.argv[4]).read_text()
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

def var_default_false(text, name):
    match = re.search(
        r'variable "reassert_kube_proxy_toleration" \{([^}]*)\}',
        text,
        re.S,
    )
    if not match:
        return False
    return re.search(r"default\s*=\s*false", match.group(1)) is not None

check(var_default_false(variables, "root"), "root reassert flag defaults false")
check(var_default_false(module, "module"), "module reassert flag defaults false")
check(
    "reassert_kube_proxy_toleration   = var.reassert_kube_proxy_toleration" in root_code
    or "reassert_kube_proxy_toleration = var.reassert_kube_proxy_toleration" in root_code,
    "root code passes the reassert flag",
)
check('data "external" "kube_proxy_toleration"' in code, "module code probes with external data")
check(code.count("addon_name") == 1, "module code names one addon")
check('"kube-proxy"' not in code, "module code does not create a kube-proxy addon")
check("hashicorp/external" in versions, "root versions code names the external provider")
check("--live" in code and "--probe" in code, "module code has probe and live modes")
check("count = local.reassert ? 1 : 0" in code, "live probe count follows the flag and cluster name")

if failed:
    sys.exit(1)
PY

echo "== classifier self-test (no kubectl) =="
if [ -x "$HOOK" ] || chmod +x "$HOOK"; then
  if "$HOOK" --self-test; then
    ok "reassert script self-test"
  else
    bad "reassert script self-test"
  fi
else
  bad "reassert script is not executable"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
