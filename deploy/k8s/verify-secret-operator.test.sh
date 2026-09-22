#!/usr/bin/env bash
# Unit checks for verify-secret-operator.sh (no cluster, no network).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/verify-secret-operator.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-secret-op-out.$$ 2>/tmp/cp-secret-op-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-secret-op-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-secret-op-err.$$ || true
  fi
  rm -f /tmp/cp-secret-op-out.$$ /tmp/cp-secret-op-err.$$
}

TMP="$(mktemp -d)"
cleanup() { rm -rf "${TMP}"; }
trap cleanup EXIT

# Repo contract (no args) → ok
assert_exit 0 "repo contract accepts" \
  env -u COMPUTERPETS_ALLOW_PLAIN_SECRET "${SCRIPT}"

# ALLOW_PLAIN skips even without manifests
assert_exit 0 "ALLOW_PLAIN skips" \
  env COMPUTERPETS_ALLOW_PLAIN_SECRET=1 "${SCRIPT}" "${TMP}/missing.yaml"

# Plain stringData Secret alone → refuse
cat >"${TMP}/plain-secret.yaml" <<'EOF'
apiVersion: v1
kind: Secret
metadata:
  name: computerpets-secrets
  namespace: computerpets
type: Opaque
stringData:
  LICENSE_SECRET_KEY: "hand-filled"
  JWT_SECRET_KEY: "hand-filled"
EOF
assert_exit 1 "plain stringData Secret refuses" \
  env -u COMPUTERPETS_ALLOW_PLAIN_SECRET "${SCRIPT}" "${TMP}/plain-secret.yaml"

# ExternalSecret alone → ok
cat >"${TMP}/eso.yaml" <<'EOF'
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: computerpets-secrets
  namespace: computerpets
spec:
  target:
    name: computerpets-secrets
  data:
    - secretKey: LICENSE_SECRET_KEY
      remoteRef:
        key: computerpets/LICENSE_SECRET_KEY
EOF
assert_exit 0 "ExternalSecret accepts" \
  env -u COMPUTERPETS_ALLOW_PLAIN_SECRET "${SCRIPT}" "${TMP}/eso.yaml"

# File-mount Deployment → ok
cat >"${TMP}/file-deploy.yaml" <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: computerpets-blue
spec:
  template:
    spec:
      containers:
        - name: computerpets
          env:
            - name: LICENSE_SECRET_KEY_FILE
              value: /var/run/secrets/computerpets/LICENSE_SECRET_KEY
            - name: JWT_SECRET_KEY_FILE
              value: /var/run/secrets/computerpets/JWT_SECRET_KEY
            - name: BUNDLE_SIGNING_KEY_FILE
              value: /var/run/secrets/computerpets/BUNDLE_SIGNING_KEY
            - name: ADMIN_API_KEY_FILE
              value: /var/run/secrets/computerpets/ADMIN_API_KEY
EOF
assert_exit 0 "file-mount Deployment accepts" \
  env -u COMPUTERPETS_ALLOW_PLAIN_SECRET "${SCRIPT}" "${TMP}/file-deploy.yaml"

# Empty / unrelated manifest → refuse
cat >"${TMP}/empty.yaml" <<'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: other
data:
  hello: world
EOF
assert_exit 1 "unrelated manifest refuses" \
  env -u COMPUTERPETS_ALLOW_PLAIN_SECRET "${SCRIPT}" "${TMP}/empty.yaml"

# Plain Secret + ExternalSecret together → ok (ESO wins attestation)
assert_exit 0 "plain Secret with ExternalSecret accepts" \
  env -u COMPUTERPETS_ALLOW_PLAIN_SECRET "${SCRIPT}" \
    "${TMP}/plain-secret.yaml" "${TMP}/eso.yaml"

echo ""
echo "${PASS} passed, ${FAIL} failed"
[ "${FAIL}" -eq 0 ]
