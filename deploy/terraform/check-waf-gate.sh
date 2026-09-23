#!/usr/bin/env bash
# ADR 0074 — regional WAF rules match RateLimitingFilter buckets.
# No cloud account. Does not terraform apply.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FILTER="${ROOT}/src/main/java/com/enterprisepet/config/RateLimitingFilter.java"
WAF="${ROOT}/deploy/terraform/modules/waf/main.tf"
CDN="${ROOT}/deploy/terraform/modules/cdn/main.tf"
INGRESS="${ROOT}/deploy/k8s/ingress.yaml"
VARS="${ROOT}/deploy/terraform/variables.tf"
ROOT_MAIN="${ROOT}/deploy/terraform/main.tf"
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

echo "== waf gate files =="
need_file "$FILTER"
need_file "$WAF"
need_file "$CDN"
need_file "$INGRESS"
need_file "$VARS"

echo "== buckets match the JVM filter =="
python3 - "$FILTER" "$WAF" <<'PY'
import re, sys, pathlib
filter_text = pathlib.Path(sys.argv[1]).read_text()
waf_text = pathlib.Path(sys.argv[2]).read_text()
rules = re.findall(
    r'new Rule\("([^"]+)",\s+"([^"]+)",\s+(\d+),\s+Duration\.ofMinutes\((\d+)\)\)',
    filter_text,
)
if len(rules) != 4:
    print(f"not ok - expected 4 RateLimitingFilter rules, found {len(rules)}")
    sys.exit(1)
print(f"ok - four JVM rules")
for prefix, key, limit, minutes in rules:
    if minutes != "1":
        print(f"not ok - {key} period is {minutes} minutes, want 1")
        sys.exit(1)
    marker = f"waf-bucket {key} prefix={prefix} limit={limit} window_sec=60"
    if marker not in waf_text:
        print(f"not ok - missing marker: {marker}")
        sys.exit(1)
    if not re.search(rf'{re.escape(key)}_limit\s*=\s*{limit}\b', waf_text):
        print(f"not ok - {key}_limit is not {limit}")
        sys.exit(1)
    if not re.search(rf'{re.escape(key)}_prefix\s*=\s*"{re.escape(prefix)}"', waf_text):
        print(f"not ok - {key}_prefix is not {prefix}")
        sys.exit(1)
    if f"limit                 = local.{key}_limit" not in waf_text:
        print(f"not ok - rate rule does not use local.{key}_limit")
        sys.exit(1)
    if f"search_string         = local.{key}_prefix" not in waf_text:
        print(f"not ok - scope-down does not use local.{key}_prefix")
        sys.exit(1)
    print(f"ok - {key} {prefix} {limit}/60s")
if "waf_rate_limit" in waf_text:
    print("not ok - waf module still has a separate waf_rate_limit knob")
    sys.exit(1)
print("ok - no separate waf_rate_limit knob")
PY

echo "== deny-safe association =="
need_grep "$WAF" 'default_action \{' "default_action block is present"
need_not_grep "$WAF" 'default_action \{[[:space:]]*allow' "default action is not allow"
need_grep "$WAF" 'block \{\}' "default action blocks"
need_grep "$WAF" 'response_code[[:space:]]*=[[:space:]]*429' "rate rules answer 429"
need_grep "$WAF" 'aggregate_key_type[[:space:]]*=[[:space:]]*"IP"' "rate key is IP"
need_grep "$WAF" 'evaluation_window_sec[[:space:]]*=[[:space:]]*local\.window_sec' "window is the one-minute local"
need_grep "$WAF" 'window_sec[[:space:]]*=[[:space:]]*60' "window_sec is 60"
need_grep "$WAF" 'override_action \{' "managed common rules stay in the ACL"
need_not_grep "$WAF" 'count \{\}' "no count-mode actions"
need_not_grep "$WAF" '^[[:space:]]*count[[:space:]]*=' "association is not conditional"
need_grep "$WAF" 'aws_wafv2_web_acl_association" "alb"' "ALB association resource exists"
need_grep "$ROOT_MAIN" 'terraform_data" "waf_association_gate"' "root plan gate exists"
need_grep "$ROOT_MAIN" 'loadbalancer/app/' "root plan gate requires an ALB ARN"
need_grep "$WAF" 'sampled_requests_enabled[[:space:]]*=[[:space:]]*false' "sampled requests stay off"
need_not_grep "$WAF" 'sampled_requests_enabled[[:space:]]*=[[:space:]]*true' "sampled requests are not enabled"
need_grep "$WAF" '\^/api/bundles/\[\^/\]\+/redeem/\?\$' "bundles rule excludes signed redeem"
need_grep "$WAF" 'scope[[:space:]]*=[[:space:]]*"REGIONAL"' "ACL is regional (API ALB, not the bundle CDN)"
need_not_grep "$CDN" 'web_acl_id' "bundle CloudFront distribution has no API web ACL"
need_not_grep "$VARS" 'variable "waf_rate_limit"' "root has no waf_rate_limit variable"
need_grep "$VARS" 'loadbalancer/app/' "root ARN validation requires an ALB"
need_not_grep "$ROOT_MAIN" 'waf_rate_limit' "root module does not pass waf_rate_limit"
need_not_grep "$INGRESS" 'limit-rps|limit-rpm|limit-connections|limit_req' "nginx ingress does not add a third bucket"
need_grep "$INGRESS" 'ADR 0074' "ingress points at the WAF gate"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
