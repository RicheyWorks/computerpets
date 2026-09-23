#!/usr/bin/env bash
# ADR 0075 — app Redis URI and ElastiCache AUTH/TLS stay paired.
# No cloud account. Does not terraform apply. Does not print a token.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
URI="${ROOT}/src/main/java/com/enterprisepet/config/RateLimitConfiguration.java"
PROPS="${ROOT}/src/main/java/com/enterprisepet/config/RateLimitProperties.java"
GUARD="${ROOT}/src/main/java/com/enterprisepet/config/ProductionProfileGuard.java"
FILES="${ROOT}/src/main/java/com/enterprisepet/config/SecretFileEnvironmentPostProcessor.java"
YAML="${ROOT}/src/main/resources/application.yml"
REDIS_TF="${ROOT}/deploy/terraform/modules/redis/main.tf"
VARS="${ROOT}/deploy/terraform/variables.tf"
OUTPUTS="${ROOT}/deploy/terraform/outputs.tf"
TFVARS="${ROOT}/deploy/terraform/terraform.tfvars.example"
K8S_REDIS="${ROOT}/deploy/k8s/redis.yaml"
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

echo "== redis auth files =="
need_file "$URI"
need_file "$PROPS"
need_file "$GUARD"
need_file "$FILES"
need_file "$YAML"
need_file "$REDIS_TF"
need_file "$VARS"

echo "== app URI =="
need_grep "$URI" 'redis-auth ADR 0075' "URI builder names ADR 0075"
need_grep "$URI" 'withPassword' "Lettuce URI takes a password"
need_grep "$URI" 'withSsl\(true\)' "Lettuce URI can enable TLS"
need_grep "$URI" 'withVerifyPeer\(true\)' "TLS verifies the peer"
need_grep "$URI" 'isAuthRequired' "auth-required is fail-closed"
need_not_grep "$URI" 'withStartTls\(true\)' "TLS is not STARTTLS"
need_not_grep "$URI" 'jedis' "no second Jedis client"
need_grep "$YAML" 'password: \$\{REDIS_PASSWORD:\}' "password defaults empty"
need_grep "$YAML" 'ssl: \$\{REDIS_SSL:false\}' "SSL defaults false"
need_grep "$YAML" 'auth-required: \$\{REDIS_AUTH_REQUIRED:false\}' "auth-required defaults false"
need_grep "$FILES" '"REDIS_PASSWORD"' "REDIS_PASSWORD_FILE is a secret file"
need_grep "$GUARD" 'REDIS_AUTH_REQUIRED' "prod guard names REDIS_AUTH_REQUIRED"
need_grep "$GUARD" 'all-or-nothing' "prod AUTH is all-or-nothing"
need_grep "$PROPS" 'authRequired' "properties bind auth-required"

echo "== terraform shape =="
need_grep "$REDIS_TF" 'redis-auth ADR 0075: empty token' "empty token stays a cache cluster"
need_grep "$REDIS_TF" 'redis-auth ADR 0075: non-empty token' "token uses a replication group"
need_grep "$REDIS_TF" 'transit_encryption_enabled = true' "replication group enables transit TLS"
need_grep "$REDIS_TF" 'at_rest_encryption_enabled = true' "replication group enables at-rest encryption"
need_grep "$REDIS_TF" 'auth_token[[:space:]]*=[[:space:]]*var\.auth_token' "replication group sets auth_token"
need_grep "$REDIS_TF" 'local\.provision && !local\.auth_enabled' "cluster count excludes AUTH"
need_grep "$VARS" 'variable "redis_auth_token"' "root token variable"
need_grep "$VARS" 'sensitive[[:space:]]*=[[:space:]]*true' "token variable is sensitive"
need_grep "$OUTPUTS" 'output "redis_auth_enabled"' "boolean auth output"
need_not_grep "$OUTPUTS" 'output "redis_auth_token"' "token is not an output"
need_not_grep "$TFVARS" 'redis_auth_token[[:space:]]*=' "tfvars example does not assign a token"
need_not_grep "$K8S_REDIS" 'requirepass' "in-cluster Redis stays AUTH-less"
need_grep "$K8S_REDIS" 'ADR 0075' "in-cluster comment names ADR 0075"
need_grep "$COMPOSE" 'ADR 0075' "compose leaves AUTH unset"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
