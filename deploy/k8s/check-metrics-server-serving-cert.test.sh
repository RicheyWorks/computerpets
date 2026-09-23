#!/usr/bin/env bash
# Meta-tests for check-metrics-server-serving-cert.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-metrics-server-serving-cert.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ms-serve-test-out.$$ 2>/tmp/cp-ms-serve-test-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ms-serve-test-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ms-serve-test-err.$$ || true
  fi
  rm -f /tmp/cp-ms-serve-test-out.$$ /tmp/cp-ms-serve-test-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0111-metrics-server-serving-cert-chain.md" \
    "${dest}/docs/adr/0111-metrics-server-serving-cert-chain.md"
  cp "${ROOT}/docs/adr/0087-metrics-server-serving-cert.md" \
    "${dest}/docs/adr/0087-metrics-server-serving-cert.md"
  chmod +x "${dest}/deploy/k8s/check-metrics-server-serving-cert.sh"
  chmod +x "${dest}/deploy/k8s/metrics-server-serving-cert.sh"
}

chmod +x "${SCRIPT}"
chmod +x "${ROOT}/deploy/k8s/metrics-server-serving-cert.sh"
assert_exit 0 "check-metrics-server-serving-cert.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
sed -i 's/SERVING_SAN="metrics-server.kube-system.svc"/SERVING_SAN="wrong.example"/' \
  "${BROKEN}/deploy/k8s/metrics-server-serving-cert.sh"
assert_exit 1 "check fails when the minted SAN is not metrics-server.kube-system.svc" \
  "${BROKEN}/deploy/k8s/check-metrics-server-serving-cert.sh"

copy_tree "${BROKEN}"
sed -i '/^  cmd_verify "${dir}"$/d' \
  "${BROKEN}/deploy/k8s/metrics-server-serving-cert.sh"
assert_exit 1 "check fails when apply skips verify" \
  "${BROKEN}/deploy/k8s/check-metrics-server-serving-cert.sh"

copy_tree "${BROKEN}"
sed -i 's/\*kind\*|\*minikube\*|""/*nomatch*/' \
  "${BROKEN}/deploy/k8s/metrics-server-serving-cert.sh"
assert_exit 1 "check fails when kind and minikube are no longer refused" \
  "${BROKEN}/deploy/k8s/check-metrics-server-serving-cert.sh"

copy_tree "${BROKEN}"
sed -i 's/!= "1"/!= "never"/' \
  "${BROKEN}/deploy/k8s/metrics-server-serving-cert.sh"
assert_exit 1 "check fails when apply no longer requires the opt-in" \
  "${BROKEN}/deploy/k8s/check-metrics-server-serving-cert.sh"

copy_tree "${BROKEN}"
sed -i 's/if required not in names:/if False and required not in names:/' \
  "${BROKEN}/deploy/k8s/metrics-server-serving-cert.sh"
assert_exit 1 "check fails when SAN verification is disabled" \
  "${BROKEN}/deploy/k8s/check-metrics-server-serving-cert.sh"

copy_tree "${BROKEN}"
sed -i '/versionPriority: 100/a\  insecureSkipTLSVerify: true' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when APIService verification is skipped" \
  "${BROKEN}/deploy/k8s/check-metrics-server-serving-cert.sh"

copy_tree "${BROKEN}"
sed -i '/--metric-resolution=15s/a\        - --kubelet-insecure-tls' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when kubelet TLS verification is skipped" \
  "${BROKEN}/deploy/k8s/check-metrics-server-serving-cert.sh"

copy_tree "${BROKEN}"
sed -i '/groupPriorityMinimum: 100/a\  caBundle: LS0tLS1CRUdJTi' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when caBundle is vendored in the manifest" \
  "${BROKEN}/deploy/k8s/check-metrics-server-serving-cert.sh"

copy_tree "${BROKEN}"
sed -i '/- service.yaml/a\  - metrics-server.yaml' \
  "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomize would apply metrics-server" \
  "${BROKEN}/deploy/k8s/check-metrics-server-serving-cert.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
