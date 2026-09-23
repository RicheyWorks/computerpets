#!/usr/bin/env bash
# Meta-tests for check-metrics-server.sh (no cluster, no kubectl apply).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-metrics-server.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ms-out.$$ 2>/tmp/cp-ms-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ms-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ms-err.$$ || true
  fi
  rm -f /tmp/cp-ms-out.$$ /tmp/cp-ms-err.$$
}

copy_tree() {
  local dest="$1"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0084-metrics-server.md" \
    "${dest}/docs/adr/0084-metrics-server.md"
  cp "${ROOT}/docs/adr/0085-metrics-server-ha.md" \
    "${dest}/docs/adr/0085-metrics-server-ha.md"
  cp "${SCRIPT}" "${dest}/deploy/k8s/check-metrics-server.sh"
  chmod +x "${dest}/deploy/k8s/check-metrics-server.sh"
}

chmod +x "${SCRIPT}"
assert_exit 0 "check-metrics-server.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
# Skipping kubelet TLS is the failure mode this gate exists to catch.
sed -i '/--metric-resolution=15s/a\        - --kubelet-insecure-tls' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when kubelet TLS verification is skipped" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# A floating tag is not the pinned upstream release.
sed -i 's|metrics-server:v0.9.0|metrics-server:latest|' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the image tag floats" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# Local apply must not install the addon on kind or minikube.
sed -i '/- service.yaml/a\  - metrics-server.yaml' \
  "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomize would apply metrics-server" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# One replica is the components.yaml shape this gate exists to reject.
sed -i 's/^  replicas: 2$/  replicas: 1/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the addon drops to one replica" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# A preference is not the upstream required anti-affinity.
sed -i '/podAntiAffinity:/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when pod anti-affinity is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
