#!/usr/bin/env bash
# ADR 0113 — each supplied kubelet leaf SAN must cover the address
# metrics-server dials (InternalIP, then ExternalIP, then Hostname).
# Apply refuses a SAN miss. No cluster. Does not connect to a node.
# Kind and minikube stay off this file. Do not set --kubelet-insecure-tls.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/metrics-server-kubelet-san.sh"
CHAIN="${ROOT}/deploy/k8s/metrics-server-kubelet-ca.sh"
MS="${ROOT}/deploy/k8s/metrics-server.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0113-metrics-server-kubelet-san.md"
ADR112="${ROOT}/docs/adr/0112-metrics-server-kubelet-ca-chain.md"
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

echo "== kubelet SAN dial files =="
need_file "$SCRIPT"
need_file "$CHAIN"
need_file "$MS"
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"
need_file "$ADR112"
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
need_grep "$SCRIPT" 'kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname' "dial order stays InternalIP,ExternalIP,Hostname"
need_grep "$SCRIPT" 'COMPUTERPETS_METRICS_KUBELET_SAN_APPLY' "apply is opt-in"
need_grep "$SCRIPT" '\*kind\*|\*minikube\*' "apply refuses kind and minikube"
need_grep "$SCRIPT" 'SAN does not cover the dial address' "verify names a SAN miss"
need_grep "$SCRIPT" 'DIAL_ORDER = \("InternalIP", "ExternalIP", "Hostname"\)' "the tuple order is InternalIP then ExternalIP then Hostname"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization still omits metrics-server"
need_grep "$KUSTOM" 'ADR 0113' "kustomize comment names the dial-address SAN"
need_grep "$MS" 'ADR 0113' "manifest names ADR 0113"
need_grep_body "$MS" '--kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname$' "manifest dial order stays InternalIP,ExternalIP,Hostname"
need_grep_body "$MS" '--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca\.crt$' "manifest still points at the kubelet CA"
need_not_grep_body "$MS" 'kubelet-insecure-tls' "kubelet scrapes stay verified"
need_not_grep_body "$MS" 'insecureSkipTLSVerify' "APIService does not skip serving-cert verification"
need_grep "$README" 'ADR 0113' "README names ADR 0113"
need_grep "$README" 'metrics-server-kubelet-san\.sh' "README names the gate"
need_grep "$README" 'COMPUTERPETS_METRICS_KUBELET_SAN_APPLY' "README names the apply gate"
need_grep "$ADR" 'SAN does not cover' "ADR names the SAN miss"
need_grep "$ADR" 'InternalIP' "ADR names InternalIP"
need_grep "$ADR" 'ExternalIP' "ADR names ExternalIP"
need_grep "$ADR" 'Hostname' "ADR names Hostname"
need_grep "$ADR" 'metrics-server-kubelet-ca' "ADR names the ConfigMap"
need_grep "$ADR" 'COMPUTERPETS_METRICS_KUBELET_SAN_APPLY' "ADR names the apply gate"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply to AWS"
need_grep "$ADR" 'does not connect to a node' "ADR does not dial"
need_grep "$ADR" 'kubelet-insecure-tls' "ADR forbids the kubelet TLS skip"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'kubectl top' "ADR names kubectl top"
need_grep "$ADR" '0112' "ADR points at the chain gate"
need_grep "$ADR112" '0113' "chain ADR points at the dial-address SAN"

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
rstart = text.find("refuse_manifest()")
rend = text.find("\ncmd_verify()", rstart)
rbody = text[rstart:rend] if rstart >= 0 and rend > rstart else ""
start = text.find("cmd_apply()")
end = text.find("\n[ \"$#\"", start)
body = text[start:end] if start >= 0 and end > start else ""
check("def san_covers(" in vbody, "verify defines san_covers")
check('DIAL_ORDER = ("InternalIP", "ExternalIP", "Hostname")' in vbody, "verify walks InternalIP then ExternalIP then Hostname")
order = vbody.find('DIAL_ORDER = ("InternalIP", "ExternalIP", "Hostname")')
cover = vbody.find("san_covers(")
check(order >= 0 and cover > order, "verify covers the dial address after choosing it")
check("leaf_chains" in vbody, "verify checks the chain")
check("refuse_manifest" in vbody, "verify checks the manifest")
check("kubelet-insecure-tls" in rbody, "verify refuses --kubelet-insecure-tls")
check("InternalIP,ExternalIP,Hostname" in rbody, "verify refuses a reordered dial flag")
check(start >= 0 and "cmd_verify" in body, "apply calls verify")
verify_at = body.find("cmd_verify")
kubectl_at = body.find("kubectl")
check(verify_at >= 0 and kubectl_at > verify_at, "apply verifies before kubectl")
check('COMPUTERPETS_METRICS_KUBELET_SAN_APPLY:-}" != "1"' in body, "apply stays off without the opt-in")
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
  "$@" >/tmp/cp-ms-san-out.$$ 2>/tmp/cp-ms-san-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    ok "${name}"
  else
    bad "${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ms-san-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ms-san-err.$$ || true
  fi
  rm -f /tmp/cp-ms-san-out.$$ /tmp/cp-ms-san-err.$$
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
chmod +x "${STUB}/kubectl" "${SCRIPT}"

GOOD="${WORK}/good"
mint_ca "${GOOD}"
mint_leaf "${GOOD}" "ip-10-0-1-20" "IP:192.0.2.10,DNS:ip-10-0-1-20.ec2.internal"
write_addresses "${GOOD}" "ip-10-0-1-20" \
  "InternalIP 192.0.2.10" \
  "ExternalIP 203.0.113.10" \
  "Hostname ip-10-0-1-20.ec2.internal"
if [ -f "${GOOD}/nodes/ip-10-0-1-20/kubelet.crt" ]; then
  ok "fixture wrote a node leaf outside the repo"
else
  bad "fixture did not write a node leaf"
fi
if grep -Rqs "BEGIN CERTIFICATE" "${ROOT}/deploy/k8s" --include='*.crt' --include='*.pem' --include='*.key'; then
  bad "a certificate file landed under deploy/k8s"
else
  ok "no certificate file landed under deploy/k8s"
fi

run_case "verify accepts an InternalIP that is an IP SAN" 0 \
  "${SCRIPT}" verify "${GOOD}"

HOST="${WORK}/hostname-only"
mint_ca "${HOST}"
mint_leaf "${HOST}" "ip-10-0-1-21" "DNS:ip-10-0-1-21.ec2.internal"
write_addresses "${HOST}" "ip-10-0-1-21" \
  "Hostname ip-10-0-1-21.ec2.internal"
run_case "verify accepts a Hostname when no IP type is present" 0 \
  "${SCRIPT}" verify "${HOST}"

EXT="${WORK}/external"
mint_ca "${EXT}"
mint_leaf "${EXT}" "edge" "IP:203.0.113.20"
write_addresses "${EXT}" "edge" \
  "ExternalIP 203.0.113.20" \
  "Hostname edge.example"
run_case "verify accepts ExternalIP when InternalIP is absent" 0 \
  "${SCRIPT}" verify "${EXT}"

WILD="${WORK}/wild"
mint_ca "${WILD}"
mint_leaf "${WILD}" "a-nodes" "DNS:*.nodes.example"
write_addresses "${WILD}" "a-nodes" "Hostname a.nodes.example"
run_case "verify accepts a one-label DNS wildcard" 0 \
  "${SCRIPT}" verify "${WILD}"

CASE="${WORK}/case"
mint_ca "${CASE}"
mint_leaf "${CASE}" "cased" "DNS:ip-10-0-1-22.ec2.internal"
write_addresses "${CASE}" "cased" "Hostname Ip-10-0-1-22.ec2.internal"
run_case "verify accepts a DNS SAN that differs only by case" 0 \
  "${SCRIPT}" verify "${CASE}"

V6="${WORK}/v6"
mint_ca "${V6}"
mint_leaf "${V6}" "v6node" "IP:fd00::10"
write_addresses "${V6}" "v6node" "InternalIP fd00::10"
run_case "verify accepts an IPv6 InternalIP" 0 \
  "${SCRIPT}" verify "${V6}"

DNSIP="${WORK}/dns-not-ip"
mint_ca "${DNSIP}"
mint_leaf "${DNSIP}" "dns-only" "DNS:ip-10-0-1-20.ec2.internal"
write_addresses "${DNSIP}" "dns-only" \
  "InternalIP 192.0.2.10" \
  "Hostname ip-10-0-1-20.ec2.internal"
run_case "verify refuses a DNS SAN when InternalIP is the dial address" 1 \
  "${SCRIPT}" verify "${DNSIP}"

SECOND="${WORK}/second-ip"
mint_ca "${SECOND}"
mint_leaf "${SECOND}" "two" "IP:192.0.2.11"
write_addresses "${SECOND}" "two" \
  "InternalIP 192.0.2.10" \
  "InternalIP 192.0.2.11"
run_case "verify refuses a SAN that covers only the second InternalIP" 1 \
  "${SCRIPT}" verify "${SECOND}"

DEEP="${WORK}/deep-wild"
mint_ca "${DEEP}"
mint_leaf "${DEEP}" "deep" "DNS:*.nodes.example"
write_addresses "${DEEP}" "deep" "Hostname a.b.nodes.example"
run_case "verify refuses a wildcard that would span two labels" 1 \
  "${SCRIPT}" verify "${DEEP}"

NOSAN="${WORK}/no-san"
mint_ca "${NOSAN}"
mint_leaf "${NOSAN}" "plain" ""
write_addresses "${NOSAN}" "plain" "Hostname plain.example"
run_case "verify refuses a leaf with no SAN" 1 \
  "${SCRIPT}" verify "${NOSAN}"

NONE="${WORK}/no-nodes"
mint_ca "${NONE}"
mkdir -p "${NONE}/nodes"
run_case "verify refuses a missing node file set" 1 \
  "${SCRIPT}" verify "${NONE}"

FLAT="${WORK}/flat"
mint_ca "${FLAT}"
cp "${GOOD}/nodes/ip-10-0-1-20/kubelet.crt" "${FLAT}/kubelet.crt"
run_case "verify refuses the chain-only layout with no nodes directory" 1 \
  "${SCRIPT}" verify "${FLAT}"

NOADDR="${WORK}/no-addr"
mint_ca "${NOADDR}"
mint_leaf "${NOADDR}" "bare" "IP:192.0.2.10"
run_case "verify refuses a node with no addresses file" 1 \
  "${SCRIPT}" verify "${NOADDR}"

EMPTYA="${WORK}/empty-addr"
mint_ca "${EMPTYA}"
mint_leaf "${EMPTYA}" "empty" "IP:192.0.2.10"
write_addresses "${EMPTYA}" "empty" "# none"
run_case "verify refuses a node with no dial address" 1 \
  "${SCRIPT}" verify "${EMPTYA}"

BADTYPE="${WORK}/bad-type"
mint_ca "${BADTYPE}"
mint_leaf "${BADTYPE}" "typed" "IP:192.0.2.10"
write_addresses "${BADTYPE}" "typed" "InternalDNS 192.0.2.10"
run_case "verify refuses an address type outside the dial order" 1 \
  "${SCRIPT}" verify "${BADTYPE}"

OTHER="${WORK}/other-ca"
mint_ca "${OTHER}"
SWAPPED="${WORK}/swapped"
mkdir -p "${SWAPPED}/nodes/swapped"
cp "${GOOD}/nodes/ip-10-0-1-20/kubelet.crt" "${SWAPPED}/nodes/swapped/kubelet.crt"
cp "${OTHER}/ca.crt" "${SWAPPED}/ca.crt"
write_addresses "${SWAPPED}" "swapped" "InternalIP 192.0.2.10"
run_case "verify refuses a leaf that does not chain to ca.crt" 1 \
  "${SCRIPT}" verify "${SWAPPED}"

MIXED="${WORK}/mixed"
mint_ca "${MIXED}"
mint_leaf "${MIXED}" "good-node" "IP:192.0.2.10"
write_addresses "${MIXED}" "good-node" "InternalIP 192.0.2.10"
mint_leaf "${MIXED}" "bad-node" "DNS:bad-node.example"
write_addresses "${MIXED}" "bad-node" "InternalIP 192.0.2.50"
run_case "verify refuses one SAN miss beside a good node" 1 \
  "${SCRIPT}" verify "${MIXED}"

REPO_OUT="${ROOT}/deploy/k8s/metrics-server-kubelet-san-out"
rm -rf "${REPO_OUT}"
mkdir -p "${REPO_OUT}"
cp "${GOOD}/ca.crt" "${REPO_OUT}/ca.crt"
mkdir -p "${REPO_OUT}/nodes"
cp -a "${GOOD}/nodes/ip-10-0-1-20" "${REPO_OUT}/nodes/"
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
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_SAN_APPLY= \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'create|apply' "${STUB_LOG}"; then
  bad "apply without the opt-in called kubectl"
else
  ok "apply without the opt-in called no kubectl"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="kind-local"
run_case "apply refuses a kind context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_SAN_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'create configmap|apply -f' "${STUB_LOG}"; then
  bad "kind apply wrote the configmap"
else
  ok "kind apply stopped before the configmap"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="minikube"
run_case "apply refuses a minikube context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_SAN_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -q 'metrics-server-kubelet-ca' "${STUB_LOG}"; then
  bad "minikube apply wrote the configmap"
else
  ok "minikube apply did not write the configmap"
fi

: > "${STUB_LOG}"
STUB_CONTEXT=""
run_case "apply refuses an empty context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_SAN_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'create configmap|apply -f' "${STUB_LOG}"; then
  bad "empty context wrote the configmap"
else
  ok "empty context stopped before the configmap"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="computerpets-prod"
run_case "apply refuses a SAN miss before kubectl" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_SAN_APPLY=1 \
  "${SCRIPT}" apply "${DNSIP}"
if [ -s "${STUB_LOG}" ]; then
  bad "a SAN miss still called kubectl"
else
  ok "a SAN miss called no kubectl"
fi

: > "${STUB_LOG}"
run_case "apply with the opt-in writes the verified CA" 0 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_SAN_APPLY=1 \
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
