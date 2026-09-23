#!/usr/bin/env bash
# ADR 0078 — prod API HorizontalPodAutoscaler. Local kustomize stays unscaled.
# No cluster. Does not install metrics-server. Does not kubectl apply.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HPA="${ROOT}/deploy/k8s/hpa.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
SVC="${ROOT}/deploy/k8s/service.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0078-horizontal-pod-autoscaling.md"
PASS=0
FAIL=0

ok() { PASS=$((PASS + 1)); echo "ok - $*"; }
bad() { FAIL=$((FAIL + 1)); echo "not ok - $*"; }

need_file() {
  if [ -f "$1" ]; then ok "file $(basename "$1")"
  else bad "missing $1"; fi
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

need_not_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE "$pattern" "$file"; then bad "$name"
  else ok "$name"; fi
}

echo "== hpa files =="
need_file "$HPA"
need_file "$KUSTOM"
need_file "$BLUE"
need_file "$GREEN"
need_file "$SVC"
need_file "$README"
need_file "$ADR"

echo "== autoscaler contract =="
need_grep "$HPA" '^apiVersion: autoscaling/v2$' "HPA is autoscaling/v2"
need_grep "$HPA" '^kind: HorizontalPodAutoscaler$' "kind is HorizontalPodAutoscaler"
need_grep "$HPA" 'name: computerpets-blue' "scale target is the blue API deployment"
need_grep "$HPA" 'kind: Deployment' "scale target is a Deployment"
need_grep "$HPA" 'minReplicas: 3' "floor is 3"
need_grep "$HPA" 'maxReplicas: 3' "ceiling is 3 (ADR 0108)"
need_grep "$HPA" 'name: cpu' "cpu is a metric"
need_grep "$HPA" 'averageUtilization: 70' "cpu target is 70 percent of the request"
need_grep "$HPA" 'name: memory' "memory is a metric"
need_grep "$HPA" 'type: AverageValue' "memory target is an absolute value"
need_grep "$HPA" 'averageValue: 800Mi' "memory scale line is 800Mi"
need_grep "$HPA" 'stabilizationWindowSeconds: 300' "scale down waits 300s"
need_grep "$HPA" 'metrics-server' "manifest names the metrics-server dependency"
need_grep "$HPA" 'Not in kustomization.yaml' "manifest says it stays out of kustomize"
need_not_grep "$HPA" 'name: computerpets-green' "HPA does not target the idle green deployment"
need_not_grep "$HPA" 'type: (External|Object|ContainerResource)' "no adapter metrics"
if [ -f "$HPA" ]; then
  util_count="$(grep -c 'averageUtilization:' "$HPA" || true)"
  if [ "${util_count}" = "1" ]; then ok "only the cpu metric uses a utilization percent"
  else bad "expected one averageUtilization (cpu only), found ${util_count}"; fi
fi
need_not_grep "$HPA" 'image:.*metrics-server' "this repo does not install metrics-server"
need_not_grep "$HPA" 'minReplicas: [012]$' "floor is not below 3"
need_not_grep "$HPA" 'computerpets-postgres|computerpets-redis' "stores are not scale targets"

# Only one autoscaler, and kustomize must not apply it.
hpa_count=0
if [ -d "${ROOT}/deploy/k8s" ]; then
  hpa_count="$(grep -l '^kind: HorizontalPodAutoscaler$' "${ROOT}/deploy/k8s/"*.yaml 2>/dev/null | wc -l | tr -d ' ')"
fi
if [ "${hpa_count}" = "1" ]; then ok "one HorizontalPodAutoscaler in deploy/k8s"
else bad "expected one HorizontalPodAutoscaler in deploy/k8s (found ${hpa_count})"; fi

need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*hpa\.yaml[[:space:]]*$' "kustomization does not list hpa.yaml"

echo "== local apply stays unscaled =="
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
need_grep "$BLUE" 'cpu: 250m' "blue cpu request is the utilization base"
need_grep "$BLUE" 'memory: 512Mi' "blue memory request stays 512Mi"
need_grep "$BLUE" 'memory: 1Gi' "blue memory limit stays 1Gi"
need_grep "$GREEN" 'cpu: 250m' "green keeps the same cpu request for a later retarget"
need_grep "$SVC" 'color: blue' "Service default live color is still blue"
need_not_grep "$BLUE" 'replicas: 3' "blue manifest is not pre-scaled to the HPA floor"
need_not_grep "$GREEN" 'kind: HorizontalPodAutoscaler' "green file is not an autoscaler"

echo "== docs =="
need_grep "$README" 'metrics-server' "README documents metrics-server"
need_grep "$README" 'ADR 0078' "README names ADR 0078"
need_grep "$README" 'hpa.yaml' "README names the manifest"
need_grep "$ADR" 'metrics-server' "ADR documents metrics-server"
need_grep "$ADR" 'minReplicas' "ADR names the floor"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"

if command -v kubectl >/dev/null 2>&1; then
  if kubectl apply --dry-run=client --validate=false -f "$HPA" >/dev/null 2>&1; then
    ok "kubectl client dry-run accepts hpa.yaml"
  else
    bad "kubectl client dry-run rejected hpa.yaml"
  fi
else
  ok "kubectl not installed; skipped client dry-run"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
