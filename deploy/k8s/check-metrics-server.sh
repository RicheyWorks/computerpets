#!/usr/bin/env bash
# ADR 0084 / 0085 — metrics-server install path, two replicas, required anti-affinity.
# No cluster. Does not kubectl apply. The manifest stays out of kustomize.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MS="${ROOT}/deploy/k8s/metrics-server.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
HPA="${ROOT}/deploy/k8s/hpa.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0084-metrics-server.md"
ADR85="${ROOT}/docs/adr/0085-metrics-server-ha.md"
PASS=0
FAIL=0

ok() { PASS=$((PASS + 1)); echo "ok - $*"; }
bad() { FAIL=$((FAIL + 1)); echo "not ok - $*"; }

need_file() {
  if [ -f "$1" ]; then ok "file $(basename "$1")"
  else bad "missing $1"; fi
}

need_absent() {
  if [ -e "$1" ]; then bad "unexpected file $1"
  else ok "absent $(basename "$1")"; fi
}

# House comments may name a forbidden flag. The gate reads the YAML body.
yaml_body() {
  grep -vE '^[[:space:]]*#' "$1" || true
}

need_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE "$pattern" "$file"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file"))"; fi
}

need_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE "$pattern"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file") body)"; fi
}

need_not_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE "$pattern" "$file"; then bad "$name"
  else ok "$name"; fi
}

need_not_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE "$pattern"; then bad "$name"
  else ok "$name"; fi
}

echo "== metrics-server files =="
need_file "$MS"
need_file "$KUSTOM"
need_file "$HPA"
need_file "$BLUE"
need_file "$GREEN"
need_file "$README"
need_file "$ADR"
need_file "$ADR85"
need_absent "${ROOT}/deploy/k8s/Chart.yaml"
need_absent "${ROOT}/deploy/k8s/metrics-server/values.yaml"

echo "== upstream install contract =="
need_grep "$MS" 'Not in kustomization.yaml' "manifest says it stays out of kustomize"
need_grep "$MS" 'releases/download/v0\.9\.0/high-availability-1\.21\+\.yaml' "header cites upstream v0.9.0 high-availability-1.21+.yaml"
need_grep_body "$MS" '^kind: Deployment$' "kind includes a Deployment"
need_grep_body "$MS" '^kind: APIService$' "kind includes an APIService"
need_grep_body "$MS" 'name: metrics-server$' "addon name is metrics-server"
need_grep_body "$MS" 'namespace: kube-system$' "addon namespace is kube-system"
need_not_grep_body "$MS" 'namespace: computerpets$' "addon is not in the house namespace"
need_grep_body "$MS" 'image: registry\.k8s\.io/metrics-server/metrics-server:v0\.9\.0$' "image is pinned to v0.9.0"
need_not_grep_body "$MS" ':latest' "image tag is not floating"
need_not_grep_body "$MS" 'kubelet-insecure-tls' "kubelet scrapes stay verified"
need_grep_body "$MS" 'name: v1beta1\.metrics\.k8s\.io$' "APIService is v1beta1.metrics.k8s.io"
need_grep_body "$MS" 'group: metrics\.k8s\.io$' "API group is metrics.k8s.io"
need_grep_body "$MS" 'version: v1beta1$' "API version is v1beta1"
need_grep_body "$MS" 'insecureSkipTLSVerify: true' "upstream APIService serving-cert hop is present"
need_grep_body "$MS" 'runAsNonRoot: true' "container runs as non-root"
need_grep_body "$MS" 'readOnlyRootFilesystem: true' "root filesystem is read-only"
need_grep_body "$MS" 'allowPrivilegeEscalation: false' "privilege escalation is off"
need_grep_body "$MS" 'priorityClassName: system-cluster-critical' "priority class is system-cluster-critical"
need_grep_body "$MS" 'serviceAccountName: metrics-server' "service account is metrics-server"
need_grep_body "$MS" '^  replicas: 2$' "Deployment replicas is 2"
need_not_grep_body "$MS" '^  replicas: 1$' "Deployment is not a single replica"
need_grep_body "$MS" 'podAntiAffinity:' "pod anti-affinity is set"
need_grep_body "$MS" 'requiredDuringSchedulingIgnoredDuringExecution:' "anti-affinity is required"
need_not_grep_body "$MS" 'preferredDuringSchedulingIgnoredDuringExecution:' "anti-affinity is not a preference"
need_grep_body "$MS" 'topologyKey: kubernetes.io/hostname$' "anti-affinity topology is hostname"
need_grep_body "$MS" '^      maxUnavailable: 1$' "rolling update maxUnavailable is 1"
need_grep_body "$MS" '^kind: PodDisruptionBudget$' "addon disruption budget is present"
need_grep_body "$MS" '^  minAvailable: 1$' "addon budget keeps one pod"
need_not_grep_body "$MS" 'hostNetwork:[[:space:]]*true' "no host network"
need_not_grep_body "$MS" 'hostPID:[[:space:]]*true' "no host PID"
need_not_grep_body "$MS" 'privileged:[[:space:]]*true' "no privileged container"

if [ -f "$MS" ]; then
  image_count="$(yaml_body "$MS" | grep -c 'image: registry.k8s.io/metrics-server/metrics-server:v0.9.0' || true)"
  if [ "${image_count}" = "1" ]; then ok "one pinned metrics-server image"
  else bad "expected one pinned metrics-server image (found ${image_count})"; fi
  skip_count="$(yaml_body "$MS" | grep -c 'insecureSkipTLSVerify:' || true)"
  if [ "${skip_count}" = "1" ]; then ok "APIService TLS skip appears once"
  else bad "expected one insecureSkipTLSVerify (found ${skip_count})"; fi
  deploy_count="$(yaml_body "$MS" | grep -c '^kind: Deployment$' || true)"
  if [ "${deploy_count}" = "1" ]; then ok "one Deployment"
  else bad "expected one Deployment (found ${deploy_count})"; fi
  replica_count="$(yaml_body "$MS" | grep -c '^  replicas: 2$' || true)"
  if [ "${replica_count}" = "1" ]; then ok "replicas 2 appears once"
  else bad "expected one replicas: 2 (found ${replica_count})"; fi
  affinity_count="$(yaml_body "$MS" | grep -c 'podAntiAffinity:' || true)"
  if [ "${affinity_count}" = "1" ]; then ok "one podAntiAffinity"
  else bad "expected one podAntiAffinity (found ${affinity_count})"; fi
  pdb_count="$(yaml_body "$MS" | grep -c '^kind: PodDisruptionBudget$' || true)"
  if [ "${pdb_count}" = "1" ]; then ok "one addon PodDisruptionBudget"
  else bad "expected one addon PodDisruptionBudget (found ${pdb_count})"; fi
fi

echo "== stays out of local apply =="
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization does not list metrics-server.yaml"
need_grep "$KUSTOM" 'metrics-server\.yaml' "kustomization comment names the omitted file"
need_grep "$HPA" 'metrics-server\.yaml' "hpa.yaml names the install path"
need_grep "$HPA" 'minReplicas: 3' "HPA floor stays 3"
need_grep "$HPA" 'maxReplicas: 10' "HPA ceiling stays 10"
need_not_grep "$HPA" 'image:.*metrics-server' "hpa.yaml does not embed the addon image"
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"

echo "== docs =="
need_grep "$README" 'metrics-server\.yaml' "README names the manifest"
need_grep "$README" 'ADR 0084' "README names ADR 0084"
need_grep "$README" 'ADR 0085' "README names ADR 0085"
need_grep "$README" 'v0\.9\.0' "README names the pinned tag"
need_grep "$README" 'replicas: 2' "README names two replicas"
need_grep "$README" 'kubelet-insecure-tls' "README forbids the kubelet TLS skip"
need_grep "$ADR" 'v0\.9\.0' "ADR names the pinned tag"
need_grep "$ADR" 'metrics\.k8s\.io' "ADR names the API group"
need_grep "$ADR" 'kubelet-insecure-tls' "ADR forbids the kubelet TLS skip"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'not in the kustomization' "ADR keeps the file out of kustomize"
need_grep "$ADR85" 'replicas: 2' "HA ADR names two replicas"
need_grep "$ADR85" 'anti-affinity' "HA ADR names anti-affinity"
need_grep "$ADR85" 'high-availability-1.21+' "HA ADR names the upstream file"
need_grep "$ADR85" 'kubelet-insecure-tls' "HA ADR forbids the kubelet TLS skip"
need_grep "$ADR85" 'Catalog stays 221' "HA ADR keeps catalog 221"
need_grep "$ADR85" 'not in the kustomization' "HA ADR keeps the file out of kustomize"

if command -v kubectl >/dev/null 2>&1; then
  if kubectl apply --dry-run=client --validate=false -f "$MS" >/dev/null 2>&1; then
    ok "kubectl client dry-run accepts metrics-server.yaml"
  else
    bad "kubectl client dry-run rejected metrics-server.yaml"
  fi
else
  ok "kubectl not installed; skipped client dry-run"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
