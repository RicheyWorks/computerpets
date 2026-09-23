#!/usr/bin/env bash
# ADR 0097 — reassert kube-proxy API pool coverage, or fail closed.
# Coverage is a keyless operator Exists (effect empty or NoSchedule)
# or the exact Equal toleration. The managed addon schema still rejects
# tolerations. This script does not write an addon values document, does not
# fork an image, and does not taint. Kind and minikube contexts are refused.
# CI calls --self-test. It does not call kubectl.
set -euo pipefail

MODULE="$(cd "$(dirname "$0")" && pwd)"
PATCH="${MODULE}/kube-proxy-api-pool-toleration.yaml"

usage() {
  echo "usage: reassert-kube-proxy-toleration.sh --self-test|--check-file FILE|--probe|--live" >&2
  exit 2
}

kubectl_cmd() {
  if [ -n "${CP_KUBECTL_BIN:-}" ]; then
    "$CP_KUBECTL_BIN" "$@"
  else
    kubectl "$@"
  fi
}

drain_stdin() {
  if [ ! -t 0 ]; then
    cat >/dev/null || true
  fi
}

# Prints true, false, or error. Nothing else.
classify_file() {
  python3 - "$1" <<'PY'
import json, sys

BLANKET_EXISTS = "Exists"
EXACT = {
    "key": "computerpets/node-pool",
    "operator": "Equal",
    "value": "api",
    "effect": "NoSchedule",
}

def exact(item):
    if not isinstance(item, dict):
        return False
    if "tolerationSeconds" in item:
        return False
    op = item.get("operator", "Equal")
    return (
        item.get("key") == EXACT["key"]
        and op == EXACT["operator"]
        and item.get("value") == EXACT["value"]
        and item.get("effect") == EXACT["effect"]
        and set(item.keys()) <= {"key", "operator", "value", "effect"}
    )

def blanket(item):
    if not isinstance(item, dict):
        return False
    if item.get("operator") != BLANKET_EXISTS:
        return False
    if item.get("key"):
        return False
    if item.get("value"):
        return False
    if "tolerationSeconds" in item:
        return False
    effect = item.get("effect", "")
    if effect not in ("", "NoSchedule"):
        return False
    allowed = {"operator"}
    if "effect" in item:
        allowed.add("effect")
    return set(item.keys()) <= allowed

def classify(doc):
    if not isinstance(doc, dict):
        return "error"
    if doc.get("kind") != "DaemonSet":
        return "error"
    meta = doc.get("metadata") if isinstance(doc.get("metadata"), dict) else {}
    if meta.get("name") != "kube-proxy" or meta.get("namespace") != "kube-system":
        return "error"
    template = (doc.get("spec") or {}).get("template") or {}
    spec = template.get("spec") if isinstance(template, dict) else None
    if not isinstance(spec, dict):
        return "error"
    tols = spec.get("tolerations", [])
    if tols is None:
        tols = []
    if not isinstance(tols, list):
        return "error"
    for item in tols:
        if exact(item) or blanket(item):
            return "true"
    return "false"

try:
    doc = json.loads(open(sys.argv[1], encoding="utf-8").read())
except (OSError, json.JSONDecodeError):
    print("error")
    sys.exit(0)
print(classify(doc))
PY
}

local_context() {
  local ctx lower
  ctx="$1"
  lower=$(printf '%s' "$ctx" | tr '[:upper:]' '[:lower:]')
  case "$lower" in
    kind|kind-*|minikube|minikube-*)
      return 0
      ;;
  esac
  return 1
}

refuse_local() {
  echo "fail closed: refusing kind or minikube context '${1}'. Do not patch kube-proxy there. Do not taint a kind or minikube node." >&2
}

read_context() {
  local ctx
  if ! ctx="$(kubectl_cmd config current-context 2>/dev/null)"; then
    echo "fail closed: kubectl config current-context failed" >&2
    return 1
  fi
  ctx="${ctx//$'\r'/}"
  ctx="${ctx//$'\n'/}"
  if [ -z "$ctx" ]; then
    echo "fail closed: empty kubectl context" >&2
    return 1
  fi
  if local_context "$ctx"; then
    refuse_local "$ctx"
    return 1
  fi
  printf '%s' "$ctx"
}

fetch_ds() {
  local dest="$1"
  if ! kubectl_cmd get daemonset kube-proxy -n kube-system -o json >"$dest"; then
    echo "fail closed: cannot read daemonset kube-proxy in kube-system" >&2
    return 1
  fi
}

apply_patch() {
  kubectl_cmd patch daemonset kube-proxy -n kube-system --type strategic --patch-file "$PATCH"
}

cmd_check_file() {
  local result
  result="$(classify_file "$1")"
  case "$result" in
    true) exit 0 ;;
    false|error) exit 1 ;;
    *) exit 1 ;;
  esac
}

cmd_probe() {
  drain_stdin
  local work result
  read_context >/dev/null
  work="$(mktemp)"
  trap 'rm -f "$work"' RETURN
  fetch_ds "$work"
  result="$(classify_file "$work")"
  case "$result" in
    true|false)
      python3 -c 'import json,sys; print(json.dumps({"covered": sys.argv[1]}, separators=(",", ":")))' "$result"
      ;;
    *)
      echo "fail closed: kube-proxy document is not classifiable" >&2
      exit 1
      ;;
  esac
}

cmd_live() {
  drain_stdin
  local work result
  read_context >/dev/null
  work="$(mktemp)"
  trap 'rm -f "$work"' RETURN
  fetch_ds "$work"
  result="$(classify_file "$work")"
  case "$result" in
    true)
      exit 0
      ;;
    false)
      ;;
    *)
      echo "fail closed: kube-proxy document is not classifiable; not patching" >&2
      exit 1
      ;;
  esac
  if ! apply_patch; then
    echo "fail closed: strategic-merge patch failed" >&2
    exit 1
  fi
  fetch_ds "$work"
  result="$(classify_file "$work")"
  if [ "$result" != "true" ]; then
    echo "fail closed: kube-proxy still lacks Exists and the exact Equal toleration after the patch" >&2
    exit 1
  fi
}

write_ds() {
  local dest="$1" tols="$2"
  python3 -c 'import json,sys; print(json.dumps({"apiVersion":"apps/v1","kind":"DaemonSet","metadata":{"name":"kube-proxy","namespace":"kube-system"},"spec":{"template":{"spec":{"tolerations":json.loads(sys.argv[1])}}}}))' "$tols" >"$dest"
}

cmd_self_test() {
  local root stub fail=0
  root="$(mktemp -d)"
  trap 'rm -rf "$root"' RETURN
  stub="${root}/bin"
  mkdir -p "$stub"
  cat >"${stub}/kubectl" <<'EOF'
#!/bin/bash
set -euo pipefail
dir="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "$*" >>"${dir}/log"
joined=" $* "
case "$joined" in
  *" taint "*) echo "refusing taint" >&2; exit 99 ;;
esac
if [ "$1" = "config" ] && [ "$2" = "current-context" ]; then
  cat "${dir}/context"
  exit 0
fi
if [ "$1" = "get" ]; then
  n=0
  if [ -f "${dir}/gets" ]; then n="$(cat "${dir}/gets")"; fi
  echo $((n + 1)) >"${dir}/gets"
  if [ "$n" = "0" ]; then
    cat "${dir}/before.json"
  else
    cat "${dir}/after.json"
  fi
  exit 0
fi
if [ "$1" = "patch" ]; then
  echo "$joined" | grep -q " daemonset kube-proxy " || exit 2
  echo "$joined" | grep -q " -n kube-system " || exit 2
  echo "$joined" | grep -q " --type strategic " || exit 2
  echo "$joined" | grep -q " --patch-file " || exit 2
  echo "$joined" | grep -q "kube-proxy-api-pool-toleration.yaml" || exit 2
  echo 1 >>"${dir}/patched"
  exit 0
fi
echo "unexpected: $*" >&2
exit 97
EOF
  chmod +x "${stub}/kubectl"

  reset_stub() {
    printf '%s' "$1" >"${stub}/context"
    rm -f "${stub}/gets" "${stub}/log" "${stub}/patched" "${stub}/before.json" "${stub}/after.json"
    write_ds "${stub}/before.json" "$2"
    write_ds "${stub}/after.json" "$3"
  }

  assert_exit() {
    local want="$1" name="$2"
    shift 2
    local got=0
    CP_KUBECTL_BIN="${stub}/kubectl" "$@" >"${root}/out" 2>"${root}/err" || got=$?
    if [ "$got" -eq "$want" ]; then
      echo "ok - ${name}"
    else
      echo "not ok - ${name} (want exit ${want}, got ${got})"
      cat "${root}/err" >&2 || true
      fail=1
    fi
  }

  assert_stdout() {
    local want="$1" name="$2"
    shift 2
    local got=0
    CP_KUBECTL_BIN="${stub}/kubectl" "$@" >"${root}/out" 2>"${root}/err" || got=$?
    local body
    body="$(cat "${root}/out")"
    if [ "$got" -eq 0 ] && [ "$body" = "$want" ]; then
      echo "ok - ${name}"
    else
      echo "not ok - ${name} (exit ${got}, stdout ${body})"
      fail=1
    fi
  }

  file_case() {
    local want="$1" name="$2" tols="$3" path="${root}/doc.json"
    write_ds "$path" "$tols"
    assert_exit "$want" "$name" "$0" --check-file "$path"
  }

  exists='[{"operator":"Exists"}]'
  exists_ns='[{"operator":"Exists","effect":"NoSchedule"}]'
  exists_ne='[{"operator":"Exists","effect":"NoExecute"}]'
  exact='[{"key":"computerpets/node-pool","operator":"Equal","value":"api","effect":"NoSchedule"}]'
  both='[{"operator":"Exists"},{"key":"computerpets/node-pool","operator":"Equal","value":"api","effect":"NoSchedule"}]'
  keyed='[{"key":"computerpets/node-pool","operator":"Exists","effect":"NoSchedule"}]'
  wrong='[{"key":"computerpets/node-pool","operator":"Equal","value":"other","effect":"NoSchedule"}]'
  empty='[]'

  file_case 0 "check-file keyless Exists is covered" "$exists"
  file_case 0 "check-file Exists effect NoSchedule is covered" "$exists_ns"
  file_case 0 "check-file exact Equal is covered" "$exact"
  file_case 0 "check-file Exists plus Equal is covered" "$both"
  file_case 1 "check-file Exists effect NoExecute is not covered" "$exists_ne"
  file_case 1 "check-file keyed Exists is not the blanket" "$keyed"
  file_case 1 "check-file empty tolerations are not covered" "$empty"
  file_case 1 "check-file wrong Equal value is not covered" "$wrong"

  reset_stub "arn:aws:eks:us-east-1:000000000000:cluster/computerpets" "$exists" "$exists"
  assert_exit 0 "live Exists does not patch" "$0" --live
  if [ -f "${stub}/patched" ]; then
    echo "not ok - live Exists must not patch"
    fail=1
  else
    echo "ok - live Exists must not patch"
  fi

  reset_stub "arn:aws:eks:us-east-1:000000000000:cluster/computerpets" "$exact" "$exact"
  assert_exit 0 "live exact Equal does not patch" "$0" --live
  if [ -f "${stub}/patched" ]; then
    echo "not ok - live exact Equal must not patch"
    fail=1
  else
    echo "ok - live exact Equal must not patch"
  fi

  reset_stub "arn:aws:eks:us-east-1:000000000000:cluster/computerpets" "$empty" "$exact"
  assert_exit 0 "live patches when uncovered and the second read is covered" "$0" --live
  if [ -f "${stub}/patched" ] && grep -q "kube-proxy-api-pool-toleration.yaml" "${stub}/log"; then
    echo "ok - live patch uses the strategic-merge file"
  else
    echo "not ok - live patch uses the strategic-merge file"
    fail=1
  fi

  reset_stub "arn:aws:eks:us-east-1:000000000000:cluster/computerpets" "$empty" "$empty"
  assert_exit 1 "live fails closed when the patch does not stick" "$0" --live
  if [ -f "${stub}/patched" ]; then
    echo "ok - live tried the patch before failing closed"
  else
    echo "not ok - live tried the patch before failing closed"
    fail=1
  fi

  reset_stub "kind-computerpets" "$empty" "$exact"
  assert_exit 1 "live refuses a kind context" "$0" --live
  if [ -f "${stub}/patched" ]; then
    echo "not ok - kind context was patched"
    fail=1
  else
    echo "ok - kind context was not patched"
  fi

  reset_stub "minikube" "$empty" "$exact"
  assert_exit 1 "live refuses a minikube context" "$0" --live
  if [ -f "${stub}/patched" ]; then
    echo "not ok - minikube context was patched"
    fail=1
  else
    echo "ok - minikube context was not patched"
  fi

  reset_stub "arn:aws:eks:us-east-1:000000000000:cluster/computerpets" "$exists" "$exists"
  assert_stdout '{"covered":"true"}' "probe reports covered Exists" "$0" --probe
  if [ -f "${stub}/patched" ]; then
    echo "not ok - probe must not patch"
    fail=1
  else
    echo "ok - probe must not patch"
  fi

  reset_stub "arn:aws:eks:us-east-1:000000000000:cluster/computerpets" "$empty" "$empty"
  assert_stdout '{"covered":"false"}' "probe reports uncovered" "$0" --probe

  reset_stub "kind-kind" "$empty" "$exact"
  assert_exit 1 "probe refuses a kind context" "$0" --probe
  if [ -f "${stub}/patched" ]; then
    echo "not ok - kind probe patched"
    fail=1
  else
    echo "ok - kind probe did not patch"
  fi

  reset_stub "minikube" "$exists" "$exists"
  assert_exit 1 "probe refuses minikube" "$0" --probe

  if [ "$fail" -ne 0 ]; then
    exit 1
  fi
}

if [ "$#" -lt 1 ]; then
  usage
fi

case "$1" in
  --self-test)
    cmd_self_test
    ;;
  --check-file)
    [ "$#" -eq 2 ] || usage
    cmd_check_file "$2"
    ;;
  --probe)
    cmd_probe
    ;;
  --live)
    cmd_live
    ;;
  *)
    usage
    ;;
esac
