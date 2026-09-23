#!/usr/bin/env bash
# Meta-tests for check-metrics-server-kubelet-san.sh (no cluster, no cloud account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/check-metrics-server-kubelet-san.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ms-san-test-out.$$ 2>/tmp/cp-ms-san-test-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ms-san-test-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ms-san-test-err.$$ || true
  fi
  rm -f /tmp/cp-ms-san-test-out.$$ /tmp/cp-ms-san-test-err.$$
}

copy_tree() {
  local dest="$1"
  rm -rf "${dest}"
  mkdir -p "${dest}/deploy/k8s" "${dest}/docs/adr"
  cp -a "${ROOT}/deploy/k8s/." "${dest}/deploy/k8s/"
  cp "${ROOT}/docs/adr/0113-metrics-server-kubelet-san.md" \
    "${dest}/docs/adr/0113-metrics-server-kubelet-san.md"
  cp "${ROOT}/docs/adr/0112-metrics-server-kubelet-ca-chain.md" \
    "${dest}/docs/adr/0112-metrics-server-kubelet-ca-chain.md"
  chmod +x "${dest}/deploy/k8s/check-metrics-server-kubelet-san.sh"
  chmod +x "${dest}/deploy/k8s/metrics-server-kubelet-san.sh"
}

chmod +x "${SCRIPT}"
chmod +x "${ROOT}/deploy/k8s/metrics-server-kubelet-san.sh"
assert_exit 0 "check-metrics-server-kubelet-san.sh passes on the real tree" "${SCRIPT}"

BROKEN="$(mktemp -d)"
cleanup() { rm -rf "${BROKEN}"; }
trap cleanup EXIT

copy_tree "${BROKEN}"
sed -i 's/def san_covers(dial, ips, dns_names):/def san_covers(dial, ips, dns_names):\n    return True/' \
  "${BROKEN}/deploy/k8s/metrics-server-kubelet-san.sh"
assert_exit 1 "check fails when the SAN check is skipped" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-san.sh"

copy_tree "${BROKEN}"
sed -i 's/DIAL_ORDER = ("InternalIP", "ExternalIP", "Hostname")/DIAL_ORDER = ("ExternalIP", "InternalIP", "Hostname")/' \
  "${BROKEN}/deploy/k8s/metrics-server-kubelet-san.sh"
assert_exit 1 "check fails when the dial tuple prefers ExternalIP" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-san.sh"

copy_tree "${BROKEN}"
sed -i '/^  cmd_verify "${dir}"$/d' \
  "${BROKEN}/deploy/k8s/metrics-server-kubelet-san.sh"
assert_exit 1 "check fails when apply skips verify" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-san.sh"

copy_tree "${BROKEN}"
sed -i 's/\*kind\*|\*minikube\*|""/*nomatch*/' \
  "${BROKEN}/deploy/k8s/metrics-server-kubelet-san.sh"
assert_exit 1 "check fails when kind and minikube are no longer refused" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-san.sh"

copy_tree "${BROKEN}"
sed -i 's/!= "1"/!= "never"/' \
  "${BROKEN}/deploy/k8s/metrics-server-kubelet-san.sh"
assert_exit 1 "check fails when apply no longer requires the opt-in" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-san.sh"

copy_tree "${BROKEN}"
sed -i '/--metric-resolution=15s/a\        - --kubelet-insecure-tls' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when kubelet TLS verification is skipped" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-san.sh"

copy_tree "${BROKEN}"
sed -i 's/InternalIP,ExternalIP,Hostname/Hostname,InternalIP,ExternalIP/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the manifest dial order changes" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-san.sh"

copy_tree "${BROKEN}"
sed -i '/--kubelet-certificate-authority=/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the kubelet CA flag is dropped" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-san.sh"

copy_tree "${BROKEN}"
sed -i '/- service.yaml/a\  - metrics-server.yaml' \
  "${BROKEN}/deploy/k8s/kustomization.yaml"
assert_exit 1 "check fails when kustomize would apply metrics-server" \
  "${BROKEN}/deploy/k8s/check-metrics-server-kubelet-san.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
