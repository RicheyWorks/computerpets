#!/usr/bin/env bash
# Meta-tests for check-metrics-server-kubelet-ca.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-metrics-server-kubelet-ca.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ms-kubelet-test-out.$$ 2>/tmp/cp-ms-kubelet-test-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ms-kubelet-test-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ms-kubelet-test-err.$$ || true
  fi
  rm -f /tmp/cp-ms-kubelet-test-out.$$ /tmp/cp-ms-kubelet-test-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0112-metrics-server-kubelet-ca-chain.md" \
    "${dest}/docs/adr/0112-metrics-server-kubelet-ca-chain.md"
  cp "${ROOT}/docs/adr/0086-metrics-server-kubelet-ca.md" \
    "${dest}/docs/adr/0086-metrics-server-kubelet-ca.md"
  cp "${ROOT}/docs/adr/0111-metrics-server-serving-cert-chain.md" \
    "${dest}/docs/adr/0111-metrics-server-serving-cert-chain.md"
  chmod +x "${dest}/deploy/k8s/check-metrics-server-kubelet-ca.sh"
  chmod +x "${dest}/deploy/k8s/metrics-server-kubelet-ca.sh"
}

chmod +x "${SCRIPT}"
chmod +x "${ROOT}/deploy/k8s/metrics-server-kubelet-ca.sh"
assert_exit 0 "check-metrics-server-kubelet-ca.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
sed -i 's/leaf_chains() {/leaf_chains() { return 0;/' \
  "${BROKEN}/deploy/k8s/metrics-server-kubelet-ca.sh"
assert_exit 1 "check fails when the chain check is skipped" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-ca.sh"

copy_tree "${BROKEN}"
sed -i '/^  cmd_verify "${dir}"$/d' \
  "${BROKEN}/deploy/k8s/metrics-server-kubelet-ca.sh"
assert_exit 1 "check fails when apply skips verify" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-ca.sh"

copy_tree "${BROKEN}"
sed -i 's/\*kind\*|\*minikube\*|""/*nomatch*/' \
  "${BROKEN}/deploy/k8s/metrics-server-kubelet-ca.sh"
assert_exit 1 "check fails when kind and minikube are no longer refused" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-ca.sh"

copy_tree "${BROKEN}"
sed -i 's/!= "1"/!= "never"/' \
  "${BROKEN}/deploy/k8s/metrics-server-kubelet-ca.sh"
assert_exit 1 "check fails when apply no longer requires the opt-in" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-ca.sh"

copy_tree "${BROKEN}"
sed -i '/--metric-resolution=15s/a\        - --kubelet-insecure-tls' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when kubelet TLS verification is skipped" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-ca.sh"

copy_tree "${BROKEN}"
sed -i '/--kubelet-certificate-authority=/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the kubelet CA flag is dropped" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-ca.sh"

copy_tree "${BROKEN}"
sed -i '/- service.yaml/a\  - metrics-server.yaml' \
  "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomize would apply metrics-server" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-ca.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
