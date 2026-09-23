#!/usr/bin/env bash
# ADR 0076 — managed JDBC sslmode and RDS rds.force_ssl stay paired.
# No cloud account. Does not terraform apply. Does not invent a CA bundle.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SSL="${ROOT}/src/main/java/com/enterprisepet/config/PostgresJdbcSsl.java"
GUARD="${ROOT}/src/main/java/com/enterprisepet/config/ProductionProfileGuard.java"
YAML="${ROOT}/src/main/resources/application.yml"
PROD_YAML="${ROOT}/src/main/resources/application-prod.yml"
PG_TF="${ROOT}/deploy/terraform/modules/postgres/main.tf"
VARS="${ROOT}/deploy/terraform/variables.tf"
OUTPUTS="${ROOT}/deploy/terraform/outputs.tf"
TFVARS="${ROOT}/deploy/terraform/terraform.tfvars.example"
MANAGED="${ROOT}/deploy/terraform/configmap-managed.example.yaml"
K8S_PG="${ROOT}/deploy/k8s/postgres.yaml"
K8S_CM="${ROOT}/deploy/k8s/configmap.yaml"
COMPOSE="${ROOT}/docker-compose.yml"
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
  if grep -qE "$pattern" "$file"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file"))"; fi
}

need_not_grep() {
  local file="$1" pattern="$2" name="$3"
  if grep -qE "$pattern" "$file"; then bad "$name"
  else ok "$name"; fi
}

echo "== postgres tls files =="
need_file "$SSL"
need_file "$GUARD"
need_file "$YAML"
need_file "$PG_TF"
need_file "$VARS"

echo "== app contract =="
need_grep "$SSL" 'ADR 0076' "JDBC helper names ADR 0076"
need_grep "$SSL" 'sslmode=require' "managed URL can require SSL"
need_grep "$SSL" 'sslmode=verify-full' "managed URL can verify-full"
need_grep "$SSL" 'all-or-nothing' "prod TLS is all-or-nothing"
need_grep "$SSL" 'BEGIN CERTIFICATE' "verify-full requires a PEM"
need_grep "$GUARD" 'POSTGRES_SSL_REQUIRED' "prod guard names POSTGRES_SSL_REQUIRED"
need_grep "$GUARD" 'rejectUnsafePostgresTls' "prod guard calls the TLS check"
need_grep "$YAML" 'ssl-required: \$\{POSTGRES_SSL_REQUIRED:false\}' "SSL required defaults false"
need_grep "$YAML" 'ssl-root-cert: \$\{POSTGRES_SSL_ROOT_CERT:\}' "CA path defaults empty"
need_grep "$PROD_YAML" 'ADR 0076' "prod yaml names ADR 0076"
need_not_grep "$SSL" 'BEGIN CERTIFICATE-----' "helper does not embed a certificate"

echo "== terraform shape =="
need_grep "$PG_TF" 'postgres-tls ADR 0076' "parameter group names ADR 0076"
need_grep "$PG_TF" 'name[[:space:]]*=[[:space:]]*"rds.force_ssl"' "parameter is rds.force_ssl"
need_grep "$PG_TF" 'value[[:space:]]*=[[:space:]]*"1"' "rds.force_ssl is 1"
need_grep "$PG_TF" 'parameter_group_name[[:space:]]*=[[:space:]]*aws_db_parameter_group.postgres' "instance uses the parameter group"
need_grep "$PG_TF" 'sslmode=require' "empty CA path query is require"
need_grep "$PG_TF" 'sslmode=verify-full' "CA path query is verify-full"
need_grep "$VARS" 'variable "postgres_ssl_root_cert"' "root CA path variable"
need_grep "$VARS" 'default[[:space:]]*=[[:space:]]*""' "CA path defaults empty"
need_grep "$OUTPUTS" 'output "postgres_force_ssl"' "force_ssl is an output"
need_grep "$OUTPUTS" 'output "postgres_sslmode"' "sslmode is an output"
need_grep "$MANAGED" 'sslmode=require' "managed configmap URL requires SSL"
need_grep "$MANAGED" 'POSTGRES_SSL_REQUIRED: "true"' "managed configmap sets the flag"
need_not_grep "$TFVARS" 'postgres_ssl_root_cert[[:space:]]*=' "tfvars example does not assign a CA path"
need_not_grep "$K8S_PG" 'sslmode=' "in-cluster Postgres has no sslmode"
need_grep "$K8S_PG" 'ADR 0076' "in-cluster comment names ADR 0076"
need_not_grep "$K8S_CM" 'sslmode=' "in-cluster ConfigMap URL has no sslmode"
need_grep "$K8S_CM" 'ADR 0076' "in-cluster ConfigMap names ADR 0076"
need_grep "$COMPOSE" 'ADR 0076' "compose leaves Postgres TLS unset"
need_not_grep "$COMPOSE" 'sslmode=' "compose JDBC URL has no sslmode"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
