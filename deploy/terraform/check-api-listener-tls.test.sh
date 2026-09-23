#!/usr/bin/env bash
# Meta-tests for check-api-listener-tls.sh (no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/terraform/check-api-listener-tls.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-api-tls-out.$$ 2>/tmp/cp-api-tls-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-api-tls-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-api-tls-err.$$ || true
  fi
  rm -f /tmp/cp-api-tls-out.$$ /tmp/cp-api-tls-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-api-listener-tls.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

mkdir -p "${BROKEN}/src/main/java/com/enterprisepet/config"
mkdir -p "${BROKEN}/src/main/resources"
mkdir -p "${BROKEN}/deploy/terraform/modules/api_listener"
mkdir -p "${BROKEN}/deploy/k8s"
cp "${ROOT}/src/main/java/com/enterprisepet/config/ApiListenerTls.java" \
  "${BROKEN}/src/main/java/com/enterprisepet/config/ApiListenerTls.java"
cp "${ROOT}/src/main/java/com/enterprisepet/config/ProductionProfileGuard.java" \
  "${BROKEN}/src/main/java/com/enterprisepet/config/ProductionProfileGuard.java"
cp "${ROOT}/src/main/resources/application.yml" "${BROKEN}/src/main/resources/application.yml"
cp "${ROOT}/src/main/resources/application-prod.yml" "${BROKEN}/src/main/resources/application-prod.yml"
cp "${ROOT}/deploy/k8s/ingress.yaml" "${BROKEN}/deploy/k8s/ingress.yaml"
cp "${ROOT}/deploy/k8s/ingress-tls.yaml" "${BROKEN}/deploy/k8s/ingress-tls.yaml"
cp "${ROOT}/deploy/k8s/kustomization.yaml" "${BROKEN}/deploy/k8s/kustomization.yaml"
cp "${ROOT}/deploy/k8s/configmap.yaml" "${BROKEN}/deploy/k8s/configmap.yaml"
cp "${ROOT}/deploy/terraform/modules/api_listener/main.tf" \
  "${BROKEN}/deploy/terraform/modules/api_listener/main.tf"
cp "${ROOT}/deploy/terraform/variables.tf" "${BROKEN}/deploy/terraform/variables.tf"
cp "${ROOT}/deploy/terraform/outputs.tf" "${BROKEN}/deploy/terraform/outputs.tf"
cp "${ROOT}/deploy/terraform/main.tf" "${BROKEN}/deploy/terraform/main.tf"
cp "${ROOT}/deploy/terraform/terraform.tfvars.example" \
  "${BROKEN}/deploy/terraform/terraform.tfvars.example"
cp "${ROOT}/deploy/terraform/configmap-managed.example.yaml" \
  "${BROKEN}/deploy/terraform/configmap-managed.example.yaml"
cp "${ROOT}/docker-compose.yml" "${BROKEN}/docker-compose.yml"
# Drift the redirect into a cleartext forward. The gate must fail.
sed -i 's/cleartext-forward=false/cleartext-forward=true/' \
  "${BROKEN}/deploy/terraform/modules/api_listener/main.tf"
cp "${SCRIPT}" "${BROKEN}/deploy/terraform/check-api-listener-tls.sh"
chmod +x "${BROKEN}/deploy/terraform/check-api-listener-tls.sh"

assert_exit 1 "check fails when the module claims a cleartext forward" \
  "${BROKEN}/deploy/terraform/check-api-listener-tls.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
