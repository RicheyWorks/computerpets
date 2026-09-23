#!/usr/bin/env bash
# ADR 0114 — prove each supplied kubeletEndpoint.port is the port
# metrics-server dials, then write ConfigMap metrics-server-kubelet-ca.
# v0.9.0 dials status.daemonEndpoints.kubeletEndpoint.port when that
# value is non-zero, otherwise --kubelet-port (default 10250).
# The manifest sets --kubelet-use-node-status-port and does not set
# --kubelet-port. A missing port, a zero, or a port that is not the
# kubelet listen port refuses apply. This file calls the SAN verify
# (ADR 0113) and does not reimplement it.
# Kind and minikube are refused. This file does not kubectl unless
# COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1. The checks do not set that.
# It does not connect to a node. It does not apply metrics-server.yaml
# and does not patch caBundle. Do not set --kubelet-insecure-tls.
# --secure-port is the metrics-server listen port, not the kubelet dial.
# Certificates are not written into the repo. No live AWS apply.
# The chain-only writer is metrics-server-kubelet-ca.sh (ADR 0112).
# The address-only writer is metrics-server-kubelet-san.sh (ADR 0113).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="${ROOT}/deploy/k8s/metrics-server.yaml"
CM_NAME="metrics-server-kubelet-ca"
CM_NS="kube-system"
CA_FLAG="--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca.crt"
PORT_FLAG="--kubelet-use-node-status-port"

die() {
  echo "metrics-server-kubelet-port: $*" >&2
  exit 1
}

usage() {
  echo "usage: metrics-server-kubelet-port.sh verify|apply DIR" >&2
  exit 1
}

refuse_repo_dir() {
  local out="$1"
  local out_abs root_abs
  out_abs="$(realpath -m "$out")"
  root_abs="$(realpath "$ROOT")"
  case "${out_abs}" in
    "${root_abs}"|"${root_abs}"/*)
      die "refusing to read kubelet material from inside the repo"
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
  if printf '%s\n' "${body}" | grep -q -- '--kubelet-use-node-status-port='; then
    die "refusing apply: --kubelet-use-node-status-port must be the bare flag"
  fi
  flags="$(printf '%s\n' "${body}" | grep -cE '^[[:space:]]*-[[:space:]]*--kubelet-use-node-status-port[[:space:]]*$' || true)"
  if [ "${flags}" != "1" ]; then
    die "refusing apply: --kubelet-use-node-status-port is missing or duplicated"
  fi
  if printf '%s\n' "${body}" | grep -qE '(^|[[:space:]])--kubelet-port(=|[[:space:]]|$)'; then
    die "refusing apply: --kubelet-port would change the 10250 fallback"
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

check_ports() {
  local dir="$1"
  command -v python3 >/dev/null 2>&1 || die "python3 is required"
  python3 - "${dir}" <<'PY'
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
DEFAULT_PORT = 10250

def die(msg):
    sys.stderr.write("metrics-server-kubelet-port: %s\n" % msg)
    sys.exit(1)

def dial_port(status):
    if status != 0:
        return status
    return DEFAULT_PORT

def parse_port(path, node):
    status = None
    listen = None
    try:
        lines = path.read_text(errors="replace").splitlines()
    except OSError:
        die("%s is missing kubeletEndpoint.port" % node)
    for line in lines:
        raw = line.strip()
        if not raw or raw.startswith("#"):
            continue
        parts = raw.split()
        if len(parts) != 2 or parts[0] not in ("status", "listen"):
            die("%s kubelet-port line needs status or listen and one integer" % node)
        key, value = parts
        if re.fullmatch(r"0|[1-9][0-9]{0,4}", value) is None:
            die("%s kubeletEndpoint.port is not a port" % node)
        number = int(value)
        if number > 65535:
            die("%s kubeletEndpoint.port is not a port" % node)
        if key == "status":
            if status is not None:
                die("%s kubeletEndpoint.port is duplicated" % node)
            status = number
        else:
            if listen is not None:
                die("%s listen port is duplicated" % node)
            listen = number
    if status is None:
        die("%s is missing kubeletEndpoint.port" % node)
    if listen is None:
        die("%s is missing the kubelet listen port" % node)
    dial = dial_port(status)
    if status == 0:
        die("%s kubeletEndpoint.port is zero; metrics-server would dial %d" % (node, dial))
    if listen == 0:
        die("%s kubelet listen port is zero" % node)
    if dial != listen:
        die("%s kubeletEndpoint.port %d is not the listen port %d" % (node, dial, listen))
    return dial

nodes = root / "nodes"
if not nodes.is_dir():
    die("missing node file set")
children = sorted(path for path in nodes.iterdir() if path.name not in (".", ".."))
if not children:
    die("missing node file set")

name_re = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,252}$")
for node_dir in children:
    node = node_dir.name
    if not node_dir.is_dir() or not name_re.fullmatch(node):
        die("node file set is not a directory")
    port_file = node_dir / "kubelet-port"
    if not port_file.is_file():
        die("%s is missing kubeletEndpoint.port" % node)
    dial = parse_port(port_file, node)
    print("ok - node %s dials port %d" % (node, dial))

print("ok - kubeletEndpoint.port is the port metrics-server dials")
PY
}

run_san_verify() {
  local dir="$1"
  local san="${ROOT}/deploy/k8s/metrics-server-kubelet-san.sh"
  [ -x "${san}" ] || die "missing metrics-server-kubelet-san.sh"
  "${san}" verify "${dir}"
}

cmd_verify() {
  local dir="$1"
  [ -n "${dir}" ] || die "verify needs a directory"
  [ -d "${dir}" ] || die "missing directory"
  refuse_repo_dir "${dir}"
  [ -f "${MANIFEST}" ] || die "missing metrics-server.yaml"
  if grep -q "BEGIN "'CERTIFICATE' "${MANIFEST}"; then
    die "metrics-server.yaml vendors a certificate"
  fi
  refuse_manifest
  check_ports "${dir}"
  run_san_verify "${dir}"
}

cmd_apply() {
  local dir="$1"
  [ -n "${dir}" ] || die "apply needs a directory"
  cmd_verify "${dir}"
  if [ "${COMPUTERPETS_METRICS_KUBELET_PORT_APPLY:-}" != "1" ]; then
    die "refusing apply: set COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 after verify"
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
