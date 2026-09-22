#!/usr/bin/env bash
# Fail-closed secret-operator check for the production deploy path.
# ADR 0064 — refuse plain env / hand-filled Opaque Secret; require External
# Secrets, *_FILE mounts, or Vault agent (documented equivalents).
#
# Usage:
#   ./deploy/k8s/verify-secret-operator.sh
#     — asserts the repo contract (example CR, file-mount example, guard).
#
#   ./deploy/k8s/verify-secret-operator.sh path/to/manifest.yaml [more…]
#     — inspect rendered / copied manifests:
#         accept: ExternalSecret targeting computerpets-secrets
#                 OR Deployment env with LICENSE_SECRET_KEY_FILE (and siblings)
#         refuse: Opaque Secret computerpets-secrets with stringData house keys
#                 and neither ESO nor *_FILE present
#
# Local scaffolding only:
#   COMPUTERPETS_ALLOW_PLAIN_SECRET=1  — skips checks (never set on prod path)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
K8S="${ROOT}/deploy/k8s"

die() {
  echo "Refuse: $*" >&2
  exit 1
}

if [ "${COMPUTERPETS_ALLOW_PLAIN_SECRET:-}" = "1" ]; then
  echo "WARN: COMPUTERPETS_ALLOW_PLAIN_SECRET=1 — skipping secret-operator check (not for prod)" >&2
  exit 0
fi

assert_repo_contract() {
  local eso="${K8S}/external-secret.example.yaml"
  local file_ex="${K8S}/deployment-secrets-file.example.yaml"
  local secret="${K8S}/secret.yaml"
  local guard="${ROOT}/src/main/java/com/enterprisepet/config/ProductionProfileGuard.java"
  local adr="${ROOT}/docs/adr/0064-secret-operator-prod-refuses-plain-env.md"

  [ -f "${eso}" ] || die "missing ${eso}"
  grep -q 'kind: ExternalSecret' "${eso}" || die "external-secret.example.yaml must declare ExternalSecret"
  grep -q 'name: computerpets-secrets' "${eso}" || die "ExternalSecret must target computerpets-secrets"
  grep -q 'LICENSE_SECRET_KEY' "${eso}" || die "ExternalSecret must map LICENSE_SECRET_KEY"

  [ -f "${file_ex}" ] || die "missing ${file_ex}"
  grep -q 'LICENSE_SECRET_KEY_FILE' "${file_ex}" || die "file-mount example must set LICENSE_SECRET_KEY_FILE"
  grep -q 'COMPUTERPETS_SECRETS_SOURCE' "${file_ex}" || die "file-mount example must set COMPUTERPETS_SECRETS_SOURCE=file"
  grep -q 'NOT in kustomization' "${file_ex}" || die "file-mount example must stay out of kustomization"

  [ -f "${secret}" ] || die "missing scaffolding secret.yaml"
  grep -qi 'scaffolding\|NOT the prod path\|not the production' "${secret}" \
    || die "secret.yaml must document that hand-filled Opaque Secret is not the prod path"

  [ -f "${guard}" ] || die "missing ProductionProfileGuard"
  grep -q 'COMPUTERPETS_SECRETS_SOURCE' "${guard}" \
    || die "ProductionProfileGuard must require COMPUTERPETS_SECRETS_SOURCE on prod"
  grep -q 'ALLOWED_SECRETS_SOURCES' "${guard}" \
    || die "ProductionProfileGuard must enumerate allowed secret sources"

  [ -f "${adr}" ] || die "missing ADR 0064"

  # Default ConfigMap must not claim an operator source (operators set it when wiring ESO / files).
  local cm="${K8S}/configmap.yaml"
  if grep -E '^[[:space:]]+COMPUTERPETS_SECRETS_SOURCE:' "${cm}" >/dev/null; then
    die "configmap.yaml must not set COMPUTERPETS_SECRETS_SOURCE (operators attest on apply)"
  fi
  if grep -E '^[[:space:]]+COMPUTERPETS_ALLOW_PLAIN_SECRET:' "${cm}" >/dev/null; then
    die "configmap.yaml must not set COMPUTERPETS_ALLOW_PLAIN_SECRET"
  fi

  # Managed ConfigMap example must attest external-secrets.
  local managed="${ROOT}/deploy/terraform/configmap-managed.example.yaml"
  grep -E '^[[:space:]]+COMPUTERPETS_SECRETS_SOURCE:[[:space:]]+external-secrets[[:space:]]*$' "${managed}" >/dev/null \
    || die "configmap-managed.example.yaml must set COMPUTERPETS_SECRETS_SOURCE: external-secrets"

  echo "Verified: repo secret-operator contract (ESO example + file mounts + prod guard)"
}

# True when YAML text looks like an ExternalSecret for computerpets-secrets.
has_external_secret() {
  local f="$1"
  grep -q 'kind:[[:space:]]*ExternalSecret' "${f}" \
    && grep -q 'computerpets-secrets' "${f}"
}

# True when a Deployment (or Pod) sets the four critical *_FILE env names.
has_file_mount_env() {
  local f="$1"
  grep -q 'LICENSE_SECRET_KEY_FILE' "${f}" \
    && grep -q 'JWT_SECRET_KEY_FILE' "${f}" \
    && grep -q 'BUNDLE_SIGNING_KEY_FILE' "${f}" \
    && grep -q 'ADMIN_API_KEY_FILE' "${f}"
}

# True when an Opaque Secret named computerpets-secrets carries stringData house keys.
has_plain_stringdata_secret() {
  local f="$1"
  # Scaffolding / hand-filled path: stringData + at least one critical key name.
  grep -q 'kind:[[:space:]]*Secret' "${f}" \
    && grep -q 'name:[[:space:]]*computerpets-secrets' "${f}" \
    && grep -q 'stringData:' "${f}" \
    && grep -q 'LICENSE_SECRET_KEY' "${f}"
}

inspect_manifests() {
  local eso=0
  local files=0
  local plain=0
  local f
  for f in "$@"; do
    [ -f "${f}" ] || die "manifest not found: ${f}"
    if has_external_secret "${f}"; then
      eso=1
    fi
    if has_file_mount_env "${f}"; then
      files=1
    fi
    if has_plain_stringdata_secret "${f}"; then
      plain=1
    fi
  done

  if [ "${eso}" -eq 1 ] || [ "${files}" -eq 1 ]; then
    echo "Verified: manifests attest External Secrets and/or *_FILE mounts"
    return 0
  fi

  if [ "${plain}" -eq 1 ]; then
    die "plain Opaque Secret computerpets-secrets with stringData is refused on the prod path. \
Apply external-secret.example.yaml (or Vault agent) or deployment-secrets-file.example.yaml. \
Local only: COMPUTERPETS_ALLOW_PLAIN_SECRET=1"
  fi

  die "no ExternalSecret / *_FILE attestation found in manifests. \
Prod path requires one (ADR 0064)."
}

if [ "$#" -eq 0 ]; then
  assert_repo_contract
else
  inspect_manifests "$@"
fi
