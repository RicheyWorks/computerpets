#!/usr/bin/env bash
# ADR 0081 — soft zone spread beside the hostname constraint (ADR 0080).
# No cluster. Does not kubectl apply. Local replica counts stay put.
# DoNotSchedule is refused: it strands a single-zone cluster and nodes
# that omit topology.kubernetes.io/zone.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
POSTGRES="${ROOT}/deploy/k8s/postgres.yaml"
REDIS="${ROOT}/deploy/k8s/redis.yaml"
SVC="${ROOT}/deploy/k8s/service.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0081-api-pod-zone-spread.md"
HOST_ADR="${ROOT}/docs/adr/0080-api-pod-topology-spread.md"
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

# Print the topologySpreadConstraints list item whose topologyKey matches.
constraint_item() {
  local file="$1" key="$2"
  awk -v key="$key" '
    $0 ~ /^        - maxSkew:/ {
      if (capture && hit) print item
      item=$0
      capture=1
      hit=0
      next
    }
    capture && $0 ~ /^      [^ ]/ {
      if (hit) print item
      capture=0
      exit
    }
    capture {
      item=item "\n" $0
      if (index($0, "topologyKey: " key)) hit=1
    }
    END { if (capture && hit) print item }
  ' "$file"
}

check_zone() {
  local file="$1" color="$2" name="$3"
  local zone host other zone_keys
  if [ ! -f "$file" ]; then
    bad "${name} zone constraint (missing $(basename "$file"))"
    return
  fi
  zone="$(constraint_item "$file" "topology.kubernetes.io/zone")"
  if [ -z "${zone}" ]; then
    bad "${name} has a zone topologySpreadConstraints item"
    return
  fi
  ok "${name} has a zone topologySpreadConstraints item"
  if printf '%s\n' "${zone}" | grep -q 'maxSkew: 1' \
    && printf '%s\n' "${zone}" | grep -q 'topologyKey: topology.kubernetes.io/zone' \
    && printf '%s\n' "${zone}" | grep -q 'whenUnsatisfiable: ScheduleAnyway' \
    && printf '%s\n' "${zone}" | grep -q 'nodeTaintsPolicy: Honor' \
    && printf '%s\n' "${zone}" | grep -q 'app: computerpets' \
    && printf '%s\n' "${zone}" | grep -q "color: ${color}"; then
    ok "${name} soft-spreads color=${color} across zones"
  else
    bad "${name} soft-spreads color=${color} across zones"
  fi
  if [ "${color}" = "blue" ]; then other="green"; else other="blue"; fi
  if printf '%s\n' "${zone}" | grep -q "color: ${other}"; then
    bad "${name} zone selector is not the other color"
  else
    ok "${name} zone selector is not the other color"
  fi
  if printf '%s\n' "${zone}" | grep -qE 'DoNotSchedule|minDomains:|matchLabelKeys:'; then
    bad "${name} zone constraint stays soft, with no minDomains"
  else
    ok "${name} zone constraint stays soft, with no minDomains"
  fi
  host="$(constraint_item "$file" "kubernetes.io/hostname")"
  if [ -n "${host}" ] \
    && printf '%s\n' "${host}" | grep -q 'whenUnsatisfiable: ScheduleAnyway' \
    && printf '%s\n' "${host}" | grep -q "color: ${color}"; then
    ok "${name} keeps the hostname constraint beside zone"
  else
    bad "${name} keeps the hostname constraint beside zone"
  fi
  zone_keys="$(grep -c 'topologyKey: topology.kubernetes.io/zone' "$file" || true)"
  if [ "${zone_keys}" = "1" ]; then ok "${name} has one zone key"
  else bad "${name} has one zone key (found ${zone_keys})"; fi
}

echo "== zone spread files =="
need_file "$KUSTOM"
need_file "$BLUE"
need_file "$GREEN"
need_file "$POSTGRES"
need_file "$REDIS"
need_file "$SVC"
need_file "$README"
need_file "$ADR"
need_file "$HOST_ADR"

echo "== zone spread contract =="
check_zone "$BLUE" blue "blue"
check_zone "$GREEN" green "green"
need_not_grep "$BLUE" 'whenUnsatisfiable: DoNotSchedule' "blue does not hard-fail an unspreadable zone"
need_not_grep "$GREEN" 'whenUnsatisfiable: DoNotSchedule' "green does not hard-fail an unspreadable zone"
need_not_grep "$POSTGRES" 'topology.kubernetes.io/zone' "postgres scaffolding is not zone-spread"
need_not_grep "$REDIS" 'topology.kubernetes.io/zone' "redis scaffolding is not zone-spread"

echo "== local apply stays small =="
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
need_grep "$SVC" 'color: blue' "Service default live color is still blue"
need_grep "$KUSTOM" 'ADR 0081' "kustomize comment records zone spread"
need_grep "$KUSTOM" 'ScheduleAnyway' "kustomize comment records the soft rule"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*hpa\.yaml[[:space:]]*$' "kustomization still omits hpa.yaml"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*pdb\.yaml[[:space:]]*$' "kustomization still omits pdb.yaml"

echo "== docs =="
need_grep "$README" 'ADR 0081' "README names ADR 0081"
need_grep "$README" 'topology.kubernetes.io/zone' "README names the zone key"
need_grep "$README" 'ScheduleAnyway' "README names the soft action"
need_grep "$README" 'two availability zones' "README states the prod multi-AZ expectation"
need_grep "$ADR" 'ScheduleAnyway' "ADR names the soft action"
need_grep "$ADR" 'DoNotSchedule' "ADR names the hard action"
need_grep "$ADR" 'topology.kubernetes.io/zone' "ADR names the zone key"
need_grep "$ADR" 'kubernetes.io/hostname' "ADR keeps the hostname cross-link"
need_grep "$ADR" 'at least two availability zones' "ADR states the prod multi-AZ expectation"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$HOST_ADR" '0081' "hostname ADR cross-links zone spread"

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
  if kubectl kustomize "${ROOT}/deploy/k8s" >"${kust_out}" 2>/tmp/cp-zone-kust.err; then
    zone_n="$(grep -c 'topologyKey: topology.kubernetes.io/zone' "${kust_out}" || true)"
    host_n="$(grep -c 'topologyKey: kubernetes.io/hostname' "${kust_out}" || true)"
    soft_n="$(grep -c 'whenUnsatisfiable: ScheduleAnyway' "${kust_out}" || true)"
    if [ "${zone_n}" = "2" ] && [ "${host_n}" = "2" ] && [ "${soft_n}" = "4" ] \
      && ! grep -q 'whenUnsatisfiable: DoNotSchedule' "${kust_out}"; then
      ok "kustomize output keeps soft zone spread beside hostname"
    else
      bad "kustomize output keeps soft zone spread beside hostname (zone=${zone_n} host=${host_n} soft=${soft_n})"
    fi
  else
    bad "kubectl kustomize deploy/k8s failed"
    cat /tmp/cp-zone-kust.err || true
  fi
  rm -f "${kust_out}" /tmp/cp-zone-kust.err
else
  ok "kubectl not installed; skipped client dry-run and kustomize"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
