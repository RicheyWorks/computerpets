#!/usr/bin/env bash
# Meta-tests for check-managed-stores.sh (no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/terraform/check-managed-stores.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-tf-check-out.$$ 2>/tmp/cp-tf-check-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-tf-check-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-tf-check-err.$$ || true
  fi
  rm -f /tmp/cp-tf-check-out.$$ /tmp/cp-tf-check-err.$$
}

chmod +x "${SCRIPT}"

# Happy path: full tree green
assert_exit 0 "check-managed-stores.sh passes on the real tree" "${SCRIPT}"

# Broken tree: missing deny-safe validation should fail
BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

mkdir -p "${BROKEN}/deploy/terraform/modules/postgres"
mkdir -p "${BROKEN}/deploy/terraform/modules/redis"
mkdir -p "${BROKEN}/deploy/terraform/modules/secrets"
mkdir -p "${BROKEN}/deploy/terraform/modules/cdn"
mkdir -p "${BROKEN}/deploy/terraform/modules/waf"
mkdir -p "${BROKEN}/deploy/k8s"

# Minimal stubs that omit the public-access refusal — must fail.
for f in main.tf outputs.tf versions.tf providers.tf README.md \
  terraform.tfvars.example configmap-managed.example.yaml \
  modules/postgres/main.tf modules/redis/main.tf modules/secrets/main.tf \
  modules/cdn/main.tf modules/waf/main.tf
do
  echo "# stub" > "${BROKEN}/deploy/terraform/${f}"
done
echo "default = true" > "${BROKEN}/deploy/terraform/variables.tf"
echo "# no remoteRef keys" > "${BROKEN}/deploy/k8s/external-secret.example.yaml"
cp "${SCRIPT}" "${BROKEN}/deploy/terraform/check-managed-stores.sh"
chmod +x "${BROKEN}/deploy/terraform/check-managed-stores.sh"

assert_exit 1 "check fails when deny-safe validations are missing" \
  "${BROKEN}/deploy/terraform/check-managed-stores.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
