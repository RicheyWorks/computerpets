#!/usr/bin/env bash
# ADR 0080 — soft hostname spread on the API Deployments.
# Zone spread is a second constraint (ADR 0081); check-zone-spread.sh locks it.
# No cluster. Does not kubectl apply. Local replica counts stay put.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
POSTGRES="${ROOT}/deploy/k8s/postgres.yaml"
REDIS="${ROOT}/deploy/k8s/redis.yaml"
SVC="${ROOT}/deploy/k8s/service.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0080-api-pod-topology-spread.md"
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

spread_block() {
  awk '
    $0 ~ /^      topologySpreadConstraints:/ { capture=1; next }
    capture && $0 ~ /^      [^ ]/ { exit }
    capture { print }
  ' "$1"
}

check_spread() {
  local file="$1" color="$2" name="$3"
  local block other keys
  if [ ! -f "$file" ]; then
    bad "${name} spread block (missing $(basename "$file"))"
    return
  fi
  block="$(spread_block "$file")"
  if [ -z "${block}" ]; then
    bad "${name} has a topologySpreadConstraints block"
    return
  fi
  ok "${name} has a topologySpreadConstraints block"
  if printf '%s\n' "${block}" | grep -q 'maxSkew: 1' \
    && printf '%s\n' "${block}" | grep -q 'topologyKey: kubernetes.io/hostname' \
    && printf '%s\n' "${block}" | grep -q 'whenUnsatisfiable: ScheduleAnyway' \
    && printf '%s\n' "${block}" | grep -q 'nodeTaintsPolicy: Honor' \
    && printf '%s\n' "${block}" | grep -q 'app: computerpets' \
    && printf '%s\n' "${block}" | grep -q "color: ${color}"; then
    ok "${name} soft-spreads color=${color} across hostnames"
  else
    bad "${name} soft-spreads color=${color} across hostnames"
  fi
  if [ "${color}" = "blue" ]; then other="green"; else other="blue"; fi
  if printf '%s\n' "${block}" | grep -q "color: ${other}"; then
    bad "${name} spread selector is not the other color"
  else
    ok "${name} spread selector is not the other color"
  fi
  keys="$(printf '%s\n' "${block}" | grep -c 'topologyKey:' || true)"
  if [ "${keys}" = "2" ] \
    && printf '%s\n' "${block}" | grep -q 'topologyKey: kubernetes.io/hostname' \
    && printf '%s\n' "${block}" | grep -q 'topologyKey: topology.kubernetes.io/zone'; then
    ok "${name} keeps the hostname key beside the zone key"
  else
    bad "${name} keeps the hostname key beside the zone key (found ${keys})"
  fi
  if printf '%s\n' "${block}" | grep -qE 'DoNotSchedule|minDomains:|matchLabelKeys:'; then
    bad "${name} spread block stays soft, with no minDomains"
  else
    ok "${name} spread block stays soft, with no minDomains"
  fi
}

echo "== spread files =="
need_file "$KUSTOM"
need_file "$BLUE"
need_file "$GREEN"
need_file "$POSTGRES"
need_file "$REDIS"
need_file "$SVC"
need_file "$README"
need_file "$ADR"

echo "== hostname spread contract =="
check_spread "$BLUE" blue "blue"
check_spread "$GREEN" green "green"
need_not_grep "$BLUE" 'whenUnsatisfiable: DoNotSchedule' "blue does not hard-fail unspreadable pods"
need_not_grep "$GREEN" 'whenUnsatisfiable: DoNotSchedule' "green does not hard-fail unspreadable pods"
need_not_grep "$BLUE" 'requiredDuringSchedulingIgnoredDuringExecution' "blue has no required anti-affinity"
need_not_grep "$GREEN" 'requiredDuringSchedulingIgnoredDuringExecution' "green has no required anti-affinity"
need_not_grep "$BLUE" 'podAntiAffinity:' "blue does not also anti-affinity"
need_not_grep "$GREEN" 'podAntiAffinity:' "green does not also anti-affinity"
need_not_grep "$POSTGRES" 'topologySpreadConstraints:' "postgres scaffolding is not spread"
need_not_grep "$REDIS" 'topologySpreadConstraints:' "redis scaffolding is not spread"

echo "== local apply stays small =="
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
need_grep "$SVC" 'color: blue' "Service default live color is still blue"
need_grep "$KUSTOM" 'deployment-blue.yaml' "kustomize still applies blue"
need_grep "$KUSTOM" 'deployment-green.yaml' "kustomize still applies green"
need_grep "$KUSTOM" 'ScheduleAnyway' "kustomize comment records the soft rule"
need_not_grep "$BLUE" 'replicas: 3' "blue manifest is not pre-scaled to the HPA floor"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*hpa\.yaml[[:space:]]*$' "kustomization still omits hpa.yaml"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*pdb\.yaml[[:space:]]*$' "kustomization still omits pdb.yaml"

echo "== docs =="
need_grep "$README" 'ADR 0080' "README names ADR 0080"
need_grep "$README" 'ScheduleAnyway' "README names the soft action"
need_grep "$README" 'DoNotSchedule' "README names the hard action it refuses"
need_grep "$ADR" 'ScheduleAnyway' "ADR names the soft action"
need_grep "$ADR" 'DoNotSchedule' "ADR names the hard action"
need_grep "$ADR" 'kubernetes.io/hostname' "ADR names the hostname key"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"

if command -v kubectl >/dev/null 2>&1; then
  for manifest in "$BLUE" "$GREEN"; do
    err="$(mktemp)"
    if kubectl apply --dry-run=client --validate=false -f "$manifest" >/dev/null 2>"${err}"; then
      ok "kubectl client dry-run accepts $(basename "$manifest")"
    elif grep -qE 'connection refused|localhost:8080|no configuration has been provided' "${err}"; then
      ok "kubectl has no reachable API; skipped client dry-run of $(basename "$manifest")"
    else
      bad "kubectl client dry-run rejected $(basename "$manifest")"
      cat "${err}" || true
    fi
    rm -f "${err}"
  done
  kust_out="$(mktemp)"
  if kubectl kustomize "${ROOT}/deploy/k8s" >"${kust_out}" 2>/tmp/cp-spread-kust.err; then
    if grep -q 'whenUnsatisfiable: ScheduleAnyway' "${kust_out}" \
      && grep -q 'topologyKey: kubernetes.io/hostname' "${kust_out}" \
      && ! grep -q 'whenUnsatisfiable: DoNotSchedule' "${kust_out}"; then
      ok "kustomize output keeps the soft hostname spread"
    else
      bad "kustomize output keeps the soft hostname spread"
    fi
  else
    bad "kubectl kustomize deploy/k8s failed"
    cat /tmp/cp-spread-kust.err || true
  fi
  rm -f "${kust_out}" /tmp/cp-spread-kust.err
else
  ok "kubectl not installed; skipped client dry-run and kustomize"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
