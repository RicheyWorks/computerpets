#!/usr/bin/env bash
# Deny-safe + contract checks for deploy/terraform (no cloud account required).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TF="${ROOT}/deploy/terraform"
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

echo "== inventory / layout =="
for f in \
  "$TF/main.tf" \
  "$TF/variables.tf" \
  "$TF/outputs.tf" \
  "$TF/versions.tf" \
  "$TF/providers.tf" \
  "$TF/terraform.tfvars.example" \
  "$TF/configmap-managed.example.yaml" \
  "$TF/README.md" \
  "$TF/modules/postgres/main.tf" \
  "$TF/modules/redis/main.tf" \
  "$TF/modules/secrets/main.tf" \
  "$TF/modules/cdn/main.tf" \
  "$TF/modules/waf/main.tf"
do
  need_file "$f"
done

echo "== deny-safe defaults =="
need_grep "$TF/variables.tf" 'default\s*=\s*false' "postgres_publicly_accessible / write_house_secret_values default false present"
need_grep "$TF/variables.tf" 'postgres_publicly_accessible == false' "postgres publicly_accessible validation refuses true"
need_grep "$TF/variables.tf" 'write_house_secret_values == false' "write_house_secret_values validation refuses true"
need_grep "$TF/modules/postgres/main.tf" 'publicly_accessible\s*=\s*var.publicly_accessible' "postgres wires publicly_accessible"
need_grep "$TF/modules/postgres/main.tf" 'manage_master_user_password\s*=\s*true' "postgres master password is AWS-managed"
need_grep "$TF/modules/postgres/main.tf" 'storage_encrypted\s*=\s*true' "postgres storage encrypted"
need_grep "$TF/modules/cdn/main.tf" 'block_public_acls\s*=\s*true' "cdn bucket blocks public ACLs"
need_grep "$TF/modules/cdn/main.tf" 'restrict_public_buckets\s*=\s*true' "cdn bucket restricts public"
need_not_grep "$TF/terraform.tfvars.example" 'LICENSE_SECRET_KEY\s*=' "tfvars.example has no LICENSE_SECRET_KEY value"
need_not_grep "$TF/terraform.tfvars.example" 'JWT_SECRET_KEY\s*=' "tfvars.example has no JWT_SECRET_KEY value"
need_not_grep "$TF/terraform.tfvars.example" 'BUNDLE_SIGNING_KEY\s*=' "tfvars.example has no BUNDLE_SIGNING_KEY value"
need_not_grep "$TF/terraform.tfvars.example" 'ADMIN_API_KEY\s*=' "tfvars.example has no ADMIN_API_KEY value"

echo "== External Secrets contract =="
ESO="$ROOT/deploy/k8s/external-secret.example.yaml"
SECRETS_TF="$TF/modules/secrets/main.tf"
need_file "$ESO"
need_grep "$SECRETS_TF" 'name\s*=\s*"computerpets/\$\{each\.key\}"' "secrets module uses computerpets/\${each.key} names"
need_grep "$SECRETS_TF" 'house_secret_keys\s*=' "secrets module declares house_secret_keys"
for key in LICENSE_SECRET_KEY JWT_SECRET_KEY BUNDLE_SIGNING_KEY ADMIN_API_KEY \
  SPRING_DATASOURCE_USERNAME SPRING_DATASOURCE_PASSWORD POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB
do
  need_grep "$SECRETS_TF" "\"${key}\"" "secrets module lists ${key}"
  need_grep "$ESO" "key: computerpets/${key}" "ESO remoteRef computerpets/${key}"
done

echo "== ConfigMap wiring contract =="
need_grep "$TF/configmap-managed.example.yaml" 'SPRING_DATASOURCE_URL' "managed configmap has SPRING_DATASOURCE_URL"
need_grep "$TF/configmap-managed.example.yaml" 'REDIS_HOST' "managed configmap has REDIS_HOST"
need_grep "$TF/outputs.tf" 'spring_datasource_url' "root output spring_datasource_url"
need_grep "$TF/outputs.tf" 'redis_host' "root output redis_host"
need_grep "$TF/outputs.tf" 'bundle_base_url' "root output bundle_base_url"

echo "== terraform validate (optional binary) =="
if command -v terraform >/dev/null 2>&1; then
  (
    cd "$TF"
    terraform init -backend=false -input=false >/tmp/cp-tf-init.out 2>&1
    terraform validate >/tmp/cp-tf-validate.out 2>&1
  ) && ok "terraform init -backend=false && validate" \
    || { bad "terraform validate failed"; cat /tmp/cp-tf-init.out /tmp/cp-tf-validate.out || true; }
else
  ok "terraform binary absent — skipped validate (static checks still ran)"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
