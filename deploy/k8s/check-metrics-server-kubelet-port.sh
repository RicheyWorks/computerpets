#!/usr/bin/env bash
# ADR 0114 — each supplied kubeletEndpoint.port must be the port
# metrics-server dials (non-zero status port, otherwise 10250) and
# that port must be the kubelet listen port. Apply refuses a miss.
# No cluster. Does not connect to a node. Kind and minikube stay off
# this file. Do not set --kubelet-insecure-tls. Do not set --kubelet-port.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/metrics-server-kubelet-port.sh"
SAN="${ROOT}/deploy/k8s/metrics-server-kubelet-san.sh"
MS="${ROOT}/deploy/k8s/metrics-server.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0114-metrics-server-kubelet-port.md"
ADR113="${ROOT}/docs/adr/0113-metrics-server-kubelet-san.md"
PASS=0
FAIL=0

ok() { PASS=$((PASS + 1)); echo "ok - $*"; }
bad() { FAIL=$((FAIL + 1)); echo "not ok - $*"; }

need_file() {
  if [ -f "$1" ]; then ok "file ${1#"${ROOT}/"}"
  else bad "missing $1"; fi
}

need_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE -- "$pattern" "$file"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file"))"; fi
}

need_not_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE -- "$pattern" "$file"; then bad "$name"
  else ok "$name"; fi
}

yaml_body() {
  grep -vE '^[[:space:]]*#' "$1" || true
}

need_not_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE -- "$pattern"; then bad "$name"
  else ok "$name"; fi
}

need_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE -- "$pattern"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file"))"; fi
}

echo "== kubelet port dial files =="
need_file "$SCRIPT"
need_file "$SAN"
need_file "$MS"
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"
need_file "$ADR113"
need_not_grep "$SCRIPT" 'BEGIN CERTIFICATE' "the gate does not vendor a certificate"
need_not_grep "$SCRIPT" 'BEGIN PRIVATE KEY' "the gate does not vendor a key"
need_not_grep "$SCRIPT" 'BEGIN RSA PRIVATE KEY' "the gate does not vendor an RSA key"
need_not_grep "$SCRIPT" 's_client' "the gate does not dial a kubelet"
need_not_grep "$SCRIPT" 'kubectl get' "the gate does not list nodes"
if [ -f "$SCRIPT" ] && grep -q "kubelet-insecure-tls" "$SCRIPT"; then
  if grep -vE '^[[:space:]]*#' "$SCRIPT" | grep -q "kubelet-insecure-tls"; then
    if grep -vE '^[[:space:]]*#' "$SCRIPT" | grep -q "refusing apply: --kubelet-insecure-tls is set"; then
      ok "generator refuses --kubelet-insecure-tls"
    else
      bad "generator sets --kubelet-insecure-tls"
    fi
  else
    ok "generator only names --kubelet-insecure-tls to forbid it"
  fi
else
  bad "generator does not record the kubelet TLS skip as forbidden"
fi
need_not_grep "$MS" 'BEGIN CERTIFICATE' "metrics-server.yaml does not vendor a certificate"
need_grep "$SCRIPT" 'metrics-server-kubelet-ca' "configmap name stays metrics-server-kubelet-ca"
need_grep "$SCRIPT" 'COMPUTERPETS_METRICS_KUBELET_PORT_APPLY' "apply is opt-in"
need_grep "$SCRIPT" '\*kind\*|\*minikube\*' "apply refuses kind and minikube"
need_grep "$SCRIPT" 'kubeletEndpoint.port is zero' "verify names a zero port"
need_grep "$SCRIPT" 'DEFAULT_PORT = 10250' "the fallback port is 10250"
need_grep "$SCRIPT" 'def dial_port\(status\):' "verify names the dial-port rule"
need_grep "$SCRIPT" 'if status != 0:' "a non-zero status port is the dial"
need_grep "$SCRIPT" 'run_san_verify' "verify calls the SAN gate"
need_grep "$SCRIPT" 'metrics-server-kubelet-san.sh' "the SAN script stays the address check"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization still omits metrics-server"
need_grep "$KUSTOM" 'ADR 0114' "kustomize comment names the port gate"
need_grep "$MS" 'ADR 0114' "manifest names ADR 0114"
need_grep_body "$MS" '^[[:space:]]*-[[:space:]]*--kubelet-use-node-status-port[[:space:]]*$' "manifest sets the bare status-port flag"
need_not_grep_body "$MS" '(^|[[:space:]])--kubelet-port(=|[[:space:]]|$)' "manifest does not set --kubelet-port"
need_grep_body "$MS" '--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca\.crt$' "manifest still points at the kubelet CA"
need_not_grep_body "$MS" 'kubelet-insecure-tls' "kubelet scrapes stay verified"
need_not_grep_body "$MS" 'insecureSkipTLSVerify' "APIService does not skip serving-cert verification"
need_grep "$README" 'ADR 0114' "README names ADR 0114"
need_grep "$README" 'metrics-server-kubelet-port\.sh' "README names the gate"
need_grep "$README" 'COMPUTERPETS_METRICS_KUBELET_PORT_APPLY' "README names the apply gate"
need_grep "$ADR" 'kubeletEndpoint.port is zero' "ADR names a zero port"
need_grep "$ADR" '10250' "ADR names the 10250 fallback"
need_grep "$ADR" 'metrics-server-kubelet-ca' "ADR names the ConfigMap"
need_grep "$ADR" 'COMPUTERPETS_METRICS_KUBELET_PORT_APPLY' "ADR names the apply gate"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply to AWS"
need_grep "$ADR" 'does not connect to a node' "ADR does not dial"
need_grep "$ADR" 'kubelet-insecure-tls' "ADR forbids the kubelet TLS skip"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'kubectl top' "ADR names kubectl top"
need_grep "$ADR" '0113' "ADR points at the SAN gate"
need_grep "$ADR" 'mac-window-play' "ADR names the next product gap"
need_grep "$ADR" '0115-linux-x11-window-play' "ADR points at Linux window play"
need_grep "$ADR113" '0114' "SAN ADR points at the port gate"

python3 - "$SCRIPT" <<'PY'
import pathlib, sys
text = pathlib.Path(sys.argv[1]).read_text()
failed = False

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

vstart = text.find("cmd_verify()")
vend = text.find("\ncmd_apply()", vstart)
vbody = text[vstart:vend] if vstart >= 0 and vend > vstart else ""
pstart = text.find("check_ports()")
pend = text.find("\nrun_san_verify()", pstart)
pbody = text[pstart:pend] if pstart >= 0 and pend > pstart else ""
rstart = text.find("refuse_manifest()")
rend = text.find("\ncheck_ports()", rstart)
rbody = text[rstart:rend] if rstart >= 0 and rend > rstart else ""
start = text.find("cmd_apply()")
end = text.find("\n[ \"$#\"", start)
body = text[start:end] if start >= 0 and end > start else ""
check("def dial_port(status):" in pbody, "verify defines dial_port")
check("if status != 0:" in pbody and "return DEFAULT_PORT" in pbody, "verify dials the non-zero status port else 10250")
check("DEFAULT_PORT = 10250" in pbody, "verify fallback is 10250")
check("if status == 0:" in pbody, "verify refuses a zero status port")
check("if dial != listen:" in pbody, "verify refuses a port that is not the listen port")
check("secure-port" not in pbody, "verify does not treat --secure-port as the kubelet dial")
check("refuse_manifest" in vbody, "verify checks the manifest")
check("check_ports" in vbody, "verify checks the port file")
check("run_san_verify" in vbody, "verify calls the SAN gate")
ports_at = vbody.find("check_ports")
san_at = vbody.find("run_san_verify")
check(ports_at >= 0 and san_at > ports_at, "verify checks the port before the SAN gate")
check("kubelet-insecure-tls" in rbody, "verify refuses --kubelet-insecure-tls")
check("kubelet-use-node-status-port" in rbody, "verify refuses a missing status-port flag")
check("--kubelet-port" in rbody, "verify refuses --kubelet-port")
check(start >= 0 and "cmd_verify" in body, "apply calls verify")
verify_at = body.find("cmd_verify")
kubectl_at = body.find("kubectl")
check(verify_at >= 0 and kubectl_at > verify_at, "apply verifies before kubectl")
check('COMPUTERPETS_METRICS_KUBELET_PORT_APPLY:-}" != "1"' in body, "apply stays off without the opt-in")
check("*kind*|*minikube*" in body, "apply case refuses kind and minikube")
check('create configmap "${CM_NAME}"' in body and "ca.crt=" in body, "apply writes the kubelet CA configmap")
check("kubelet.crt" not in body, "apply does not write a leaf")
check("kubelet-insecure-tls" not in body, "apply does not set the kubelet TLS skip")
check("caBundle" not in body, "apply does not patch caBundle")
check("metrics-server.yaml" not in body, "apply does not apply the manifest")
check("s_client" not in body and "kubectl get" not in body, "apply does not dial or list nodes")
check("insecureSkipTLSVerify" not in body, "apply does not skip APIService verification")
if failed:
    sys.exit(1)
PY

run_case() {
  local name="$1"
  local want="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ms-port-out.$$ 2>/tmp/cp-ms-port-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    ok "${name}"
  else
    bad "${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ms-port-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ms-port-err.$$ || true
  fi
  rm -f /tmp/cp-ms-port-out.$$ /tmp/cp-ms-port-err.$$
}

mint_ca() {
  local dir="$1"
  mkdir -p "${dir}"
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "${dir}/ca.key" -out "${dir}/ca.crt" -days 30 \
    -subj "/CN=metrics-server-kubelet-ca" \
    -addext "basicConstraints=critical,CA:TRUE" >/dev/null 2>&1
}

mint_leaf() {
  local dir="$1" node="$2" san="$3"
  local nd="${dir}/nodes/${node}"
  mkdir -p "${nd}"
  openssl req -newkey rsa:2048 -nodes \
    -keyout "${nd}/kubelet.key" -out "${nd}/kubelet.csr" \
    -subj "/CN=kubelet" >/dev/null 2>&1
  if [ -n "${san}" ]; then
    cat > "${nd}/leaf.ext" <<EOF
basicConstraints=CA:FALSE
keyUsage=digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth
subjectAltName=${san}
EOF
    openssl x509 -req -in "${nd}/kubelet.csr" -CA "${dir}/ca.crt" \
      -CAkey "${dir}/ca.key" -CAcreateserial \
      -out "${nd}/kubelet.crt" -days 30 -extfile "${nd}/leaf.ext" \
      >/dev/null 2>&1
  else
    openssl x509 -req -in "${nd}/kubelet.csr" -CA "${dir}/ca.crt" \
      -CAkey "${dir}/ca.key" -CAcreateserial \
      -out "${nd}/kubelet.crt" -days 30 \
      >/dev/null 2>&1
  fi
  rm -f "${nd}/kubelet.csr" "${nd}/leaf.ext" "${nd}/kubelet.key"
}

write_addresses() {
  local dir="$1" node="$2"
  shift 2
  local nd="${dir}/nodes/${node}"
  mkdir -p "${nd}"
  : > "${nd}/addresses"
  local line
  for line in "$@"; do
    printf '%s\n' "${line}" >> "${nd}/addresses"
  done
}

write_port() {
  local dir="$1" node="$2" status="$3" listen="$4"
  local nd="${dir}/nodes/${node}"
  mkdir -p "${nd}"
  if [ "${status}" = "-" ]; then
    printf 'listen %s\n' "${listen}" > "${nd}/kubelet-port"
  elif [ "${listen}" = "-" ]; then
    printf 'status %s\n' "${status}" > "${nd}/kubelet-port"
  else
    printf 'status %s\nlisten %s\n' "${status}" "${listen}" > "${nd}/kubelet-port"
  fi
}

if [ ! -x "$SCRIPT" ]; then
  bad "gate is not executable"
else
  ok "gate is executable"
fi

WORK="$(mktemp -d)"
STUB="$(mktemp -d)"
cleanup() { rm -rf "${WORK}" "${STUB}"; }
trap cleanup EXIT

cat > "${STUB}/kubectl" <<'EOF'
#!/bin/sh
printf '%s\n' "$*" >> "${STUB_LOG}"
if [ "$1" = "config" ] && [ "$2" = "current-context" ]; then
  printf '%s\n' "${STUB_CONTEXT}"
  exit 0
fi
exit 0
EOF
chmod +x "${STUB}/kubectl" "${SCRIPT}" "${SAN}"

GOOD="${WORK}/good"
mint_ca "${GOOD}"
mint_leaf "${GOOD}" "ip-10-0-1-20" "IP:192.0.2.10,DNS:ip-10-0-1-20.ec2.internal"
write_addresses "${GOOD}" "ip-10-0-1-20" \
  "InternalIP 192.0.2.10" \
  "ExternalIP 203.0.113.10" \
  "Hostname ip-10-0-1-20.ec2.internal"
write_port "${GOOD}" "ip-10-0-1-20" 10250 10250
if [ -f "${GOOD}/nodes/ip-10-0-1-20/kubelet-port" ]; then
  ok "fixture wrote a kubelet-port file outside the repo"
else
  bad "fixture did not write a kubelet-port file"
fi
if grep -Rqs "BEGIN CERTIFICATE" "${ROOT}/deploy/k8s" --include='*.crt' --include='*.pem' --include='*.key'; then
  bad "a certificate file landed under deploy/k8s"
else
  ok "no certificate file landed under deploy/k8s"
fi

run_case "verify accepts status 10250 when that is the listen port" 0 \
  "${SCRIPT}" verify "${GOOD}"

ALT="${WORK}/alt"
mint_ca "${ALT}"
mint_leaf "${ALT}" "ip-10-0-1-30" "IP:192.0.2.30"
write_addresses "${ALT}" "ip-10-0-1-30" "InternalIP 192.0.2.30"
write_port "${ALT}" "ip-10-0-1-30" 10255 10255
run_case "verify accepts a non-default port when status and listen match" 0 \
  "${SCRIPT}" verify "${ALT}"

NOPORT="${WORK}/no-port"
mint_ca "${NOPORT}"
mint_leaf "${NOPORT}" "bare" "IP:192.0.2.10"
write_addresses "${NOPORT}" "bare" "InternalIP 192.0.2.10"
run_case "verify refuses a node with no kubelet-port file" 1 \
  "${SCRIPT}" verify "${NOPORT}"

NOSTATUS="${WORK}/no-status"
mint_ca "${NOSTATUS}"
mint_leaf "${NOSTATUS}" "nost" "IP:192.0.2.10"
write_addresses "${NOSTATUS}" "nost" "InternalIP 192.0.2.10"
write_port "${NOSTATUS}" "nost" - 10250
run_case "verify refuses a missing kubeletEndpoint.port" 1 \
  "${SCRIPT}" verify "${NOSTATUS}"

NOLISTEN="${WORK}/no-listen"
mint_ca "${NOLISTEN}"
mint_leaf "${NOLISTEN}" "nol" "IP:192.0.2.10"
write_addresses "${NOLISTEN}" "nol" "InternalIP 192.0.2.10"
write_port "${NOLISTEN}" "nol" 10250 -
run_case "verify refuses a missing listen port" 1 \
  "${SCRIPT}" verify "${NOLISTEN}"

ZERO="${WORK}/zero"
mint_ca "${ZERO}"
mint_leaf "${ZERO}" "zero" "IP:192.0.2.10"
write_addresses "${ZERO}" "zero" "InternalIP 192.0.2.10"
write_port "${ZERO}" "zero" 0 10250
run_case "verify refuses a zero kubeletEndpoint.port" 1 \
  "${SCRIPT}" verify "${ZERO}"

MISMATCH="${WORK}/mismatch"
mint_ca "${MISMATCH}"
mint_leaf "${MISMATCH}" "mis" "IP:192.0.2.10"
write_addresses "${MISMATCH}" "mis" "InternalIP 192.0.2.10"
write_port "${MISMATCH}" "mis" 10255 10250
run_case "verify refuses a status port that is not the listen port" 1 \
  "${SCRIPT}" verify "${MISMATCH}"

FLIP="${WORK}/flip"
mint_ca "${FLIP}"
mint_leaf "${FLIP}" "flip" "IP:192.0.2.10"
write_addresses "${FLIP}" "flip" "InternalIP 192.0.2.10"
write_port "${FLIP}" "flip" 10250 10255
run_case "verify refuses a listen port that is not the dial port" 1 \
  "${SCRIPT}" verify "${FLIP}"

WIDE="${WORK}/wide"
mkdir -p "${WIDE}/nodes/wide"
printf 'status 65536\nlisten 65536\n' > "${WIDE}/nodes/wide/kubelet-port"
run_case "verify refuses a port above 65535" 1 \
  "${SCRIPT}" verify "${WIDE}"

LEAD="${WORK}/lead"
mkdir -p "${LEAD}/nodes/lead"
printf 'status 010250\nlisten 10250\n' > "${LEAD}/nodes/lead/kubelet-port"
run_case "verify refuses a leading zero" 1 \
  "${SCRIPT}" verify "${LEAD}"

DUP="${WORK}/dup"
mkdir -p "${DUP}/nodes/dup"
printf 'status 10250\nstatus 10250\nlisten 10250\n' > "${DUP}/nodes/dup/kubelet-port"
run_case "verify refuses a duplicated status port" 1 \
  "${SCRIPT}" verify "${DUP}"

NONE="${WORK}/no-nodes"
mkdir -p "${NONE}/nodes"
run_case "verify refuses a missing node file set" 1 \
  "${SCRIPT}" verify "${NONE}"

MIXED="${WORK}/mixed"
mint_ca "${MIXED}"
mint_leaf "${MIXED}" "good-node" "IP:192.0.2.10"
write_addresses "${MIXED}" "good-node" "InternalIP 192.0.2.10"
write_port "${MIXED}" "good-node" 10250 10250
mint_leaf "${MIXED}" "bad-node" "IP:192.0.2.11"
write_addresses "${MIXED}" "bad-node" "InternalIP 192.0.2.11"
write_port "${MIXED}" "bad-node" 10255 10250
run_case "verify refuses one wrong port beside a good node" 1 \
  "${SCRIPT}" verify "${MIXED}"

DNSIP="${WORK}/dns-not-ip"
mint_ca "${DNSIP}"
mint_leaf "${DNSIP}" "dns-only" "DNS:ip-10-0-1-20.ec2.internal"
write_addresses "${DNSIP}" "dns-only" \
  "InternalIP 192.0.2.10" \
  "Hostname ip-10-0-1-20.ec2.internal"
write_port "${DNSIP}" "dns-only" 10250 10250
run_case "verify refuses a SAN miss after the port matches" 1 \
  "${SCRIPT}" verify "${DNSIP}"

REPO_OUT="${ROOT}/deploy/k8s/metrics-server-kubelet-port-out"
rm -rf "${REPO_OUT}"
mkdir -p "${REPO_OUT}/nodes/ip-10-0-1-20"
printf 'status 10250\nlisten 10250\n' > "${REPO_OUT}/nodes/ip-10-0-1-20/kubelet-port"
run_case "verify refuses a directory inside the repo" 1 \
  "${SCRIPT}" verify "${REPO_OUT}"
rm -rf "${REPO_OUT}"
if [ -e "${REPO_OUT}" ]; then
  bad "repo verify left ${REPO_OUT}"
else
  ok "repo verify left no directory"
fi

STUB_LOG="${WORK}/kubectl.log"
export STUB_LOG STUB_CONTEXT
: > "${STUB_LOG}"
STUB_CONTEXT="computerpets-prod"
run_case "verify does not call kubectl" 0 \
  env PATH="${STUB}:${PATH}" "${SCRIPT}" verify "${GOOD}"
if [ -s "${STUB_LOG}" ]; then
  bad "verify invoked kubectl"
else
  ok "verify invoked no kubectl"
fi

: > "${STUB_LOG}"
run_case "apply without the opt-in refuses" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_PORT_APPLY= \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'create|apply' "${STUB_LOG}"; then
  bad "apply without the opt-in called kubectl"
else
  ok "apply without the opt-in called no kubectl"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="kind-local"
run_case "apply refuses a kind context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'create configmap|apply -f' "${STUB_LOG}"; then
  bad "kind apply wrote the configmap"
else
  ok "kind apply stopped before the configmap"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="minikube"
run_case "apply refuses a minikube context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -q 'metrics-server-kubelet-ca' "${STUB_LOG}"; then
  bad "minikube apply wrote the configmap"
else
  ok "minikube apply did not write the configmap"
fi

: > "${STUB_LOG}"
STUB_CONTEXT=""
run_case "apply refuses an empty context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'create configmap|apply -f' "${STUB_LOG}"; then
  bad "empty context wrote the configmap"
else
  ok "empty context stopped before the configmap"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="computerpets-prod"
run_case "apply refuses a port mismatch before kubectl" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 \
  "${SCRIPT}" apply "${MISMATCH}"
if [ -s "${STUB_LOG}" ]; then
  bad "a port mismatch still called kubectl"
else
  ok "a port mismatch called no kubectl"
fi

: > "${STUB_LOG}"
run_case "apply refuses a zero port before kubectl" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 \
  "${SCRIPT}" apply "${ZERO}"
if [ -s "${STUB_LOG}" ]; then
  bad "a zero port still called kubectl"
else
  ok "a zero port called no kubectl"
fi

: > "${STUB_LOG}"
run_case "apply refuses a SAN miss before kubectl" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 \
  "${SCRIPT}" apply "${DNSIP}"
if [ -s "${STUB_LOG}" ]; then
  bad "a SAN miss still called kubectl"
else
  ok "a SAN miss called no kubectl"
fi

: > "${STUB_LOG}"
run_case "apply with the opt-in writes the verified CA" 0 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -q "create configmap" "${STUB_LOG}" \
  && grep -q "metrics-server-kubelet-ca" "${STUB_LOG}" \
  && grep -q "ca.crt=${GOOD}/ca.crt" "${STUB_LOG}" \
  && grep -q "apply -f -" "${STUB_LOG}"; then
  ok "apply stub saw the configmap and the verified ca.crt"
else
  bad "apply stub did not see the configmap and the verified ca.crt"
  echo "--- stub log ---"; cat "${STUB_LOG}" || true
fi
if grep -q "metrics-server.yaml" "${STUB_LOG}" || grep -q "caBundle" "${STUB_LOG}" \
  || grep -q "kubelet-insecure-tls" "${STUB_LOG}" \
  || grep -q "kubelet.crt" "${STUB_LOG}"; then
  bad "apply stub saw the manifest, caBundle, a TLS skip, or a leaf"
else
  ok "apply stub saw no manifest, caBundle, TLS skip, or leaf"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
