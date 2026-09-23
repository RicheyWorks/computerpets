#!/usr/bin/env bash
# ADR 0111 — mint the metrics-server serving certificate, prove the leaf
# chains to the CA that becomes APIService caBundle, and prove the DNS
# SAN is metrics-server.kube-system.svc. Apply refuses otherwise.
# Kind and minikube are refused. This file does not kubectl unless
# COMPUTERPETS_METRICS_SERVING_APPLY=1. The checks do not set that.
# Do not set --kubelet-insecure-tls. Do not set insecureSkipTLSVerify.
# Certificates are not written into the repo.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="${ROOT}/deploy/k8s/metrics-server.yaml"
SERVING_SAN="metrics-server.kube-system.svc"
SECRET_NAME="metrics-server-serving"
SECRET_NS="kube-system"
APISERVICE="v1beta1.metrics.k8s.io"

die() {
  echo "metrics-server-serving-cert: $*" >&2
  exit 1
}

usage() {
  echo "usage: metrics-server-serving-cert.sh render|verify|apply DIR" >&2
  exit 1
}

refuse_repo_dir() {
  local out="$1"
  local out_abs root_abs
  out_abs="$(realpath -m "$out")"
  root_abs="$(realpath "$ROOT")"
  case "${out_abs}" in
    "${root_abs}"|"${root_abs}"/*)
      die "refusing to write serving certificates inside the repo"
      ;;
  esac
}

san_is_exact() {
  local cert="$1"
  python3 - "${cert}" "${SERVING_SAN}" <<'PY'
import subprocess, sys
cert, required = sys.argv[1], sys.argv[2]
out = subprocess.check_output(
    ["openssl", "x509", "-in", cert, "-noout", "-ext", "subjectAltName"],
    text=True,
)
names = []
for raw in out.replace("\n", " ").split(","):
    raw = raw.strip()
    if "DNS:" not in raw:
        continue
    names.append(raw.split("DNS:", 1)[1].strip())
if required not in names:
    sys.stderr.write("SAN is not %s\n" % required)
    sys.exit(1)
PY
}

cmd_verify() {
  local dir="$1"
  local leaf="${dir}/tls.crt"
  local key="${dir}/tls.key"
  local ca="${dir}/ca.crt"
  [ -f "${leaf}" ] || die "missing tls.crt"
  [ -f "${key}" ] || die "missing tls.key"
  [ -f "${ca}" ] || die "missing ca.crt"
  if grep -q "BEGIN "'CERTIFICATE' "${ROOT}/deploy/k8s/metrics-server.yaml"; then
    die "metrics-server.yaml vendors a certificate"
  fi
  if ! openssl x509 -in "${ca}" -noout -ext basicConstraints 2>/dev/null | grep -q "CA:TRUE"; then
    die "ca.crt is not a CA"
  fi
  if ! openssl x509 -in "${leaf}" -noout -ext basicConstraints 2>/dev/null | grep -q "CA:FALSE"; then
    die "tls.crt is not an end-entity certificate"
  fi
  local leaf_issuer ca_subject
  leaf_issuer="$(openssl x509 -in "${leaf}" -noout -issuer)"
  ca_subject="$(openssl x509 -in "${ca}" -noout -subject)"
  leaf_issuer="${leaf_issuer#issuer=}"
  ca_subject="${ca_subject#subject=}"
  if [ "${leaf_issuer}" != "${ca_subject}" ]; then
    die "serving cert issuer is not ca.crt"
  fi
  if ! openssl verify -CAfile "${ca}" "${leaf}" >/dev/null 2>&1; then
    die "serving cert does not chain to ca.crt"
  fi
  if openssl verify "${leaf}" >/dev/null 2>&1; then
    die "serving cert chains to a system root; caBundle would not be this CA"
  fi
  san_is_exact "${leaf}" || die "DNS SAN is not ${SERVING_SAN}"
  local cert_pub key_pub
  cert_pub="$(openssl x509 -in "${leaf}" -noout -pubkey)"
  key_pub="$(openssl pkey -in "${key}" -pubout)"
  if [ "${cert_pub}" != "${key_pub}" ]; then
    die "tls.key does not match tls.crt"
  fi
  echo "ok - serving cert chains to ca.crt and DNS SAN is ${SERVING_SAN}"
}

cmd_render() {
  local dir="$1"
  [ -n "${dir}" ] || die "render needs a directory"
  refuse_repo_dir "${dir}"
  command -v openssl >/dev/null 2>&1 || die "openssl is required"
  mkdir -p "${dir}"
  chmod 700 "${dir}"
  local ca="${dir}/ca.crt"
  local ca_key="${dir}/ca.key"
  local leaf="${dir}/tls.crt"
  local key="${dir}/tls.key"
  local csr="${dir}/tls.csr"
  local ext="${dir}/leaf.ext"
  if [ ! -f "${ca}" ] || [ ! -f "${ca_key}" ]; then
    openssl req -x509 -newkey rsa:2048 -nodes \
      -keyout "${ca_key}" -out "${ca}" -days 3650 \
      -subj "/CN=metrics-server-serving-ca" \
      -addext "basicConstraints=critical,CA:TRUE" \
      >/dev/null 2>&1
  fi
  openssl req -newkey rsa:2048 -nodes \
    -keyout "${key}" -out "${csr}" \
    -subj "/CN=${SERVING_SAN}" \
    -addext "subjectAltName=DNS:${SERVING_SAN}" \
    >/dev/null 2>&1
  cat > "${ext}" <<EOF
subjectAltName=DNS:${SERVING_SAN}
basicConstraints=CA:FALSE
keyUsage=digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth
EOF
  openssl x509 -req -in "${csr}" -CA "${ca}" -CAkey "${ca_key}" -CAcreateserial \
    -out "${leaf}" -days 90 -extfile "${ext}" \
    >/dev/null 2>&1
  rm -f "${csr}" "${ext}"
  chmod 600 "${key}" "${ca_key}"
  chmod 644 "${leaf}" "${ca}"
  cmd_verify "${dir}"
}

cmd_apply() {
  local dir="$1"
  [ -n "${dir}" ] || die "apply needs a directory"
  cmd_verify "${dir}"
  if [ "${COMPUTERPETS_METRICS_SERVING_APPLY:-}" != "1" ]; then
    die "refusing apply: set COMPUTERPETS_METRICS_SERVING_APPLY=1 after verify"
  fi
  command -v kubectl >/dev/null 2>&1 || die "refusing apply: kubectl is not installed"
  local ctx
  ctx="$(kubectl config current-context 2>/dev/null || true)"
  case "${ctx}" in
    *kind*|*minikube*|"")
      die "refusing apply: kind and minikube stay off this file"
      ;;
  esac
  [ -f "${MANIFEST}" ] || die "missing metrics-server.yaml"
  kubectl -n "${SECRET_NS}" create secret generic "${SECRET_NAME}" \
    --from-file="tls.crt=${dir}/tls.crt" \
    --from-file="tls.key=${dir}/tls.key" \
    --from-file="ca.crt=${dir}/ca.crt" \
    --dry-run=client -o yaml | kubectl apply -f -
  kubectl apply -f "${MANIFEST}"
  local ca_b64
  ca_b64="$(openssl base64 -A -in "${dir}/ca.crt")"
  kubectl patch "apiservice" "${APISERVICE}" --type=merge \
    -p "{\"spec\":{\"caBundle\":\"${ca_b64}\"}}"
  echo "ok - secret ${SECRET_NAME} and APIService caBundle are the verified CA"
}

[ "$#" -eq 2 ] || usage
case "$1" in
  render) cmd_render "$2" ;;
  verify) cmd_verify "$2" ;;
  apply) cmd_apply "$2" ;;
  *) usage ;;
esac
