#!/usr/bin/env bash
# Meta-tests for check-waf-gate.sh (no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/terraform/check-waf-gate.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-waf-check-out.$$ 2>/tmp/cp-waf-check-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-waf-check-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-waf-check-err.$$ || true
  fi
  rm -f /tmp/cp-waf-check-out.$$ /tmp/cp-waf-check-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-waf-gate.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

mkdir -p "${BROKEN}/src/main/java/com/enterprisepet/config"
mkdir -p "${BROKEN}/deploy/terraform/modules/waf"
mkdir -p "${BROKEN}/deploy/terraform/modules/cdn"
mkdir -p "${BROKEN}/deploy/k8s"
cp "${ROOT}/src/main/java/com/enterprisepet/config/RateLimitingFilter.java" \
  "${BROKEN}/src/main/java/com/enterprisepet/config/RateLimitingFilter.java"
cp "${ROOT}/deploy/terraform/modules/waf/main.tf" \
  "${BROKEN}/deploy/terraform/modules/waf/main.tf"
cp "${ROOT}/deploy/terraform/modules/cdn/main.tf" \
  "${BROKEN}/deploy/terraform/modules/cdn/main.tf"
cp "${ROOT}/deploy/k8s/ingress.yaml" "${BROKEN}/deploy/k8s/ingress.yaml"
cp "${ROOT}/deploy/terraform/variables.tf" "${BROKEN}/deploy/terraform/variables.tf"
cp "${ROOT}/deploy/terraform/main.tf" "${BROKEN}/deploy/terraform/main.tf"
# Drift the JVM bucket without updating the ACL. The gate must fail.
sed -i 's#new Rule("/api/verify/",   "verify",    10, Duration.ofMinutes(1))#new Rule("/api/verify/",   "verify",    11, Duration.ofMinutes(1))#' \
  "${BROKEN}/src/main/java/com/enterprisepet/config/RateLimitingFilter.java"
cp "${SCRIPT}" "${BROKEN}/deploy/terraform/check-waf-gate.sh"
chmod +x "${BROKEN}/deploy/terraform/check-waf-gate.sh"

assert_exit 1 "check fails when the verify bucket drifts from the ACL" \
  "${BROKEN}/deploy/terraform/check-waf-gate.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
