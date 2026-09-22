#!/usr/bin/env bash
# Fail-closed GHCR image signature check for the production deploy path.
# ADR 0061 — keyless cosign (Sigstore Fulcio + Rekor) from .github/workflows/ci.yml.
#
# Usage:
#   ./deploy/k8s/verify-image-signature.sh ghcr.io/richeyworks/computerpets@sha256:<digest>
#
# Refuse (exit 1) when:
#   - IMAGE is missing
#   - IMAGE is tag-only (no @sha256:…) — mutable tags are not a prod pin
#   - cosign is missing (unless COSIGN_BIN points at a stub)
#   - signature is missing or identity/issuer does not match
#
# Local / unsigned builds only:
#   COMPUTERPETS_ALLOW_UNSIGNED=1  — skips cosign (never set on prod path)
#
# Optional key path (air-gapped / private Fulcio):
#   COMPUTERPETS_COSIGN_KEY=/path/to/cosign.pub  — uses --key instead of keyless
set -euo pipefail

IMAGE="${1:-}"
COSIGN_BIN="${COSIGN_BIN:-cosign}"
IDENTITY="${COMPUTERPETS_COSIGN_IDENTITY:-https://github.com/RicheyWorks/computerpets/.github/workflows/ci.yml@refs/heads/main}"
ISSUER="${COMPUTERPETS_COSIGN_ISSUER:-https://token.actions.githubusercontent.com}"
COSIGN_KEY="${COMPUTERPETS_COSIGN_KEY:-}"

die() {
  echo "Refuse: $*" >&2
  exit 1
}

if [ -z "${IMAGE}" ]; then
  die "image ref required (digest form: registry/repo@sha256:…)"
fi

case "${IMAGE}" in
  *@sha256:*)
    ;;
  *)
    die "prod path requires an immutable digest (@sha256:…); got: ${IMAGE}"
    ;;
esac

if [ "${COMPUTERPETS_ALLOW_UNSIGNED:-}" = "1" ]; then
  echo "WARN: COMPUTERPETS_ALLOW_UNSIGNED=1 — skipping signature check (not for prod)" >&2
  exit 0
fi

if ! command -v "${COSIGN_BIN}" >/dev/null 2>&1; then
  die "cosign not found (${COSIGN_BIN}); install cosign or set COSIGN_BIN"
fi

if [ -n "${COSIGN_KEY}" ]; then
  if [ ! -f "${COSIGN_KEY}" ]; then
    die "COMPUTERPETS_COSIGN_KEY set but file missing: ${COSIGN_KEY}"
  fi
  "${COSIGN_BIN}" verify --key "${COSIGN_KEY}" "${IMAGE}"
else
  "${COSIGN_BIN}" verify \
    --certificate-identity="${IDENTITY}" \
    --certificate-oidc-issuer="${ISSUER}" \
    "${IMAGE}"
fi

echo "Verified: ${IMAGE}"
