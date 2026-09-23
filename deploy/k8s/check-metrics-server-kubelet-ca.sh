#!/usr/bin/env bash
# ADR 0112 — every supplied kubelet leaf must chain to the CA that
# becomes ConfigMap metrics-server-kubelet-ca. Apply refuses a missing
# CA, a swapped CA, or --kubelet-insecure-tls.
# No cluster. Does not kubectl apply. No terraform apply.
# Kind and minikube stay off this file. Do not set --kubelet-insecure-tls.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/metrics-server-kubelet-ca.sh"
MS="${ROOT}/deploy/k8s/metrics-server.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0112-metrics-server-kubelet-ca-chain.md"
ADR86="${ROOT}/docs/adr/0086-metrics-server-kubelet-ca.md"
ADR111="${ROOT}/docs/adr/0111-metrics-server-serving-cert-chain.md"
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

echo "== kubelet CA chain files =="
need_file "$SCRIPT"
need_file "$MS"
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"
need_file "$ADR86"
need_file "$ADR111"
need_not_grep "$SCRIPT" 'BEGIN CERTIFICATE' "the gate does not vendor a certificate"
need_not_grep "$SCRIPT" 'BEGIN PRIVATE KEY' "the gate does not vendor a key"
need_not_grep "$SCRIPT" 'BEGIN RSA PRIVATE KEY' "the gate does not vendor an RSA key"
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
need_grep "$SCRIPT" 'kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca\.crt' "the flag path stays the mount"
need_grep "$SCRIPT" 'COMPUTERPETS_METRICS_KUBELET_CA_APPLY' "apply is opt-in"
need_grep "$SCRIPT" '\*kind\*|\*minikube\*' "apply refuses kind and minikube"
need_grep "$SCRIPT" 'does not chain to ca.crt' "verify names a chain failure"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization still omits metrics-server"
need_grep "$KUSTOM" 'ADR 0112' "kustomize comment names the kubelet chain"
need_grep "$MS" 'ADR 0112' "manifest names ADR 0112"
need_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE -- "$pattern"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file"))"; fi
}
need_grep_body "$MS" '--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca\.crt$' "manifest still points at the kubelet CA"
need_grep_body "$MS" 'name: metrics-server-kubelet-ca$' "manifest still mounts the kubelet CA ConfigMap"
need_not_grep_body "$MS" 'kubelet-insecure-tls' "kubelet scrapes stay verified"
need_not_grep_body "$MS" 'insecureSkipTLSVerify' "APIService does not skip serving-cert verification"
need_grep "$README" 'ADR 0112' "README names ADR 0112"
need_grep "$README" 'metrics-server-kubelet-ca\.sh' "README names the gate"
need_grep "$README" 'COMPUTERPETS_METRICS_KUBELET_CA_APPLY' "README names the apply gate"
need_grep "$ADR" 'does not chain' "ADR names the chain failure"
need_grep "$ADR" 'metrics-server-kubelet-ca' "ADR names the ConfigMap"
need_grep "$ADR" 'COMPUTERPETS_METRICS_KUBELET_CA_APPLY' "ADR names the apply gate"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply to AWS"
need_grep "$ADR" 'kubelet-insecure-tls' "ADR forbids the kubelet TLS skip"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'kubectl top' "ADR names kubectl top"
need_grep "$ADR" 'InternalIP' "ADR names the dial-order residual"
need_grep "$ADR86" '0112' "kubelet CA ADR points at the chain gate"
need_grep "$ADR111" '0112' "serving-chain ADR points at the kubelet chain gate"
need_grep "$ADR111" 'metrics-server-kubelet-ca' "serving-chain ADR still names the kubelet CA"

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
rend = text.find("\nis_ca()", rstart)
rbody = text[rstart:rend] if rstart >= 0 and rend > rstart else ""
start = text.find("cmd_apply()")
end = text.find("\n[ \"$#\"", start)
body = text[start:end] if start >= 0 and end > start else ""
check(vstart >= 0 and "leaf_chains" in vbody, "verify checks the chain")
check("refuse_manifest" in vbody, "verify checks the manifest")
check("kubelet-insecure-tls" in rbody, "verify refuses --kubelet-insecure-tls")
check(start >= 0 and "cmd_verify" in body, "apply calls verify")
verify_at = body.find("cmd_verify")
kubectl_at = body.find("kubectl")
check(verify_at >= 0 and kubectl_at > verify_at, "apply verifies before kubectl")
check('COMPUTERPETS_METRICS_KUBELET_CA_APPLY:-}" != "1"' in body, "apply stays off without the opt-in")
check("*kind*|*minikube*" in body, "apply case refuses kind and minikube")
check('create configmap "${CM_NAME}"' in body and "ca.crt=" in body, "apply writes the kubelet CA configmap")
check("kubelet-insecure-tls" not in body, "apply does not set the kubelet TLS skip")
check("caBundle" not in body, "apply does not patch caBundle")
check("metrics-server.yaml" not in body, "apply does not apply the manifest")
check("insecureSkipTLSVerify" not in body, "apply does not skip APIService verification")
if failed:
    sys.exit(1)
PY

run_case() {
  local name="$1"
  local want="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ms-kubelet-out.$$ 2>/tmp/cp-ms-kubelet-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    ok "${name}"
  else
    bad "${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ms-kubelet-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ms-kubelet-err.$$ || true
  fi
  rm -f /tmp/cp-ms-kubelet-out.$$ /tmp/cp-ms-kubelet-err.$$
}

mint_pair() {
  local dir="$1" cn="$2"
  mkdir -p "${dir}"
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "${dir}/ca.key" -out "${dir}/ca.crt" -days 30 \
    -subj "/CN=${cn}" \
    -addext "basicConstraints=critical,CA:TRUE" >/dev/null 2>&1
  openssl req -newkey rsa:2048 -nodes \
    -keyout "${dir}/kubelet.key" -out "${dir}/kubelet.csr" \
    -subj "/CN=kubelet" >/dev/null 2>&1
  cat > "${dir}/leaf.ext" <<'EOF'
basicConstraints=CA:FALSE
keyUsage=digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth
subjectAltName=IP:192.0.2.10
EOF
  openssl x509 -req -in "${dir}/kubelet.csr" -CA "${dir}/ca.crt" \
    -CAkey "${dir}/ca.key" -CAcreateserial \
    -out "${dir}/kubelet.crt" -days 30 -extfile "${dir}/leaf.ext" \
    >/dev/null 2>&1
  rm -f "${dir}/kubelet.csr" "${dir}/leaf.ext" "${dir}/kubelet.key"
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
mint_pair "${GOOD}" "metrics-server-kubelet-ca"
if [ -f "${GOOD}/kubelet.crt" ]; then
  ok "fixture wrote kubelet.crt outside the repo"
else
  bad "fixture did not write kubelet.crt"
fi
if grep -Rqs "BEGIN CERTIFICATE" "${ROOT}/deploy/k8s" --include='*.crt' --include='*.pem' --include='*.key'; then
  bad "a certificate file landed under deploy/k8s"
else
  ok "no certificate file landed under deploy/k8s"
fi

run_case "verify accepts a chaining kubelet leaf" 0 "${SCRIPT}" verify "${GOOD}"

OTHER="${WORK}/other"
mint_pair "${OTHER}" "other-kubelet-ca"
openssl req -newkey rsa:2048 -nodes \
  -keyout "${GOOD}/extra.key" -out "${GOOD}/extra.csr" \
  -subj "/CN=kubelet-b" >/dev/null 2>&1
cat > "${GOOD}/extra.ext" <<'EOF'
basicConstraints=CA:FALSE
extendedKeyUsage=serverAuth
subjectAltName=IP:192.0.2.11
EOF
openssl x509 -req -in "${GOOD}/extra.csr" -CA "${GOOD}/ca.crt" \
  -CAkey "${GOOD}/ca.key" -CAcreateserial \
  -out "${GOOD}/kubelet-b.crt" -days 30 -extfile "${GOOD}/extra.ext" \
  >/dev/null 2>&1
rm -f "${GOOD}/extra.key" "${GOOD}/extra.csr" "${GOOD}/extra.ext"
run_case "verify accepts every leaf that chains" 0 "${SCRIPT}" verify "${GOOD}"

SWAPPED="${WORK}/swapped"
mkdir -p "${SWAPPED}"
cp "${GOOD}/kubelet.crt" "${SWAPPED}/kubelet.crt"
cp "${OTHER}/ca.crt" "${SWAPPED}/ca.crt"
run_case "verify refuses a leaf that does not chain to ca.crt" 1 \
  "${SCRIPT}" verify "${SWAPPED}"

MIXED="${WORK}/mixed"
mkdir -p "${MIXED}"
cp "${GOOD}/ca.crt" "${GOOD}/kubelet.crt" "${MIXED}/"
cp "${OTHER}/kubelet.crt" "${MIXED}/kubelet-b.crt"
run_case "verify refuses one swapped leaf beside a good leaf" 1 \
  "${SCRIPT}" verify "${MIXED}"

MISSING="${WORK}/missing-ca"
mkdir -p "${MISSING}"
cp "${GOOD}/kubelet.crt" "${MISSING}/kubelet.crt"
run_case "verify refuses a missing CA" 1 "${SCRIPT}" verify "${MISSING}"

NOLEAF="${WORK}/missing-leaf"
mkdir -p "${NOLEAF}"
cp "${GOOD}/ca.crt" "${NOLEAF}/ca.crt"
run_case "verify refuses a missing kubelet leaf" 1 "${SCRIPT}" verify "${NOLEAF}"

REPO_OUT="${ROOT}/deploy/k8s/metrics-server-kubelet-ca-out"
mkdir -p "${REPO_OUT}"
cp "${GOOD}/ca.crt" "${GOOD}/kubelet.crt" "${REPO_OUT}/"
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
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_CA_APPLY= \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'create|apply' "${STUB_LOG}"; then
  bad "apply without the opt-in called kubectl"
else
  ok "apply without the opt-in called no kubectl"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="kind-local"
run_case "apply refuses a kind context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'create configmap|apply -f' "${STUB_LOG}"; then
  bad "kind apply wrote the configmap"
else
  ok "kind apply stopped before the configmap"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="minikube"
run_case "apply refuses a minikube context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -q 'metrics-server-kubelet-ca' "${STUB_LOG}"; then
  bad "minikube apply wrote the configmap"
else
  ok "minikube apply did not write the configmap"
fi

: > "${STUB_LOG}"
STUB_CONTEXT=""
run_case "apply refuses an empty context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'create configmap|apply -f' "${STUB_LOG}"; then
  bad "empty context wrote the configmap"
else
  ok "empty context stopped before the configmap"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="computerpets-prod"
run_case "apply refuses a leaf that does not chain before kubectl" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1 \
  "${SCRIPT}" apply "${SWAPPED}"
if [ -s "${STUB_LOG}" ]; then
  bad "a bad chain still called kubectl"
else
  ok "a bad chain called no kubectl"
fi

: > "${STUB_LOG}"
run_case "apply refuses a missing CA before kubectl" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1 \
  "${SCRIPT}" apply "${MISSING}"
if [ -s "${STUB_LOG}" ]; then
  bad "a missing CA still called kubectl"
else
  ok "a missing CA called no kubectl"
fi

: > "${STUB_LOG}"
run_case "apply with the opt-in writes the verified CA" 0 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1 \
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
  || grep -q "kubelet-insecure-tls" "${STUB_LOG}"; then
  bad "apply stub saw the manifest, caBundle, or a TLS skip"
else
  ok "apply stub saw no manifest, caBundle, or TLS skip"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
