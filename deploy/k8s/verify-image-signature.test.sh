#!/usr/bin/env bash
# Unit checks for verify-image-signature.sh (no network, stub cosign).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/verify-image-signature.sh"
PASS=0
FAIL=0

assert_exit() {
  local want="$1"
  local name="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-verify-out.$$ 2>/tmp/cp-verify-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    PASS=$((PASS + 1))
    echo "ok - ${name}"
  else
    FAIL=$((FAIL + 1))
    echo "not ok - ${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-verify-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-verify-err.$$ || true
  fi
  rm -f /tmp/cp-verify-out.$$ /tmp/cp-verify-err.$$
}

STUB_DIR="$(mktemp -d)"
cleanup() { rm -rf "${STUB_DIR}"; }
trap cleanup EXIT

# Fake cosign: exit 0 only when IMAGE looks signed; else 1.
cat >"${STUB_DIR}/cosign" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
# Last arg is the image ref.
IMAGE="${*: -1}"
if [ "${COSIGN_STUB_PASS:-0}" = "1" ]; then
  echo "stub: verified ${IMAGE}"
  exit 0
fi
echo "stub: no matching signature for ${IMAGE}" >&2
exit 1
EOF
chmod +x "${STUB_DIR}/cosign"

export COSIGN_BIN="${STUB_DIR}/cosign"
export PATH="${STUB_DIR}:${PATH}"

# Missing arg → refuse
assert_exit 1 "missing image refuses" env -u COMPUTERPETS_ALLOW_UNSIGNED "${SCRIPT}"

# Tag-only → refuse
assert_exit 1 "tag-only refuses" \
  env -u COMPUTERPETS_ALLOW_UNSIGNED "${SCRIPT}" "ghcr.io/richeyworks/computerpets:main"

# Unsigned digest (stub fails) → refuse
assert_exit 1 "missing signature refuses" \
  env -u COMPUTERPETS_ALLOW_UNSIGNED COSIGN_STUB_PASS=0 \
  "${SCRIPT}" "ghcr.io/richeyworks/computerpets@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

# Signed digest (stub passes) → ok
assert_exit 0 "matching signature accepts" \
  env -u COMPUTERPETS_ALLOW_UNSIGNED COSIGN_STUB_PASS=1 \
  "${SCRIPT}" "ghcr.io/richeyworks/computerpets@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"

# ALLOW_UNSIGNED skips cosign even for tag-only? No — digest still required.
assert_exit 1 "ALLOW_UNSIGNED still requires digest" \
  env COMPUTERPETS_ALLOW_UNSIGNED=1 \
  "${SCRIPT}" "ghcr.io/richeyworks/computerpets:local"

assert_exit 0 "ALLOW_UNSIGNED digest skips cosign" \
  env COMPUTERPETS_ALLOW_UNSIGNED=1 COSIGN_STUB_PASS=0 \
  "${SCRIPT}" "ghcr.io/richeyworks/computerpets@sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"

# Key path: missing key file → refuse
assert_exit 1 "missing COSIGN_KEY file refuses" \
  env -u COMPUTERPETS_ALLOW_UNSIGNED COMPUTERPETS_COSIGN_KEY="${STUB_DIR}/missing.pub" COSIGN_STUB_PASS=1 \
  "${SCRIPT}" "ghcr.io/richeyworks/computerpets@sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"

# Key path: present key + stub pass → ok
touch "${STUB_DIR}/cosign.pub"
assert_exit 0 "key path accepts when cosign passes" \
  env -u COMPUTERPETS_ALLOW_UNSIGNED COMPUTERPETS_COSIGN_KEY="${STUB_DIR}/cosign.pub" COSIGN_STUB_PASS=1 \
  "${SCRIPT}" "ghcr.io/richeyworks/computerpets@sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"

echo ""
echo "${PASS} passed, ${FAIL} failed"
[ "${FAIL}" -eq 0 ]
