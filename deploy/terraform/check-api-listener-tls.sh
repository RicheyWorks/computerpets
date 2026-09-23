#!/usr/bin/env bash
# ADR 0077 — public API listener TLS. Pod stays HTTP. Edge fails closed.
# No cloud account. Does not terraform apply. Does not call ACM.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TLS="${ROOT}/src/main/java/com/enterprisepet/config/ApiListenerTls.java"
GUARD="${ROOT}/src/main/java/com/enterprisepet/config/ProductionProfileGuard.java"
YAML="${ROOT}/src/main/resources/application.yml"
PROD_YAML="${ROOT}/src/main/resources/application-prod.yml"
INGRESS="${ROOT}/deploy/k8s/ingress.yaml"
INGRESS_TLS="${ROOT}/deploy/k8s/ingress-tls.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
K8S_CM="${ROOT}/deploy/k8s/configmap.yaml"
MODULE="${ROOT}/deploy/terraform/modules/api_listener/main.tf"
VARS="${ROOT}/deploy/terraform/variables.tf"
OUTPUTS="${ROOT}/deploy/terraform/outputs.tf"
ROOT_MAIN="${ROOT}/deploy/terraform/main.tf"
TFVARS="${ROOT}/deploy/terraform/terraform.tfvars.example"
MANAGED="${ROOT}/deploy/terraform/configmap-managed.example.yaml"
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

echo "== api listener tls files =="
need_file "$TLS"
need_file "$GUARD"
need_file "$YAML"
need_file "$INGRESS"
need_file "$INGRESS_TLS"
need_file "$MODULE"
need_file "$VARS"

echo "== app contract =="
need_grep "$TLS" 'ADR 0077' "helper names ADR 0077"
need_grep "$TLS" 'LISTEN_PORT = 8081' "pod port stays 8081"
need_grep "$TLS" 'without server.ssl' "helper refuses JVM TLS"
need_grep "$TLS" 'cleartext public listener' "blank URL is cleartext"
need_grep "$GUARD" 'API_LISTENER_TLS_REQUIRED' "prod guard names the flag"
need_grep "$GUARD" 'rejectUnsafeApiListenerTls' "prod guard calls the listener check"
need_grep "$YAML" 'server.ssl stays off \(ADR 0077\)' "app yaml keeps server.ssl off"
need_grep "$YAML" 'enabled: false' "server.ssl.enabled is false"
need_grep "$YAML" 'tls-required: \$\{API_LISTENER_TLS_REQUIRED:false\}' "flag defaults false"
need_grep "$YAML" 'public-base-url: \$\{API_PUBLIC_BASE_URL:\}' "public URL defaults empty"
need_not_grep "$YAML" 'key-store:' "app yaml has no keystore"
need_grep "$PROD_YAML" 'ADR 0077' "prod yaml names ADR 0077"
need_not_grep "$PROD_YAML" 'API_LISTENER_TLS_REQUIRED: "true"' "prod yaml does not force the flag on"

echo "== ingress =="
need_not_grep "$INGRESS" '^[[:space:]]*tls:' "local ingress has no tls block"
need_grep "$INGRESS" 'ADR 0077' "local ingress names ADR 0077"
need_grep "$INGRESS" 'ADR 0074' "local ingress still points at the WAF"
need_not_grep "$INGRESS" 'limit-rps|limit-rpm|limit-connections|limit_req' "local ingress has no third rate bucket"
need_grep "$INGRESS_TLS" '^[[:space:]]*tls:' "public ingress has a tls block"
need_grep "$INGRESS_TLS" 'secretName: computerpets-api-tls' "public ingress names the cert secret"
need_grep "$INGRESS_TLS" 'cert-manager.io/cluster-issuer:' "public ingress asks cert-manager"
need_grep "$INGRESS_TLS" 'ssl-redirect: "true"' "public ingress redirects to TLS"
need_grep "$INGRESS_TLS" 'force-ssl-redirect: "true"' "public ingress forces the redirect"
need_grep "$INGRESS_TLS" 'backend-protocol: "HTTP"' "public ingress talks HTTP to the pod"
need_grep "$INGRESS_TLS" 'ADR 0077' "public ingress names ADR 0077"
need_not_grep "$INGRESS_TLS" 'limit-rps|limit-rpm|limit-connections|limit_req' "public ingress has no third rate bucket"
need_not_grep "$INGRESS_TLS" 'kind:[[:space:]]*ClusterIssuer|acme:|letsencrypt|server.ssl' "public ingress does not create an issuer or JVM TLS"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*ingress' "neither ingress is in the kustomization"
need_grep "$K8S_CM" 'ADR 0077' "in-cluster ConfigMap names ADR 0077"
need_not_grep "$K8S_CM" 'API_LISTENER_TLS_REQUIRED' "in-cluster ConfigMap does not set the flag"
need_grep "$COMPOSE" 'ADR 0077' "compose leaves the API listener on HTTP"

echo "== terraform shape =="
need_grep "$MODULE" 'api-listener ADR 0077' "module names ADR 0077"
need_grep "$MODULE" 'cleartext-forward=false' "module marker refuses cleartext forward"
need_grep "$MODULE" 'http-status=HTTP_301' "module marker redirects"
need_grep "$MODULE" 'https-port=443' "module marker is port 443"
need_grep "$MODULE" 'ELBSecurityPolicy-TLS13-1-2-2021-06' "module uses the TLS 1.3 policy"
need_grep "$MODULE" 'aws_lb_listener" "https"' "HTTPS listener resource exists"
need_grep "$MODULE" 'aws_lb_listener" "http_redirect"' "HTTP redirect listener exists"
need_not_grep "$MODULE" 'aws_acm_certificate' "module does not create an ACM certificate"
need_not_grep "$ROOT_MAIN" 'aws_acm_certificate' "root does not create an ACM certificate"
need_grep "$ROOT_MAIN" 'terraform_data" "api_listener_tls_gate"' "root plan gate exists"
need_grep "$ROOT_MAIN" 'var.api_listener_alb_arn == var.waf_associate_alb_arn' "listener ALB must match the WAF ALB"
need_grep "$VARS" 'variable "enable_api_listener_tls"' "root flag exists"
need_grep "$VARS" 'variable "api_listener_certificate_arn"' "root certificate ARN variable"
need_grep "$OUTPUTS" 'output "api_listener_https_port"' "https port is an output"
need_grep "$OUTPUTS" 'output "api_listener_cleartext_forward"' "cleartext forward is an output"
need_grep "$MANAGED" 'API_LISTENER_TLS_REQUIRED: "true"' "managed configmap sets the flag"
need_grep "$MANAGED" 'https://replace-with-public-host.example' "managed configmap uses an https placeholder"
need_not_grep "$TFVARS" '^api_listener_certificate_arn[[:space:]]*=' "tfvars example does not assign a certificate ARN"
python3 - "$MODULE" <<'PY'
import pathlib, sys
text = pathlib.Path(sys.argv[1]).read_text()
start = text.find('resource "aws_lb_listener" "http_redirect"')
if start < 0:
    print("not ok - http_redirect resource missing")
    sys.exit(1)
rest = text[start + 1:]
candidates = [i for i in (rest.find('\nresource "'), rest.find('\noutput "')) if i >= 0]
nxt = min(candidates) if candidates else -1
block = text[start: start + 1 + nxt if nxt >= 0 else len(text)]
if "target_group_arn" in block or "forward" in block:
    print("not ok - http redirect listener forwards")
    sys.exit(1)
if 'status_code = "HTTP_301"' not in block:
    print("not ok - http redirect is not HTTP_301")
    sys.exit(1)
if 'protocol    = "HTTPS"' not in block and 'protocol          = "HTTPS"' not in block:
    # redirect protocol line is `protocol    = "HTTPS"` inside the redirect block
    if 'protocol' not in block or 'HTTPS' not in block:
        print("not ok - http redirect does not target HTTPS")
        sys.exit(1)
print("ok - port 80 redirects to HTTPS and does not forward")
https = text.find('resource "aws_lb_listener" "https"')
if https < 0 or "forward" not in text[https:start]:
    print("not ok - https listener does not forward to the target group")
    sys.exit(1)
print("ok - https listener forwards")
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
