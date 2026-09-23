#!/usr/bin/env bash
# ADR 0111 — the metrics-server serving cert must chain to the CA that
# becomes APIService caBundle, and its DNS SAN must be
# metrics-server.kube-system.svc. Apply refuses otherwise.
# No cluster. Does not kubectl apply. No terraform apply.
# Kind and minikube stay off this file. Do not set --kubelet-insecure-tls.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="${ROOT}/deploy/k8s/metrics-server-serving-cert.sh"
MS="${ROOT}/deploy/k8s/metrics-server.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0111-metrics-server-serving-cert-chain.md"
ADR87="${ROOT}/docs/adr/0087-metrics-server-serving-cert.md"
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

echo "== serving cert chain files =="
need_file "$SCRIPT"
need_file "$MS"
need_file "$KUSTOM"
need_file "$README"
need_file "$ADR"
need_file "$ADR87"
need_not_grep "$SCRIPT" 'BEGIN CERTIFICATE' "the generator does not vendor a certificate"
need_not_grep "$SCRIPT" 'BEGIN PRIVATE KEY' "the generator does not vendor a key"
need_not_grep "$SCRIPT" 'BEGIN RSA PRIVATE KEY' "the generator does not vendor an RSA key"
if [ -f "$SCRIPT" ] && grep -q "kubelet-insecure-tls" "$SCRIPT"; then
  if grep -vE '^[[:space:]]*#' "$SCRIPT" | grep -q "kubelet-insecure-tls"; then
    bad "generator sets --kubelet-insecure-tls"
  else
    ok "generator only names --kubelet-insecure-tls to forbid it"
  fi
else
  bad "generator does not record the kubelet TLS skip as forbidden"
fi
need_not_grep "$MS" 'BEGIN CERTIFICATE' "metrics-server.yaml does not vendor a certificate"
need_grep "$SCRIPT" 'SERVING_SAN="metrics-server\.kube-system\.svc"' "SAN is metrics-server.kube-system.svc"
need_grep "$SCRIPT" 'subjectAltName=DNS:\$\{SERVING_SAN\}' "the minted leaf uses that SAN"
need_grep "$SCRIPT" 'caBundle' "apply writes APIService caBundle"
need_grep "$SCRIPT" 'COMPUTERPETS_METRICS_SERVING_APPLY' "apply is opt-in"
need_grep "$SCRIPT" '\*kind\*|\*minikube\*' "apply refuses kind and minikube"
need_grep "$SCRIPT" 'metrics-server-serving' "secret name stays metrics-server-serving"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization still omits metrics-server"
need_grep "$KUSTOM" 'ADR 0111' "kustomize comment names the serving chain"
need_grep "$MS" 'ADR 0111' "manifest names ADR 0111"
need_grep "$MS" '--tls-cert-file=/etc/metrics-server/serving/tls\.crt' "manifest still points at the serving cert"
need_grep "$MS" 'secretName: metrics-server-serving' "manifest still mounts the serving Secret"
need_not_grep_body "$MS" 'insecureSkipTLSVerify' "APIService does not skip serving-cert verification"
need_not_grep_body "$MS" 'caBundle:' "the manifest does not vendor caBundle"
need_not_grep_body "$MS" 'kubelet-insecure-tls' "kubelet scrapes stay verified"
need_grep "$README" 'ADR 0111' "README names ADR 0111"
need_grep "$README" 'metrics-server-serving-cert\.sh' "README names the generator"
need_grep "$README" 'metrics-server\.kube-system\.svc' "README names the SAN"
need_grep "$ADR" 'caBundle' "ADR names caBundle"
need_grep "$ADR" 'metrics-server\.kube-system\.svc' "ADR names the SAN"
need_grep "$ADR" 'does not chain' "ADR names the chain failure"
need_grep "$ADR" 'COMPUTERPETS_METRICS_SERVING_APPLY' "ADR names the apply gate"
need_grep "$ADR" 'Kind and minikube' "ADR names kind and minikube"
need_grep "$ADR" 'No live AWS apply' "ADR does not apply to AWS"
need_grep "$ADR" 'kubelet-insecure-tls' "ADR forbids the kubelet TLS skip"
need_grep "$ADR" 'insecureSkipTLSVerify' "ADR forbids the APIService skip"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'metrics-server-kubelet-ca' "ADR names the kubelet CA residual"
need_grep "$ADR" 'kubectl top' "ADR names kubectl top"
need_grep "$ADR87" '0111' "serving-cert ADR points at the chain gate"

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

start = text.find("cmd_apply()")
end = text.find("\n[ \"$#\"", start)
body = text[start:end] if start >= 0 and end > start else ""
check(start >= 0 and "cmd_verify" in body, "apply calls verify")
verify_at = body.find("cmd_verify")
kubectl_at = body.find("kubectl")
check(verify_at >= 0 and kubectl_at > verify_at, "apply verifies before kubectl")
check('COMPUTERPETS_METRICS_SERVING_APPLY:-}" != "1"' in body, "apply stays off without the opt-in")
check("*kind*|*minikube*" in body, "apply case refuses kind and minikube")
check("ca.crt" in body and "caBundle" in body, "apply patches caBundle from ca.crt")
check("kubelet-insecure-tls" not in body, "apply does not set the kubelet TLS skip")
check("insecureSkipTLSVerify" not in body, "apply does not skip APIService verification")
if failed:
    sys.exit(1)
PY

run_case() {
  local name="$1"
  local want="$2"
  shift 2
  local got=0
  "$@" >/tmp/cp-ms-serve-out.$$ 2>/tmp/cp-ms-serve-err.$$ || got=$?
  if [ "${got}" -eq "${want}" ]; then
    ok "${name}"
  else
    bad "${name} (want exit ${want}, got ${got})"
    echo "--- stdout ---"; cat /tmp/cp-ms-serve-out.$$ || true
    echo "--- stderr ---"; cat /tmp/cp-ms-serve-err.$$ || true
  fi
  rm -f /tmp/cp-ms-serve-out.$$ /tmp/cp-ms-serve-err.$$
}

if [ ! -x "$SCRIPT" ]; then
  bad "generator is not executable"
else
  ok "generator is executable"
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
run_case "render mints a chaining cert" 0 "${SCRIPT}" render "${GOOD}"
if [ -f "${GOOD}/tls.crt" ]; then
  ok "render wrote tls.crt outside the repo"
else
  bad "render did not write tls.crt"
fi
if grep -Rqs "BEGIN CERTIFICATE" "${ROOT}/deploy/k8s" --include='*.crt' --include='*.pem' --include='*.key'; then
  bad "a certificate file landed under deploy/k8s"
else
  ok "no certificate file landed under deploy/k8s"
fi

run_case "verify accepts the minted cert" 0 "${SCRIPT}" verify "${GOOD}"
CA_BEFORE="$(openssl x509 -in "${GOOD}/ca.crt" -noout -fingerprint -sha256)"
run_case "second render rotates the leaf and keeps the CA" 0 "${SCRIPT}" render "${GOOD}"
CA_AFTER="$(openssl x509 -in "${GOOD}/ca.crt" -noout -fingerprint -sha256)"
if [ "${CA_BEFORE}" = "${CA_AFTER}" ]; then
  ok "a second render keeps ca.crt when ca.key remains"
else
  bad "a second render replaced ca.crt"
fi
rm -f "${GOOD}/ca.key" "${GOOD}/ca.crt" "${GOOD}/ca.srl"
run_case "render without ca.key mints a new CA" 0 "${SCRIPT}" render "${GOOD}"
CA_ROTATED="$(openssl x509 -in "${GOOD}/ca.crt" -noout -fingerprint -sha256)"
if [ "${CA_BEFORE}" != "${CA_ROTATED}" ]; then
  ok "dropping ca.key rotates the CA"
else
  bad "dropping ca.key reused the previous CA"
fi
run_case "rotated CA still verifies" 0 "${SCRIPT}" verify "${GOOD}"

BAD_SAN="${WORK}/bad-san"
mkdir -p "${BAD_SAN}"
cp "${GOOD}/ca.crt" "${GOOD}/ca.key" "${GOOD}/tls.key" "${BAD_SAN}/"
openssl req -new -key "${BAD_SAN}/tls.key" -out "${BAD_SAN}/tls.csr" \
  -subj "/CN=wrong.example" \
  -addext "subjectAltName=DNS:metrics-server.kube-system.svc.cluster.local" \
  >/dev/null 2>&1
cat > "${BAD_SAN}/leaf.ext" <<'EOF'
subjectAltName=DNS:metrics-server.kube-system.svc.cluster.local
basicConstraints=CA:FALSE
EOF
openssl x509 -req -in "${BAD_SAN}/tls.csr" -CA "${BAD_SAN}/ca.crt" \
  -CAkey "${BAD_SAN}/ca.key" -CAcreateserial \
  -out "${BAD_SAN}/tls.crt" -days 90 -extfile "${BAD_SAN}/leaf.ext" \
  >/dev/null 2>&1
run_case "verify refuses a SAN that is only the cluster.local name" 1 \
  "${SCRIPT}" verify "${BAD_SAN}"

OTHER="${WORK}/other"
run_case "render a second CA" 0 "${SCRIPT}" render "${OTHER}"
SWAPPED="${WORK}/swapped"
mkdir -p "${SWAPPED}"
cp "${GOOD}/tls.crt" "${GOOD}/tls.key" "${SWAPPED}/"
cp "${OTHER}/ca.crt" "${SWAPPED}/ca.crt"
run_case "verify refuses a leaf that does not chain to ca.crt" 1 \
  "${SCRIPT}" verify "${SWAPPED}"

MISKEY="${WORK}/miskey"
mkdir -p "${MISKEY}"
cp "${GOOD}/tls.crt" "${GOOD}/ca.crt" "${MISKEY}/"
cp "${OTHER}/tls.key" "${MISKEY}/tls.key"
run_case "verify refuses a key that does not match the cert" 1 \
  "${SCRIPT}" verify "${MISKEY}"

REPO_OUT="${ROOT}/deploy/k8s/metrics-server-serving-out"
run_case "render refuses a directory inside the repo" 1 \
  "${SCRIPT}" render "${REPO_OUT}"
if [ -e "${REPO_OUT}" ]; then
  bad "repo render left ${REPO_OUT}"
  rm -rf "${REPO_OUT}"
else
  ok "repo render left no directory"
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
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_SERVING_APPLY= \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'patch|create|apply' "${STUB_LOG}"; then
  bad "apply without the opt-in called kubectl"
else
  ok "apply without the opt-in called no kubectl"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="kind-local"
run_case "apply refuses a kind context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_SERVING_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -qE 'patch|create secret|apply -f' "${STUB_LOG}"; then
  bad "kind apply wrote the secret or caBundle"
else
  ok "kind apply stopped before the secret"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="minikube"
run_case "apply refuses a minikube context" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_SERVING_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
if grep -q 'caBundle' "${STUB_LOG}"; then
  bad "minikube apply patched caBundle"
else
  ok "minikube apply did not patch caBundle"
fi

: > "${STUB_LOG}"
STUB_CONTEXT="computerpets-prod"
run_case "apply refuses a leaf that does not chain before kubectl" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_SERVING_APPLY=1 \
  "${SCRIPT}" apply "${SWAPPED}"
if [ -s "${STUB_LOG}" ]; then
  bad "a bad chain still called kubectl"
else
  ok "a bad chain called no kubectl"
fi

: > "${STUB_LOG}"
run_case "apply refuses the wrong SAN before kubectl" 1 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_SERVING_APPLY=1 \
  "${SCRIPT}" apply "${BAD_SAN}"
if [ -s "${STUB_LOG}" ]; then
  bad "a bad SAN still called kubectl"
else
  ok "a bad SAN called no kubectl"
fi

: > "${STUB_LOG}"
run_case "apply with the opt-in patches caBundle from ca.crt" 0 \
  env PATH="${STUB}:${PATH}" COMPUTERPETS_METRICS_SERVING_APPLY=1 \
  "${SCRIPT}" apply "${GOOD}"
CA_B64="$(openssl base64 -A -in "${GOOD}/ca.crt")"
if grep -q "caBundle" "${STUB_LOG}" && grep -q "${CA_B64}" "${STUB_LOG}" \
  && grep -q "metrics-server-serving" "${STUB_LOG}" \
  && grep -q "metrics-server.yaml" "${STUB_LOG}"; then
  ok "apply stub saw the secret, the manifest, and the CA bytes"
else
  bad "apply stub did not see the secret, the manifest, and the CA bytes"
  echo "--- stub log ---"; cat "${STUB_LOG}" || true
fi
if grep -q "kubelet-insecure-tls" "${STUB_LOG}" || grep -q "insecureSkipTLSVerify" "${STUB_LOG}"; then
  bad "apply stub saw a TLS skip"
else
  ok "apply stub saw no TLS skip"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
