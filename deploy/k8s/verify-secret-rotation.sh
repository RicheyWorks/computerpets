#!/usr/bin/env bash
# Fail-closed secret-rotation contract check (ADR 0065).
# Asserts dual-key previous env wiring, cadence docs, and code paths.
# Does not talk to AWS, Vault, or a live HSM.
#
# Usage:
#   ./deploy/k8s/verify-secret-rotation.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

die() {
  echo "Refuse: $*" >&2
  exit 1
}

ADR="${ROOT}/docs/adr/0065-secret-rotation-cadence-and-hsm.md"
SETUP="${ROOT}/docs/SETUP.md"
JWT="${ROOT}/src/main/java/com/enterprisepet/security/JwtService.java"
BUNDLE="${ROOT}/src/main/java/com/enterprisepet/bundle/PetBundleService.java"
LICENSE="${ROOT}/src/main/java/com/enterprisepet/license/LicenseService.java"
ADMIN="${ROOT}/src/main/java/com/enterprisepet/controller/AdminController.java"
GUARD="${ROOT}/src/main/java/com/enterprisepet/config/ProductionProfileGuard.java"
APP_YML="${ROOT}/src/main/resources/application.yml"
FILES="${ROOT}/src/main/java/com/enterprisepet/config/SecretFileEnvironmentPostProcessor.java"

[ -f "${ADR}" ] || die "missing ${ADR}"
grep -q 'dual-key' "${ADR}" || die "ADR 0065 must document dual-key verify"
grep -q '90 days' "${ADR}" || die "ADR 0065 must document JWT/bundle/admin cadence"
grep -q '180 days' "${ADR}" || die "ADR 0065 must document license cadence"
grep -q 'HSM\|KMS' "${ADR}" || die "ADR 0065 must name an HSM/KMS pointer"

[ -f "${SETUP}" ] || die "missing SETUP.md"
grep -q 'Secret rotation' "${SETUP}" || die "SETUP.md must include Secret rotation section"
grep -q 'JWT_SECRET_KEY_PREVIOUS' "${SETUP}" || die "SETUP.md must document JWT_SECRET_KEY_PREVIOUS"
grep -q 'LICENSE_SECRET_KEY_PREVIOUS' "${SETUP}" || die "SETUP.md must document LICENSE_SECRET_KEY_PREVIOUS"
grep -q 'BUNDLE_SIGNING_KEY_PREVIOUS' "${SETUP}" || die "SETUP.md must document BUNDLE_SIGNING_KEY_PREVIOUS"
grep -q 'COMPUTERPETS_KEYS_ROTATED_AT' "${SETUP}" || die "SETUP.md must document COMPUTERPETS_KEYS_ROTATED_AT"

[ -f "${JWT}" ] || die "missing JwtService"
grep -q 'secret-key-previous' "${JWT}" || die "JwtService must wire jwt.secret-key-previous"
grep -q 'previousSigningKey' "${JWT}" || die "JwtService must keep a previous verify key"

[ -f "${BUNDLE}" ] || die "missing PetBundleService"
grep -q 'signing-key-previous' "${BUNDLE}" || die "PetBundleService must wire bundle.signing-key-previous"
grep -q 'previousSigningKeySpec' "${BUNDLE}" || die "PetBundleService must verify with previous HMAC"

[ -f "${LICENSE}" ] || die "missing LicenseService"
grep -q 'secret-key-previous' "${LICENSE}" || die "LicenseService must wire license.secret-key-previous"
grep -q 'decryptWithRotation' "${LICENSE}" || die "LicenseService must decrypt with rotation fallback"

[ -f "${ADMIN}" ] || die "missing AdminController"
grep -q 'api-key-previous' "${ADMIN}" || die "AdminController must wire admin.api-key-previous"

[ -f "${GUARD}" ] || die "missing ProductionProfileGuard"
grep -q 'COMPUTERPETS_KEYS_ROTATED_AT' "${GUARD}" || die "ProductionProfileGuard must enforce optional rotation stamp"
grep -q 'KEYS_ROTATED_AT_MAX_AGE' "${GUARD}" || die "ProductionProfileGuard must define KEYS_ROTATED_AT_MAX_AGE"

[ -f "${APP_YML}" ] || die "missing application.yml"
grep -q 'JWT_SECRET_KEY_PREVIOUS' "${APP_YML}" || die "application.yml must map JWT_SECRET_KEY_PREVIOUS"
grep -q 'BUNDLE_SIGNING_KEY_PREVIOUS' "${APP_YML}" || die "application.yml must map BUNDLE_SIGNING_KEY_PREVIOUS"
grep -q 'LICENSE_SECRET_KEY_PREVIOUS' "${APP_YML}" || die "application.yml must map LICENSE_SECRET_KEY_PREVIOUS"
grep -q 'ADMIN_API_KEY_PREVIOUS' "${APP_YML}" || die "application.yml must map ADMIN_API_KEY_PREVIOUS"

[ -f "${FILES}" ] || die "missing SecretFileEnvironmentPostProcessor"
grep -q 'JWT_SECRET_KEY_PREVIOUS' "${FILES}" || die "SecretFileEnvironmentPostProcessor must allow JWT_SECRET_KEY_PREVIOUS_FILE"
grep -q 'LICENSE_SECRET_KEY_PREVIOUS' "${FILES}" || die "SecretFileEnvironmentPostProcessor must allow LICENSE_SECRET_KEY_PREVIOUS_FILE"

echo "OK: secret-rotation contract (ADR 0065 dual-key + cadence + optional stamp)"
exit 0
