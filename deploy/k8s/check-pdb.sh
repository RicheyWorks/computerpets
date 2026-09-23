#!/usr/bin/env bash
# ADR 0079 — prod API PodDisruptionBudget. Local kustomize does not apply it.
# No cluster. Does not kubectl apply.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PDB="${ROOT}/deploy/k8s/pdb.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
SVC="${ROOT}/deploy/k8s/service.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0079-pod-disruption-budget.md"
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

echo "== pdb files =="
need_file "$PDB"
need_file "$KUSTOM"
need_file "$BLUE"
need_file "$GREEN"
need_file "$SVC"
need_file "$README"
need_file "$ADR"

echo "== disruption contract =="
need_grep "$PDB" '^apiVersion: policy/v1$' "PDB is policy/v1"
need_grep "$PDB" '^kind: PodDisruptionBudget$' "kind is PodDisruptionBudget"
need_grep "$PDB" '^  name: computerpets$' "budget name is computerpets"
need_grep "$PDB" '^  namespace: computerpets$' "namespace is computerpets"
need_grep "$PDB" '^  minAvailable: 2$' "minAvailable is 2"
need_grep "$PDB" 'Not in kustomization.yaml' "manifest says it stays out of kustomize"
need_not_grep "$PDB" 'apiVersion: policy/v1beta1' "beta PDB API is not used"
need_not_grep "$PDB" 'maxUnavailable:' "budget is minAvailable, not maxUnavailable"
need_not_grep "$PDB" 'minAvailable:.*%' "minAvailable is a count, not a percent"
need_not_grep "$PDB" 'minAvailable: [01]$' "budget is not below 2"
need_not_grep "$PDB" 'color: green' "committed selector is not the idle color"
need_not_grep "$PDB" 'computerpets-postgres|computerpets-redis' "stores are not selected"

selector_block=""
if [ -f "$PDB" ]; then
  selector_block="$(awk '
    $0 ~ /^  selector:/ { capture=1; next }
    capture && $0 ~ /^  [^ ]/ { capture=0 }
    capture { print }
  ' "$PDB")"
fi
if printf '%s\n' "${selector_block}" | grep -q 'app: computerpets' \
  && printf '%s\n' "${selector_block}" | grep -q 'color: blue' \
  && ! printf '%s\n' "${selector_block}" | grep -qE 'green|postgres|redis'; then
  ok "selector is the live blue API color"
else
  bad "selector is the live blue API color"
fi

# Addon budget is metrics-server.yaml (ADR 0085). This count is the API budget.
pdb_count=0
if [ -d "${ROOT}/deploy/k8s" ]; then
  pdb_count="$(
    grep -l '^kind: PodDisruptionBudget$' "${ROOT}/deploy/k8s/"*.yaml 2>/dev/null \
      | grep -v '/metrics-server\.yaml$' \
      | wc -l \
      | tr -d ' ' \
    || true
  )"
fi
if [ "${pdb_count}" = "1" ]; then ok "one API PodDisruptionBudget in deploy/k8s"
else bad "expected one API PodDisruptionBudget in deploy/k8s (found ${pdb_count})"; fi

need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*pdb\.yaml[[:space:]]*$' "kustomization does not list pdb.yaml"

echo "== local apply stays unscaled =="
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
need_grep "$SVC" 'color: blue' "Service default live color is still blue"
need_not_grep "$BLUE" 'kind: PodDisruptionBudget' "blue file is not a disruption budget"
need_not_grep "$GREEN" 'kind: PodDisruptionBudget' "green file is not a disruption budget"

echo "== docs =="
need_grep "$README" 'ADR 0079' "README names ADR 0079"
need_grep "$README" 'pdb.yaml' "README names the manifest"
need_grep "$README" 'minAvailable' "README names the budget"
need_grep "$README" 'matchLabels' "README documents the cutover selector patch"
need_grep "$ADR" 'minAvailable' "ADR names the budget"
need_grep "$ADR" 'voluntary' "ADR limits the budget to voluntary disruption"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"

if command -v kubectl >/dev/null 2>&1; then
  if kubectl apply --dry-run=client --validate=false -f "$PDB" >/dev/null 2>&1; then
    ok "kubectl client dry-run accepts pdb.yaml"
  else
    bad "kubectl client dry-run rejected pdb.yaml"
  fi
  kust_out="$(mktemp)"
  if kubectl kustomize "${ROOT}/deploy/k8s" >"${kust_out}" 2>/tmp/cp-pdb-kust.err; then
    if grep -q 'kind: PodDisruptionBudget' "${kust_out}"; then
      bad "kustomize output includes a PodDisruptionBudget"
    else
      ok "kustomize output omits the PodDisruptionBudget"
    fi
  else
    bad "kubectl kustomize deploy/k8s failed"
    cat /tmp/cp-pdb-kust.err || true
  fi
  rm -f "${kust_out}" /tmp/cp-pdb-kust.err
else
  ok "kubectl not installed; skipped client dry-run and kustomize"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
