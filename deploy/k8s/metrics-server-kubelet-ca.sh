#!/usr/bin/env bash
# ADR 0112 — prove every supplied kubelet leaf chains to the CA that
# becomes ConfigMap metrics-server-kubelet-ca, then write that object.
# Apply refuses a missing CA, a swapped CA, or --kubelet-insecure-tls.
# Kind and minikube are refused. This file does not kubectl unless
# COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1. The checks do not set that.
# It does not apply metrics-server.yaml and does not patch caBundle.
# Do not set --kubelet-insecure-tls. Certificates are not written into
# the repo. No live AWS apply.
# Dial-address SAN coverage is metrics-server-kubelet-san.sh (ADR 0113).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="${ROOT}/deploy/k8s/metrics-server.yaml"
CM_NAME="metrics-server-kubelet-ca"
CM_NS="kube-system"
CA_FLAG="--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca.crt"

die() {
  echo "metrics-server-kubelet-ca: $*" >&2
  exit 1
}

usage() {
  echo "usage: metrics-server-kubelet-ca.sh verify|apply DIR" >&2
  exit 1
}

refuse_repo_dir() {
  local out="$1"
  local out_abs root_abs
  out_abs="$(realpath -m "$out")"
  root_abs="$(realpath "$ROOT")"
  case "${out_abs}" in
    "${root_abs}"|"${root_abs}"/*)
      die "refusing to read kubelet CA material from inside the repo"
      ;;
  esac
}

yaml_body() {
  grep -vE '^[[:space:]]*#' "${MANIFEST}" || true
}

refuse_manifest() {
  local body flags cm sec
  body="$(yaml_body)"
  if printf '%s\n' "${body}" | grep -q -- '--kubelet-insecure-tls'; then
    die "refusing apply: --kubelet-insecure-tls is set"
  fi
  if printf '%s\n' "${body}" | grep -q -- '--deprecated-kubelet-completely-insecure'; then
    die "refusing apply: kubelet hop would be unencrypted"
  fi
  flags="$(printf '%s\n' "${body}" | grep -c -- "${CA_FLAG}" || true)"
  if [ "${flags}" != "1" ]; then
    die "refusing apply: kubelet CA flag is missing or duplicated"
  fi
  cm="$(printf '%s\n' "${body}" | grep -cE '^[[:space:]]*name: metrics-server-kubelet-ca$' || true)"
  sec="$(printf '%s\n' "${body}" | grep -cE '^[[:space:]]*secretName: metrics-server-kubelet-ca$' || true)"
  if [ "${cm}" = "1" ] && [ "${sec}" = "0" ]; then
    return 0
  fi
  if [ "${cm}" != "0" ] && [ "${sec}" != "0" ]; then
    die "refusing apply: kubelet CA source is both a ConfigMap and a Secret"
  fi
  die "refusing apply: ConfigMap metrics-server-kubelet-ca is not the mounted source"
}

is_ca() {
  local f="$1"
  local out
  out="$(openssl x509 -in "${f}" -noout -ext basicConstraints 2>/dev/null || true)"
  printf '%s\n' "${out}" | grep -q 'CA:TRUE'
}

norm_name() {
  printf '%s' "$1" | tr -d '[:space:]'
}

leaf_chains() {
  local ca="$1" leaf="$2"
  local leaf_issuer ca_subject
  if ! openssl verify -CAfile "${ca}" "${leaf}" >/dev/null 2>&1; then
    return 1
  fi
  leaf_issuer="$(openssl x509 -in "${leaf}" -noout -issuer)"
  ca_subject="$(openssl x509 -in "${ca}" -noout -subject)"
  leaf_issuer="${leaf_issuer#issuer=}"
  ca_subject="${ca_subject#subject=}"
  [ "$(norm_name "${leaf_issuer}")" = "$(norm_name "${ca_subject}")" ]
}

one_cert() {
  local f="$1" label="$2"
  local n
  n="$(grep -c "BEGIN "'CERTIFICATE' "${f}" || true)"
  if [ "${n}" != "1" ]; then
    die "${label} must be one certificate"
  fi
}

cmd_verify() {
  local dir="$1"
  [ -n "${dir}" ] || die "verify needs a directory"
  [ -d "${dir}" ] || die "missing directory"
  refuse_repo_dir "${dir}"
  command -v openssl >/dev/null 2>&1 || die "openssl is required"
  [ -f "${MANIFEST}" ] || die "missing metrics-server.yaml"
  if grep -q "BEGIN "'CERTIFICATE' "${MANIFEST}"; then
    die "metrics-server.yaml vendors a certificate"
  fi
  refuse_manifest
  local ca="${dir}/ca.crt"
  [ -f "${ca}" ] || die "missing ca.crt"
  [ -f "${dir}/kubelet.crt" ] || die "missing kubelet.crt"
  one_cert "${ca}" "ca.crt"
  if ! is_ca "${ca}"; then
    die "ca.crt is not a CA"
  fi
  local leaf
  local -a leafs=("${dir}/kubelet.crt")
  local extra
  shopt -s nullglob
  for extra in "${dir}"/kubelet-*.crt; do
    leafs+=("${extra}")
  done
  shopt -u nullglob
  for leaf in "${leafs[@]}"; do
    one_cert "${leaf}" "$(basename "${leaf}")"
    if is_ca "${leaf}"; then
      die "kubelet cert is a CA"
    fi
    if ! leaf_chains "${ca}" "${leaf}"; then
      die "kubelet cert does not chain to ca.crt"
    fi
  done
  echo "ok - kubelet leafs chain to ca.crt for ${CM_NAME}"
}

cmd_apply() {
  local dir="$1"
  [ -n "${dir}" ] || die "apply needs a directory"
  cmd_verify "${dir}"
  if [ "${COMPUTERPETS_METRICS_KUBELET_CA_APPLY:-}" != "1" ]; then
    die "refusing apply: set COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1 after verify"
  fi
  command -v kubectl >/dev/null 2>&1 || die "refusing apply: kubectl is not installed"
  local ctx
  ctx="$(kubectl config current-context 2>/dev/null || true)"
  case "${ctx}" in
    *kind*|*minikube*|"")
      die "refusing apply: kind and minikube stay off this file"
      ;;
  esac
  kubectl -n "${CM_NS}" create configmap "${CM_NAME}" \
    --from-file="ca.crt=${dir}/ca.crt" \
    --dry-run=client -o yaml | kubectl apply -f -
  echo "ok - configmap ${CM_NAME} is the verified kubelet CA"
}

[ "$#" -eq 2 ] || usage
case "$1" in
  verify) cmd_verify "$2" ;;
  apply) cmd_apply "$2" ;;
  *) usage ;;
esac
