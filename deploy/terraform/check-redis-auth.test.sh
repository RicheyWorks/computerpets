#!/usr/bin/env bash
# Meta-tests for check-redis-auth.sh (no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/terraform/check-redis-auth.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-redis-auth-out.$$ 2>/tmp/cp-redis-auth-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-redis-auth-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-redis-auth-err.$$ || true
  fi
  rm -f /tmp/cp-redis-auth-out.$$ /tmp/cp-redis-auth-err.$$
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-redis-auth.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

mkdir -p "${BROKEN}/src/main/java/com/enterprisepet/config"
mkdir -p "${BROKEN}/src/main/resources"
mkdir -p "${BROKEN}/deploy/terraform/modules/redis"
mkdir -p "${BROKEN}/deploy/k8s"
cp "${ROOT}/src/main/java/com/enterprisepet/config/RateLimitConfiguration.java" \
  "${BROKEN}/src/main/java/com/enterprisepet/config/RateLimitConfiguration.java"
cp "${ROOT}/src/main/java/com/enterprisepet/config/RateLimitProperties.java" \
  "${BROKEN}/src/main/java/com/enterprisepet/config/RateLimitProperties.java"
cp "${ROOT}/src/main/java/com/enterprisepet/config/ProductionProfileGuard.java" \
  "${BROKEN}/src/main/java/com/enterprisepet/config/ProductionProfileGuard.java"
cp "${ROOT}/src/main/java/com/enterprisepet/config/SecretFileEnvironmentPostProcessor.java" \
  "${BROKEN}/src/main/java/com/enterprisepet/config/SecretFileEnvironmentPostProcessor.java"
cp "${ROOT}/src/main/resources/application.yml" "${BROKEN}/src/main/resources/application.yml"
cp "${ROOT}/deploy/terraform/modules/redis/main.tf" \
  "${BROKEN}/deploy/terraform/modules/redis/main.tf"
cp "${ROOT}/deploy/terraform/variables.tf" "${BROKEN}/deploy/terraform/variables.tf"
cp "${ROOT}/deploy/terraform/outputs.tf" "${BROKEN}/deploy/terraform/outputs.tf"
cp "${ROOT}/deploy/terraform/terraform.tfvars.example" \
  "${BROKEN}/deploy/terraform/terraform.tfvars.example"
cp "${ROOT}/deploy/k8s/redis.yaml" "${BROKEN}/deploy/k8s/redis.yaml"
cp "${ROOT}/docker-compose.yml" "${BROKEN}/docker-compose.yml"
# Drift the app URI off TLS without updating the module. The gate must fail.
sed -i 's/withSsl(true)/withSsl(false)/' \
  "${BROKEN}/src/main/java/com/enterprisepet/config/RateLimitConfiguration.java"
cp "${SCRIPT}" "${BROKEN}/deploy/terraform/check-redis-auth.sh"
chmod +x "${BROKEN}/deploy/terraform/check-redis-auth.sh"

assert_exit 1 "check fails when the Lettuce URI drops TLS" \
  "${BROKEN}/deploy/terraform/check-redis-auth.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
