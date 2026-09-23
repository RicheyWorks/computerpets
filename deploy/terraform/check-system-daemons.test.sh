#!/usr/bin/env bash
# Meta-tests for check-system-daemons.sh (no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/terraform/check-system-daemons.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-system-daemons-out.$$ 2>/tmp/cp-system-daemons-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-system-daemons-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-system-daemons-err.$$ || true
  fi
  rm -f /tmp/cp-system-daemons-out.$$ /tmp/cp-system-daemons-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-system-daemons.sh passes on the real tree" "${SCRIPT}"

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
  cp "${ROOT}/deploy/terraform/modules/system_daemons/vpc-cni-configuration-values.json" \
    "${BROKEN}/deploy/terraform/modules/system_daemons/vpc-cni-configuration-values.json"
  cp "${ROOT}/deploy/terraform/modules/system_daemons/kube-proxy-api-pool-toleration.yaml" \
    "${BROKEN}/deploy/terraform/modules/system_daemons/kube-proxy-api-pool-toleration.yaml"
  cp "${ROOT}/deploy/terraform/main.tf" "${BROKEN}/deploy/terraform/main.tf"
  cp "${ROOT}/deploy/terraform/README.md" "${BROKEN}/deploy/terraform/README.md"
  cp "${ROOT}/deploy/k8s/kustomization.yaml" "${BROKEN}/deploy/k8s/kustomization.yaml"
  cp "${ROOT}/deploy/k8s/cluster-autoscaler.yaml" "${BROKEN}/deploy/k8s/cluster-autoscaler.yaml"
  cp "${ROOT}/docs/adr/0096-system-daemon-api-pool-toleration.md" \
    "${BROKEN}/docs/adr/0096-system-daemon-api-pool-toleration.md"
  cp "${SCRIPT}" "${BROKEN}/deploy/terraform/check-system-daemons.sh"
  chmod +x "${BROKEN}/deploy/terraform/check-system-daemons.sh"
}

JSON="${BROKEN}/deploy/terraform/modules/system_daemons/vpc-cni-configuration-values.json"
PATCH="${BROKEN}/deploy/terraform/modules/system_daemons/kube-proxy-api-pool-toleration.yaml"
MOD="${BROKEN}/deploy/terraform/modules/system_daemons/main.tf"
MAIN="${BROKEN}/deploy/terraform/main.tf"
KUSTOM="${BROKEN}/deploy/k8s/kustomization.yaml"
CHECK="${BROKEN}/deploy/terraform/check-system-daemons.sh"

seed
python3 - "${JSON}" <<'PY'
import json, pathlib, sys
path = pathlib.Path(sys.argv[1])
doc = json.loads(path.read_text())
doc["tolerations"] = [item for item in doc["tolerations"] if item.get("operator") != "Equal"]
path.write_text(json.dumps(doc))
PY
assert_exit 1 "check fails when vpc-cni drops the Equal toleration" "${CHECK}"

seed
python3 - "${JSON}" <<'PY'
import json, pathlib, sys
path = pathlib.Path(sys.argv[1])
doc = json.loads(path.read_text())
doc["tolerations"][1]["effect"] = "NoExecute"
path.write_text(json.dumps(doc))
PY
assert_exit 1 "check fails when the vpc-cni effect is NoExecute" "${CHECK}"

seed
python3 - "${JSON}" <<'PY'
import json, pathlib, sys
path = pathlib.Path(sys.argv[1])
doc = json.loads(path.read_text())
doc["tolerations"][1]["operator"] = "Exists"
path.write_text(json.dumps(doc))
PY
assert_exit 1 "check fails when the keyed vpc-cni toleration uses Exists" "${CHECK}"

seed
python3 - "${JSON}" <<'PY'
import json, pathlib, sys
path = pathlib.Path(sys.argv[1])
doc = json.loads(path.read_text())
doc["env"] = {"ENABLE_PREFIX_DELEGATION": "true"}
path.write_text(json.dumps(doc))
PY
assert_exit 1 "check fails when vpc-cni configuration adds a second key" "${CHECK}"

seed
python3 - "${PATCH}" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
path.write_text(path.read_text().replace("operator: Equal", "operator: Exists"))
PY
assert_exit 1 "check fails when the kube-proxy patch uses Exists" "${CHECK}"

seed
printf '\n        image: public.ecr.aws/eks-distro/kubernetes/kube-proxy:v0\n' >> "${PATCH}"
assert_exit 1 "check fails when the kube-proxy patch names an image" "${CHECK}"

seed
sed -i '/depends_on = \[module.system_daemons\]/d' "${MAIN}"
assert_exit 1 "check fails when the node pool does not wait on the daemon module" "${CHECK}"

seed
sed -i '/addon_name[[:space:]]*=[[:space:]]*"vpc-cni"/a\  addon_version = "v1.0.0-eksbuild.1"' "${MOD}"
assert_exit 1 "check fails when the vpc-cni addon version is pinned" "${CHECK}"

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
printf '\n  - kube-proxy-api-pool-toleration.yaml\n' >> "${KUSTOM}"
assert_exit 1 "check fails when the kustomization lists the kube-proxy patch" "${CHECK}"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
