#!/usr/bin/env bash
# Self-test for verify-secret-rotation.sh (ADR 0065).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/verify-secret-rotation.sh"

die() {
  echo "FAIL: $*" >&2
  exit 1
}

[ -x "${SCRIPT}" ] || chmod +x "${SCRIPT}"

"${SCRIPT}" >/tmp/verify-secret-rotation.out 2>&1 \
  || die "verify-secret-rotation.sh should pass on a healthy tree"
grep -q 'OK: secret-rotation contract' /tmp/verify-secret-rotation.out \
  || die "expected OK line from verify-secret-rotation.sh"

echo "OK: verify-secret-rotation.test.sh"
exit 0
