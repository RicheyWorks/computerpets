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
  cp "${ROOT}/docs/adr/0086-metrics-server-kubelet-ca.md" \
    "${dest}/docs/adr/0086-metrics-server-kubelet-ca.md"
  cp "${ROOT}/docs/adr/0087-metrics-server-serving-cert.md" \
    "${dest}/docs/adr/0087-metrics-server-serving-cert.md"
  cp "${ROOT}/docs/adr/0088-metrics-server-zone-spread.md" \
    "${dest}/docs/adr/0088-metrics-server-zone-spread.md"
  cp "${ROOT}/docs/adr/0089-metrics-server-node-pool.md" \
    "${dest}/docs/adr/0089-metrics-server-node-pool.md"
  mkdir -p "${dest}/deploy/terraform/modules/node_pool"
  cp "${ROOT}/deploy/terraform/modules/node_pool/main.tf" \
    "${dest}/deploy/terraform/modules/node_pool/main.tf"
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

copy_tree "${BROKEN}"
# Without the flag, kubelet verification falls back to the in-cluster CA.
sed -i '/--kubelet-certificate-authority=/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the kubelet CA flag is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# An optional volume starts the pod with no CA file.
sed -i 's/optional: false/optional: true/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the kubelet CA volume is optional" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# hostPath is not an operator ConfigMap or Secret.
sed -i '/name: tmp-dir/a\        hostPath:\n          path: /etc/kubernetes/pki' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the kubelet CA is a hostPath" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# This repo does not vendor the trust anchor.
printf '\nca.crt: |\n  -----BEGIN CERTIFICATE-----\n  MIIB\n' \
  >> "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when a CA certificate is vendored" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# A Secret with the same name, key, and optional: false is the equivalent source.
sed -i \
  -e 's/configMap:/secret:/' \
  -e 's/name: metrics-server-kubelet-ca/secretName: metrics-server-kubelet-ca/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 0 "check passes when the kubelet CA volume is a Secret" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# The APIService skip is the hop this gate exists to keep off.
sed -i '/groupPriorityMinimum: 100/a\  insecureSkipTLSVerify: true' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when APIService TLS verification is skipped" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# Without the serving cert flag, the process can mint a cert in /tmp again.
sed -i '/--tls-cert-file=/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the serving cert flag is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# One flag without the other is not a wired serving certificate.
sed -i '/--tls-private-key-file=/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the serving key flag is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# A ConfigMap name is not the required Secret.
sed -i 's/secretName: metrics-server-serving/name: metrics-server-serving/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the serving cert is not Secret metrics-server-serving" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# caBundle in this file would be a vendored trust anchor.
sed -i '/groupPriorityMinimum: 100/a\  caBundle: LS0tLS1CRUdJTi' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when an APIService CA bundle is committed" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# Hostname anti-affinity alone still packs both pods into one zone.
sed -i '/topologyKey: topology.kubernetes.io\/zone/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the zone topology key is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# DoNotSchedule leaves the second pod Pending on a single-zone cluster.
sed -i 's/whenUnsatisfiable: ScheduleAnyway/whenUnsatisfiable: DoNotSchedule/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when zone spread is DoNotSchedule" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# minDomains is enforced only with a hard action and strands a smaller cluster.
sed -i '/whenUnsatisfiable: ScheduleAnyway/a\        minDomains: 2' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when zone spread sets minDomains" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# Without the pool label, linux nodes outside the API groups count again.
sed -i '/computerpets\/node-pool: api/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when the pool nodeSelector is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# Ignore counts every node, including linux nodes outside the selector.
sed -i 's/nodeAffinityPolicy: Honor/nodeAffinityPolicy: Ignore/' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when nodeAffinityPolicy is Ignore" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# A missing policy is not the fail-closed Honor contract.
sed -i '/nodeAffinityPolicy: Honor/d' \
  "${BROKEN}/deploy/k8s/metrics-server.yaml"
assert_exit 1 "check fails when nodeAffinityPolicy is removed" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

copy_tree "${BROKEN}"
# The addon and the node group must name the same label value.
sed -i 's/"computerpets\/node-pool" = "api"/"computerpets\/node-pool" = "other"/' \
  "${BROKEN}/deploy/terraform/modules/node_pool/main.tf"
assert_exit 1 "check fails when the node pool label value drifts" \
  "${BROKEN}/deploy/k8s/check-metrics-server.sh"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
