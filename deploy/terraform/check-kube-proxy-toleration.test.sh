#!/usr/bin/env bash
# Meta-tests for check-kube-proxy-toleration.sh (no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/terraform/check-kube-proxy-toleration.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-kube-proxy-out.$$ 2>/tmp/cp-kube-proxy-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-kube-proxy-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-kube-proxy-err.$$ || true
  fi
  rm -f /tmp/cp-kube-proxy-out.$$ /tmp/cp-kube-proxy-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-kube-proxy-toleration.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

seed() {
  rm -rf "${BROKEN}"
  mkdir -p "${BROKEN}/deploy/terraform/modules/system_daemons"
  mkdir -p "${BROKEN}/deploy/k8s"
  mkdir -p "${BROKEN}/docs/adr"
  cp "${ROOT}/deploy/terraform/modules/system_daemons/main.tf" \
    "${BROKEN}/deploy/terraform/modules/system_daemons/main.tf"
  cp "${ROOT}/deploy/terraform/modules/system_daemons/versions.tf" \
    "${BROKEN}/deploy/terraform/modules/system_daemons/versions.tf"
  cp "${ROOT}/deploy/terraform/modules/system_daemons/reassert-kube-proxy-toleration.sh" \
    "${BROKEN}/deploy/terraform/modules/system_daemons/reassert-kube-proxy-toleration.sh"
  cp "${ROOT}/deploy/terraform/modules/system_daemons/kube-proxy-api-pool-toleration.yaml" \
    "${BROKEN}/deploy/terraform/modules/system_daemons/kube-proxy-api-pool-toleration.yaml"
  cp "${ROOT}/deploy/terraform/main.tf" "${BROKEN}/deploy/terraform/main.tf"
  cp "${ROOT}/deploy/terraform/variables.tf" "${BROKEN}/deploy/terraform/variables.tf"
  cp "${ROOT}/deploy/terraform/versions.tf" "${BROKEN}/deploy/terraform/versions.tf"
  cp "${ROOT}/deploy/terraform/README.md" "${BROKEN}/deploy/terraform/README.md"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${BROKEN}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/deploy/k8s/metrics-server.yaml" "${BROKEN}/deploy/k8s/metrics-server.yaml"
  cp "${ROOT}/docs/adr/0097-kube-proxy-toleration-hook.md" \
    "${BROKEN}/docs/adr/0097-kube-proxy-toleration-hook.md"
  cp "${SCRIPT}" "${BROKEN}/deploy/terraform/check-kube-proxy-toleration.sh"
  chmod +x "${BROKEN}/deploy/terraform/check-kube-proxy-toleration.sh"
  chmod +x "${BROKEN}/deploy/terraform/modules/system_daemons/reassert-kube-proxy-toleration.sh"
}

HOOK="${BROKEN}/deploy/terraform/modules/system_daemons/reassert-kube-proxy-toleration.sh"
MOD="${BROKEN}/deploy/terraform/modules/system_daemons/main.tf"
VAR="${BROKEN}/deploy/terraform/variables.tf"
VER="${BROKEN}/deploy/terraform/versions.tf"
KUSTOM="${BROKEN}/deploy/k8s/kustomization.yaml"
CHECK="${BROKEN}/deploy/terraform/check-kube-proxy-toleration.sh"

seed
python3 - "${HOOK}" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
path.write_text(path.read_text().replace('BLANKET_EXISTS = "Exists"', 'BLANKET_EXISTS = "Present"', 1))
PY
assert_exit 1 "check fails when blanket Exists is no longer recognized" "${CHECK}"

seed
python3 - "${HOOK}" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
path.write_text(path.read_text().replace("kind|kind-*|minikube|minikube-*", "kind|kind-*"))
PY
assert_exit 1 "check fails when the minikube refusal is dropped" "${CHECK}"

seed
python3 - "${VAR}" <<'PY'
import pathlib, re, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
text2, n = re.subn(
    r'(variable "reassert_kube_proxy_toleration" \{[^}]*default\s*=\s*)false',
    r"\1true",
    text,
    count=1,
    flags=re.S,
)
if n != 1:
    raise SystemExit("did not rewrite the default")
path.write_text(text2)
PY
assert_exit 1 "check fails when the reassert flag defaults true" "${CHECK}"

seed
python3 - "${MOD}" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
path.write_text(path.read_text().replace('data "external" "kube_proxy_toleration"', 'data "external" "removed_probe"'))
PY
assert_exit 1 "check fails when the plan probe data source is removed" "${CHECK}"

seed
python3 - "${MOD}" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
path.write_text(path.read_text().replace("--live", "--skip-live"))
PY
assert_exit 1 "check fails when apply no longer runs --live" "${CHECK}"

seed
cat >> "${MOD}" <<'EOF'

resource "aws_eks_addon" "kube_proxy" {
  cluster_name         = var.cluster_name
  addon_name           = "kube-proxy"
  configuration_values = jsonencode({ tolerations = [] })
}
EOF
assert_exit 1 "check fails when kube-proxy configuration_values is sent" "${CHECK}"

seed
printf '\n  - reassert-kube-proxy-toleration.sh\n' >> "${KUSTOM}"
assert_exit 1 "check fails when the kustomization lists the hook" "${CHECK}"

seed
python3 - "${VER}" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
path.write_text(path.read_text().replace("hashicorp/external", "hashicorp/removed-external"))
PY
assert_exit 1 "check fails when the external provider is dropped" "${CHECK}"

seed
printf '\nkubectl taint nodes --all computerpets/node-pool=api:NoSchedule\n' >> "${HOOK}"
assert_exit 1 "check fails when the hook taints a node" "${CHECK}"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
