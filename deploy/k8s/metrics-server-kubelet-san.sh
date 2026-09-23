#!/usr/bin/env bash
# ADR 0113 — prove each supplied kubelet leaf SAN covers the address
# metrics-server dials, then write ConfigMap metrics-server-kubelet-ca.
# Dial order is InternalIP, then ExternalIP, then Hostname. The first
# address of the first present type wins. An IP dial needs an IP SAN.
# A hostname dial needs a DNS SAN. Apply refuses a miss.
# Kind and minikube are refused. This file does not kubectl unless
# COMPUTERPETS_METRICS_KUBELET_SAN_APPLY=1. The checks do not set that.
# It does not connect to a node. It does not apply metrics-server.yaml
# and does not patch caBundle. Do not set --kubelet-insecure-tls.
# Certificates are not written into the repo. No live AWS apply.
# The chain-only writer is metrics-server-kubelet-ca.sh (ADR 0112).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="${ROOT}/deploy/k8s/metrics-server.yaml"
CM_NAME="metrics-server-kubelet-ca"
CM_NS="kube-system"
CA_FLAG="--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca.crt"
DIAL_FLAG="--kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname"

die() {
  echo "metrics-server-kubelet-san: $*" >&2
  exit 1
}

usage() {
  echo "usage: metrics-server-kubelet-san.sh verify|apply DIR" >&2
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
  local body flags cm sec dial
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
  dial="$(printf '%s\n' "${body}" | grep -cF -- "${DIAL_FLAG}" || true)"
  if [ "${dial}" != "1" ]; then
    die "refusing apply: dial order is not InternalIP,ExternalIP,Hostname"
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

cmd_verify() {
  local dir="$1"
  [ -n "${dir}" ] || die "verify needs a directory"
  [ -d "${dir}" ] || die "missing directory"
  refuse_repo_dir "${dir}"
  command -v openssl >/dev/null 2>&1 || die "openssl is required"
  command -v python3 >/dev/null 2>&1 || die "python3 is required"
  [ -f "${MANIFEST}" ] || die "missing metrics-server.yaml"
  if grep -q "BEGIN "'CERTIFICATE' "${MANIFEST}"; then
    die "metrics-server.yaml vendors a certificate"
  fi
  refuse_manifest
  python3 - "${dir}" <<'PY'
import ipaddress
import re
import subprocess
import sys
from pathlib import Path

root = Path(sys.argv[1])
DIAL_ORDER = ("InternalIP", "ExternalIP", "Hostname")

def die(msg):
    sys.stderr.write("metrics-server-kubelet-san: %s\n" % msg)
    sys.exit(1)

def openssl_text(args):
    proc = subprocess.run(args, text=True, capture_output=True)
    return proc.returncode, (proc.stdout or ""), (proc.stderr or "")

def one_cert(path, label):
    text = path.read_text(errors="replace")
    marker = "BEGIN " + "CERTIFICATE"
    if text.count(marker) != 1:
        die("%s must be one certificate" % label)

def is_ca(path):
    code, out, _err = openssl_text(
        ["openssl", "x509", "-in", str(path), "-noout", "-ext", "basicConstraints"]
    )
    return code == 0 and "CA:TRUE" in out

def norm_name(raw):
    text = raw.strip()
    for prefix in ("issuer=", "subject="):
        if text.startswith(prefix):
            text = text[len(prefix):]
    return "".join(text.split())

def leaf_chains(ca, leaf):
    code, _out, _err = openssl_text(
        ["openssl", "verify", "-CAfile", str(ca), str(leaf)]
    )
    if code != 0:
        return False
    _c1, issuer, _e1 = openssl_text(
        ["openssl", "x509", "-in", str(leaf), "-noout", "-issuer"]
    )
    _c2, subject, _e2 = openssl_text(
        ["openssl", "x509", "-in", str(ca), "-noout", "-subject"]
    )
    return norm_name(issuer) == norm_name(subject)

def read_san(path):
    _code, out, err = openssl_text(
        ["openssl", "x509", "-in", str(path), "-noout", "-ext", "subjectAltName"]
    )
    text = out + "\n" + err
    ips = re.findall(r"IP Address:\s*([0-9A-Fa-f:.]+)", text)
    dns = re.findall(r"DNS:\s*([^,\s]+)", text)
    return ips, dns

def dns_match(pattern, host):
    pattern = pattern.rstrip(".").lower()
    host = host.rstrip(".").lower()
    if not pattern or not host or pattern == "." or host == ".":
        return False
    pattern_parts = pattern.split(".")
    host_parts = host.split(".")
    if len(pattern_parts) != len(host_parts):
        return False
    for index, part in enumerate(pattern_parts):
        if index == 0 and part == "*":
            label = host_parts[0]
            if not label or "*" in label:
                return False
            continue
        if part != host_parts[index]:
            return False
    return True

def san_covers(dial, ips, dns_names):
    try:
        dial_ip = ipaddress.ip_address(dial)
    except ValueError:
        dial_ip = None
    if dial_ip is not None:
        for raw in ips:
            try:
                if ipaddress.ip_address(raw) == dial_ip:
                    return True
            except ValueError:
                continue
        return False
    for name in dns_names:
        if dns_match(name, dial):
            return True
    return False

def parse_addresses(path, node):
    entries = []
    try:
        lines = path.read_text(errors="replace").splitlines()
    except OSError:
        die("%s is missing addresses" % node)
    for line in lines:
        raw = line.strip()
        if not raw or raw.startswith("#"):
            continue
        parts = raw.split(None, 1)
        if len(parts) != 2:
            die("%s address line needs a type and a value" % node)
        kind, value = parts
        if kind not in DIAL_ORDER:
            die("%s address type is not in the dial order" % node)
        if any(ch.isspace() for ch in value) or "*" in value or "/" in value:
            die("%s address value is not a dial address" % node)
        if kind in ("InternalIP", "ExternalIP"):
            try:
                ipaddress.ip_address(value)
            except ValueError:
                die("%s IP address is not an IP" % node)
        entries.append((kind, value))
    return entries

def dial_address(entries):
    for want in DIAL_ORDER:
        for kind, value in entries:
            if kind == want:
                return kind, value
    return None

ca = root / "ca.crt"
if not ca.is_file():
    die("missing ca.crt")
one_cert(ca, "ca.crt")
if not is_ca(ca):
    die("ca.crt is not a CA")

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
    leaf = node_dir / "kubelet.crt"
    addresses = node_dir / "addresses"
    if not leaf.is_file():
        die("%s is missing kubelet.crt" % node)
    if not addresses.is_file():
        die("%s is missing addresses" % node)
    one_cert(leaf, node)
    if is_ca(leaf):
        die("%s kubelet cert is a CA" % node)
    if not leaf_chains(ca, leaf):
        die("%s kubelet cert does not chain to ca.crt" % node)
    entries = parse_addresses(addresses, node)
    picked = dial_address(entries)
    if picked is None:
        die("%s no address matched types InternalIP,ExternalIP,Hostname" % node)
    kind, value = picked
    ips, dns_names = read_san(leaf)
    if not san_covers(value, ips, dns_names):
        die("%s SAN does not cover the dial address %s %s" % (node, kind, value))
    print("ok - node %s dials %s %s" % (node, kind, value))

print("ok - kubelet leaf SAN covers the dial address for metrics-server-kubelet-ca")
PY
}

cmd_apply() {
  local dir="$1"
  [ -n "${dir}" ] || die "apply needs a directory"
  cmd_verify "${dir}"
  if [ "${COMPUTERPETS_METRICS_KUBELET_SAN_APPLY:-}" != "1" ]; then
    die "refusing apply: set COMPUTERPETS_METRICS_KUBELET_SAN_APPLY=1 after verify"
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
