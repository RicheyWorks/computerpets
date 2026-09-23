#!/usr/bin/env bash
# ADR 0083 / 0090 / 0091 / 0092 / 0099 — Cluster Autoscaler for the
# multi-AZ API node groups, two replicas, required hostname anti-affinity,
# hard zone spread (DoNotSchedule, maxSkew 1, Honor policies, no
# minDomains), leader election on the leases lock, a required nodeSelector
# on computerpets/node-pool=api plus linux, and a PodDisruptionBudget with
# minAvailable 1 whose selector matches the Deployment. Zone anti-affinity
# is not required and is not preferred. No cloud account. Does not
# terraform apply. Does not kubectl apply. Kind/minikube stay off.
# Terraform must not reset desired_size.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CA="${ROOT}/deploy/terraform/modules/cluster_autoscaler/main.tf"
POOL="${ROOT}/deploy/terraform/modules/node_pool/main.tf"
VARS="${ROOT}/deploy/terraform/variables.tf"
ROOT_MAIN="${ROOT}/deploy/terraform/main.tf"
OUTPUTS="${ROOT}/deploy/terraform/outputs.tf"
TFVARS="${ROOT}/deploy/terraform/terraform.tfvars.example"
TFREADME="${ROOT}/deploy/terraform/README.md"
MANIFEST="${ROOT}/deploy/k8s/cluster-autoscaler.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
HPA="${ROOT}/deploy/k8s/hpa.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
K8README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0083-cluster-autoscaler.md"
ADR90="${ROOT}/docs/adr/0090-cluster-autoscaler-ha.md"
ADR91="${ROOT}/docs/adr/0091-cluster-autoscaler-node-pool.md"
ADR92="${ROOT}/docs/adr/0092-cluster-autoscaler-pdb.md"
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
  if grep -qE -- "$pattern" "$file"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file"))"; fi
}

need_not_grep() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if grep -qE -- "$pattern" "$file"; then bad "$name"
  else ok "$name"; fi
}

# House comments may name a forbidden shape. The gate reads the YAML body.
yaml_body() {
  grep -vE '^[[:space:]]*#' "$1" || true
}

need_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE -- "$pattern"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file") body)"; fi
}

need_not_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE -- "$pattern"; then bad "$name"
  else ok "$name"; fi
}

echo "== cluster autoscaler files =="
need_file "$CA"
need_file "$POOL"
need_file "$MANIFEST"
need_file "$ADR"
need_file "$ADR90"
need_file "$ADR91"
need_file "$ADR92"
need_file "$HPA"
need_file "$KUSTOM"

echo "== node group ceiling and desired size =="
need_grep "$POOL" 'desired-size-owner=cluster-autoscaler' "node pool names the desired-size owner"
need_grep "$POOL" 'hpa-max-replicas=3' "node pool names the HPA ceiling"
need_grep "$POOL" 'max_size_per_zone[[:space:]]*=[[:space:]]*20' "max size per zone is 20"
need_grep "$POOL" 'desired_size_per_zone[[:space:]]*=[[:space:]]*3' "create-time desired size is 3 (ADR 0106)"
need_grep "$POOL" 'min_size_per_zone[[:space:]]*=[[:space:]]*3' "min size per zone is 3 (ADR 0106)"
need_grep "$POOL" 'ignore_changes = \[scaling_config\[0\]\.desired_size\]' "terraform ignores desired_size after create"
need_grep "$POOL" 'aws_autoscaling_group_tag" "cluster_autoscaler"' "discovery tags target the managed ASG"
need_grep "$POOL" 'k8s.io/cluster-autoscaler/enabled' "enabled discovery tag is present"
need_grep "$POOL" '"owned"' "cluster discovery tag value is owned"
need_grep "$POOL" 'propagate_at_launch[[:space:]]*=[[:space:]]*false' "discovery tags are not instance tags"
need_grep "$HPA" 'maxReplicas: 3' "HPA ceiling is 3 (ADR 0108)"
need_not_grep "$POOL" 'SetDesiredCapacity' "node role is not granted desired-capacity writes"
need_not_grep "$POOL" 'AssumeRoleWithWebIdentity' "node role is not the autoscaler role"
need_not_grep "$POOL" 'resource "aws_autoscaling_group"' "node pool does not declare a raw ASG"
need_grep "$POOL" 'associate_public_ip_address[[:space:]]*=[[:space:]]*false' "workers stay private"
need_grep "$POOL" '"computerpets/node-pool"[[:space:]]*=[[:space:]]*"api"' "node pool label is computerpets/node-pool=api"

echo "== IRSA least privilege =="
need_grep "$CA" 'cluster-autoscaler ADR 0083' "module names ADR 0083"
need_grep "$CA" 'scaler=cluster-autoscaler' "scaler is Cluster Autoscaler"
need_grep "$CA" 'not-karpenter=true' "Karpenter is not the scaler"
need_grep "$CA" 'irsa-only=true' "auth is IRSA only"
need_grep "$CA" 'local-kind=off' "local kind path is off"
need_grep "$CA" 'system:serviceaccount:kube-system:cluster-autoscaler' "trust is the kube-system service account"
need_grep "$CA" 'sts:AssumeRoleWithWebIdentity' "trust is web identity"
need_grep "$CA" 'Sid[[:space:]]*=[[:space:]]*"ScaleTaggedGroups"' "scale allow is tag-scoped"
need_grep "$CA" 'Sid[[:space:]]*=[[:space:]]*"DenyUntaggedPower"' "dangerous actions are denied"
need_grep "$CA" 'Sid[[:space:]]*=[[:space:]]*"DenyScaleWhenEnabledTagMissing"' "missing discovery tag denies scale"
need_grep "$CA" 'autoscaling:SetDesiredCapacity' "desired capacity is the scale action"
need_grep "$CA" 'ec2:AssociateAddress' "public address action is named so it can be denied"
need_grep "$CA" 'ec2:RunInstances' "run-instances is named so it can be denied"
need_grep "$CA" 'ec2:CreateKeyPair' "SSH key creation is named so it can be denied"
need_grep "$CA" 'autoscaling:UpdateAutoScalingGroup' "ASG mutation is named so it can be denied"
need_grep "$CA" 'iam:PassRole' "pass-role is named so it can be denied"
need_not_grep "$CA" 'ec2.amazonaws.com' "worker instance role cannot assume the autoscaler"
need_not_grep "$CA" 'karpenter\.sh|aws_ec2_fleet|kind = "NodePool"' "module does not install Karpenter"
need_grep "$VARS" 'variable "enable_cluster_autoscaler"' "root flag exists"
need_grep "$VARS" 'variable "eks_oidc_provider_arn"' "OIDC provider ARN is a variable"
need_grep "$ROOT_MAIN" 'terraform_data" "cluster_autoscaler_gate"' "plan gate exists"
need_grep "$ROOT_MAIN" 'enable_node_pool && var.enable_cluster_autoscaler' "kind path skips the role"
need_grep "$OUTPUTS" 'output "cluster_autoscaler_role_arn"' "role ARN is an output"
need_grep "$TFVARS" 'eks_oidc_provider_arn' "tfvars example documents the OIDC ARN"
need_not_grep "$TFVARS" '^eks_oidc_provider_arn[[:space:]]*=' "tfvars example does not assign an OIDC ARN"
need_grep "$TFREADME" 'ADR 0083' "terraform README names ADR 0083"

echo "== manifest stays off the local apply =="
need_grep "$MANIFEST" 'Not in kustomization.yaml' "manifest says it stays out of kustomize"
need_grep "$MANIFEST" 'registry.k8s.io/autoscaling/cluster-autoscaler:v1.36.1' "image is the pinned 1.36.1 tag"
need_grep "$MANIFEST" 'k8s.io/cluster-autoscaler/CLUSTER_NAME=owned' "discovery flag uses the cluster-name token"
need_grep "$MANIFEST" 'value: AWS_REGION' "region is a substitute token"
need_grep "$MANIFEST" 'arn:aws:iam::000000000000:role/computerpets-prod-cluster-autoscaler' "role ARN placeholder is the documented account"
need_grep "$MANIFEST" '--balance-similar-node-groups=true' "similar node groups stay balanced across zones"
need_grep "$MANIFEST" '--skip-nodes-with-system-pods=false' "EKS DaemonSets do not block scale-down"
need_grep "$MANIFEST" 'poddisruptionbudgets' "scale-down can read disruption budgets"
need_grep "$MANIFEST" 'namespace: kube-system' "autoscaler runs in kube-system"
need_grep_body "$MANIFEST" '^  replicas: 2$' "Deployment replicas is 2"
need_not_grep_body "$MANIFEST" '^  replicas: 1$' "Deployment is not a single replica"
need_grep_body "$MANIFEST" 'maxUnavailable: 1' "rolling update can drop one pod"
need_grep_body "$MANIFEST" 'maxSurge: 0' "rolling update does not ask for a third hostname"
need_grep_body "$MANIFEST" 'requiredDuringSchedulingIgnoredDuringExecution:' "hostname anti-affinity is required"
need_grep_body "$MANIFEST" 'topologySpreadConstraints:' "zone spread is set"
need_grep_body "$MANIFEST" 'whenUnsatisfiable: DoNotSchedule$' "zone spread is DoNotSchedule"
need_grep_body "$MANIFEST" 'maxSkew: 1$' "zone spread maxSkew is 1"
need_grep_body "$MANIFEST" 'nodeAffinityPolicy: Honor$' "zone spread honors node affinity"
need_grep_body "$MANIFEST" 'nodeTaintsPolicy: Honor$' "zone spread honors taints"
need_grep_body "$MANIFEST" 'topologyKey: kubernetes.io/hostname$' "required topology is hostname"
need_grep_body "$MANIFEST" 'topologyKey: topology.kubernetes.io/zone$' "spread topology is zone"
need_grep_body "$MANIFEST" '--leader-elect=true' "leader election is explicitly on"
need_grep_body "$MANIFEST" '--leader-elect-resource-lock=leases' "leader lock is leases"
need_grep_body "$MANIFEST" '--leader-elect-resource-name=cluster-autoscaler' "leader lock name matches the lease RBAC"
need_not_grep_body "$MANIFEST" '--leader-elect=false' "leader election is not turned off"
need_not_grep_body "$MANIFEST" 'preferredDuringSchedulingIgnoredDuringExecution:' "zone rule is spread, not a preference"
need_not_grep_body "$MANIFEST" 'minDomains:' "zone spread does not set minDomains"
need_not_grep_body "$MANIFEST" 'whenUnsatisfiable: ScheduleAnyway$' "zone spread is not ScheduleAnyway"
need_grep "$MANIFEST" 'enable_node_pool=false' "manifest names the kind switch"
need_grep "$MANIFEST" 'feature-off path' "manifest names the kind leave-off"
need_grep "$MANIFEST" 'Do not delete the pool key' "manifest refuses dropping the pool key for laptops"
need_grep "$MANIFEST" 'ADR 0099' "manifest names the hard zone spread"
need_grep "$MANIFEST" 'One labeled zone still schedules' "manifest is honest about one zone"
need_grep "$MANIFEST" 'Do not set minDomains' "manifest refuses minDomains"
need_grep "$MANIFEST" 'Kind and minikube' "manifest names kind and minikube"
need_grep "$MANIFEST" 'Required zone anti-affinity is not set' "manifest does not require zone anti-affinity"
need_grep_body "$MANIFEST" 'nodeSelector:' "pod template has a nodeSelector"
need_grep_body "$MANIFEST" 'kubernetes.io/os: linux$' "nodeSelector requires linux"
need_grep_body "$MANIFEST" 'computerpets/node-pool: api$' "nodeSelector requires the api pool label"
need_not_grep_body "$MANIFEST" 'nodeAffinity:' "pool pin is nodeSelector, not node affinity"
need_not_grep "$MANIFEST" ':latest' "image is not floating latest"
need_not_grep "$MANIFEST" 'karpenter' "manifest does not install Karpenter"
need_not_grep "$MANIFEST" 'arn:aws:iam::[1-9][0-9]{11}:' "manifest has no real account id"
need_not_grep "$MANIFEST" 'hostNetwork: true' "autoscaler does not use the host network"
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*cluster-autoscaler\.yaml[[:space:]]*$' "kustomization does not list the manifest"
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
# API pool pin is ADR 0093. This check only requires the same label.
need_grep "$BLUE" 'nodeSelector:' "blue is pinned to the pool (ADR 0093)"
need_grep "$GREEN" 'nodeSelector:' "green is pinned to the pool (ADR 0093)"
need_grep "$BLUE" 'computerpets/node-pool: api$' "blue selects the api pool label"
need_grep "$GREEN" 'computerpets/node-pool: api$' "green selects the api pool label"
need_grep "$K8README" 'ADR 0083' "k8s README names ADR 0083"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$ADR" 'Karpenter' "ADR says why Karpenter is not the scaler"
need_grep "$ADR90" 'Catalog stays 221' "HA ADR keeps catalog 221"
need_grep "$ADR90" 'No Rui sprites' "HA ADR has no Rui sprites"
need_grep "$ADR90" 'replicas: 2' "HA ADR names two replicas"
need_grep "$ADR90" 'leader election' "HA ADR names leader election"
need_grep "$K8README" 'ADR 0090' "k8s README names ADR 0090"
need_grep "$K8README" 'ADR 0091' "k8s README names ADR 0091"
need_grep "$ADR91" 'Catalog stays 221' "pool ADR keeps catalog 221"
need_grep "$ADR91" 'No Rui sprites' "pool ADR has no Rui sprites"
need_grep "$ADR91" 'computerpets/node-pool' "pool ADR names the pool label"
need_grep "$ADR91" 'Kind and minikube' "pool ADR names the kind leave-off"
need_grep "$K8README" 'ADR 0092' "k8s README names ADR 0092"
need_grep "$ADR92" 'Catalog stays 221' "budget ADR keeps catalog 221"
need_grep "$ADR92" 'No Rui sprites' "budget ADR has no Rui sprites"
need_grep "$ADR92" 'minAvailable: 1' "budget ADR names minAvailable 1"
need_grep "$ADR92" 'voluntary' "budget ADR limits the budget to voluntary disruption"
need_grep "$ADR92" 'Kind and minikube' "budget ADR names the kind leave-off"
need_grep "$MANIFEST" 'do not install this budget' "manifest names the kind leave-off for the budget"
need_grep_body "$MANIFEST" '^kind: PodDisruptionBudget$' "autoscaler disruption budget is present"
need_grep_body "$MANIFEST" '^apiVersion: policy/v1$' "autoscaler budget is policy/v1"
need_grep_body "$MANIFEST" '^  minAvailable: 1$' "autoscaler budget keeps one pod"
need_not_grep_body "$MANIFEST" 'apiVersion: policy/v1beta1' "beta PDB API is not used"
need_not_grep_body "$MANIFEST" 'minAvailable: 2' "minAvailable 2 would block every voluntary eviction"
need_not_grep_body "$MANIFEST" 'minAvailable: 0' "budget is not zero"
need_not_grep_body "$MANIFEST" 'minAvailable:.*%' "minAvailable is a count, not a percent"

selector_count="$(yaml_body "$MANIFEST" | grep -c 'nodeSelector:' || true)"
if [ "${selector_count}" = "1" ]; then ok "one nodeSelector"
else bad "expected one nodeSelector (found ${selector_count})"; fi
pool_sel="$(yaml_body "$MANIFEST" | grep -c 'computerpets/node-pool: api' || true)"
if [ "${pool_sel}" = "1" ]; then ok "api pool label appears once"
else bad "expected one computerpets/node-pool: api (found ${pool_sel})"; fi
os_sel="$(yaml_body "$MANIFEST" | grep -c 'kubernetes.io/os: linux' || true)"
if [ "${os_sel}" = "1" ]; then ok "linux nodeSelector appears once"
else bad "expected one kubernetes.io/os: linux (found ${os_sel})"; fi
pdb_count="$(yaml_body "$MANIFEST" | grep -c '^kind: PodDisruptionBudget$' || true)"
if [ "${pdb_count}" = "1" ]; then ok "one autoscaler PodDisruptionBudget"
else bad "expected one autoscaler PodDisruptionBudget (found ${pdb_count})"; fi
min_av="$(yaml_body "$MANIFEST" | grep -c '^  minAvailable: 1$' || true)"
if [ "${min_av}" = "1" ]; then ok "minAvailable 1 appears once"
else bad "expected one minAvailable: 1 (found ${min_av})"; fi

python3 - "$POOL" "$HPA" "$CA" "$MANIFEST" <<'PY'
import pathlib, re, sys
pool = pathlib.Path(sys.argv[1]).read_text()
hpa = pathlib.Path(sys.argv[2]).read_text()
ca = pathlib.Path(sys.argv[3]).read_text()
manifest = pathlib.Path(sys.argv[4]).read_text()

def code_only(text):
    return "\n".join(line.split("#", 1)[0] for line in text.splitlines())

pool_code = code_only(pool)
ca_code = code_only(ca)
failed = False

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

hpa_max = re.findall(r"(?m)^[ \t]*maxReplicas:[ \t]*(\d+)[ \t]*$", hpa)
sizes = re.findall(r"(?m)^[ \t]*max_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
desired = re.findall(r"(?m)^[ \t]*desired_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
mins = re.findall(r"(?m)^[ \t]*min_size_per_zone[ \t]*=[ \t]*(\d+)[ \t]*$", pool_code)
check(hpa_max == ["3"], "HPA file has one ceiling and it is 3 (ADR 0108)")
check(len(sizes) == 1 and int(sizes[0]) >= int(hpa_max[0] if hpa_max else "999"),
      "node-group max is at least the HPA ceiling")
check(desired == ["3"], "create-time desired size is 3 (ADR 0106)")
check(mins == ["3"], "min size per zone is 3 (ADR 0106)")
check("ignore_changes = [scaling_config[0].desired_size]" in pool_code,
      "ignore_changes is in code, not only a comment")
check('resource "aws_autoscaling_group"' not in pool_code, "no raw ASG resource in the node pool")
check("ec2.amazonaws.com" not in ca_code, "CA trust code has no EC2 service principal")

def list_body(name, text):
    match = re.search(rf"{name}\s*=\s*\[(.*?)\]", text, re.S)
    return match.group(1) if match else ""

scale = list_body("scale_actions", ca_code)
describe = list_body("describe_actions", ca_code)
denied = list_body("denied_actions", ca_code)
blocked = [
    "ec2:AssociateAddress",
    "ec2:RunInstances",
    "ec2:CreateKeyPair",
    "iam:PassRole",
    "autoscaling:UpdateAutoScalingGroup",
]
check(all(action not in scale and action not in describe for action in blocked),
      "scale and describe allows omit public IP, RunInstances, SSH keys, PassRole, and ASG updates")
check(all(action in denied for action in blocked),
      "those actions sit on the unconditional deny list")
check(re.search(r"Sid\s*=\s*\"DenyUntaggedPower\"", ca_code) is not None
      and re.search(r"Action\s*=\s*local\.denied_actions", ca_code) is not None,
      "the deny list is the DenyUntaggedPower statement")
check(re.search(r"Action\s*=\s*local\.scale_actions", ca_code) is not None,
      "desired-capacity writes use the tag-scoped allow list")
check("CLUSTER_NAME" in manifest and "000000000000" in manifest, "manifest keeps the substitute tokens")
kinds = re.findall(r"(?m)^kind: (\S+)\s*$", manifest)
check(kinds == [
    "ServiceAccount",
    "ClusterRole",
    "ClusterRoleBinding",
    "Role",
    "RoleBinding",
    "Deployment",
    "PodDisruptionBudget",
], "manifest is the seven autoscaler objects in order")
if failed:
    sys.exit(1)
PY

python3 - "$MANIFEST" <<'PY'
import pathlib, sys
import yaml

manifest = pathlib.Path(sys.argv[1]).read_text()
docs = [doc for doc in yaml.safe_load_all(manifest) if doc]
failed = False

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

deps = [doc for doc in docs if doc.get("kind") == "Deployment"]
check(len(deps) == 1, "one Cluster Autoscaler Deployment")
dep = deps[0] if deps else {}
spec = dep.get("spec") or {}
check(spec.get("replicas") == 2, "parsed replicas is 2")
rolling = (spec.get("strategy") or {}).get("rollingUpdate") or {}
check(rolling.get("maxUnavailable") == 1, "parsed maxUnavailable is 1")
check(rolling.get("maxSurge") == 0, "parsed maxSurge is 0")

pod = ((spec.get("template") or {}).get("spec") or {})
check(pod.get("serviceAccountName") == "cluster-autoscaler", "pods use the IRSA service account")
constraints = pod.get("topologySpreadConstraints") or []
check(len(constraints) == 1, "pod spec has one topology spread constraint")
if constraints:
    item = constraints[0]
    check(item.get("topologyKey") == "topology.kubernetes.io/zone",
          "parsed zone spread key is the zone")
    check(item.get("whenUnsatisfiable") == "DoNotSchedule",
          "parsed zone spread is DoNotSchedule")
    check(item.get("maxSkew") == 1, "parsed zone spread maxSkew is 1")
    check(item.get("nodeAffinityPolicy") == "Honor",
          "parsed zone spread nodeAffinityPolicy is Honor")
    check(item.get("nodeTaintsPolicy") == "Honor",
          "parsed zone spread nodeTaintsPolicy is Honor")
    check("minDomains" not in item, "parsed zone spread has no minDomains")
    check("matchLabelKeys" not in item, "parsed zone spread has no matchLabelKeys")
    labels = ((item.get("labelSelector") or {}).get("matchLabels") or {})
    check(labels == {"app": "cluster-autoscaler"},
          "parsed zone spread selects app=cluster-autoscaler")
check(pod.get("nodeSelector") == {
    "kubernetes.io/os": "linux",
    "computerpets/node-pool": "api",
}, "parsed nodeSelector is linux plus the api pool label")
affinity = pod.get("affinity") or {}
check("nodeAffinity" not in affinity, "parsed affinity has no nodeAffinity")
anti = (affinity.get("podAntiAffinity") or {})
required = anti.get("requiredDuringSchedulingIgnoredDuringExecution") or []
preferred = anti.get("preferredDuringSchedulingIgnoredDuringExecution") or []

def term_key(term):
    return term.get("topologyKey")

def term_app(term):
    return ((term.get("labelSelector") or {}).get("matchLabels") or {}).get("app")

req_keys = [term_key(term) for term in required]
check(req_keys == ["kubernetes.io/hostname"], "required anti-affinity is hostname only")
check(all(term_app(term) == "cluster-autoscaler" for term in required) and len(required) == 1,
      "required anti-affinity selects app=cluster-autoscaler")
check(all(term.get("namespaces") == ["kube-system"] for term in required),
      "required anti-affinity is limited to kube-system")

check(preferred == [], "zone anti-affinity is not preferred")
check("topology.kubernetes.io/zone" not in req_keys, "zone anti-affinity is not required")

containers = pod.get("containers") or []
command = containers[0].get("command") if containers else []
command = command or []
check("--leader-elect=true" in command, "command turns leader election on")
check("--leader-elect-resource-lock=leases" in command, "command pins the lease lock")
check("--leader-elect-resource-name=cluster-autoscaler" in command, "command pins the lease name")
check(not any(str(arg) == "--leader-elect=false" or str(arg).startswith("--leader-elect=false") for arg in command),
      "command does not turn leader election off")
check(command.count("./cluster-autoscaler") == 1, "command starts the autoscaler binary once")

roles = [doc for doc in docs if doc.get("kind") == "ClusterRole"]
rules = (roles[0].get("rules") if roles else []) or []
create_ok = False
update_ok = False
for rule in rules:
    groups = rule.get("apiGroups") or []
    resources = rule.get("resources") or []
    verbs = rule.get("verbs") or []
    names = rule.get("resourceNames") or []
    if "coordination.k8s.io" in groups and "leases" in resources:
        if "create" in verbs and not names:
            create_ok = True
        if "get" in verbs and "update" in verbs and names == ["cluster-autoscaler"]:
            update_ok = True
check(create_ok and update_ok, "ClusterRole can create leases and update the named autoscaler lease")

accounts = [doc for doc in docs if doc.get("kind") == "ServiceAccount"]
check(len(accounts) == 1, "one service account")
ann = ((accounts[0].get("metadata") or {}).get("annotations") or {}) if accounts else {}
check(ann.get("eks.amazonaws.com/role-arn", "").startswith("arn:aws:iam::000000000000:role/"),
      "IRSA annotation stays the placeholder role")

pdbs = [doc for doc in docs if doc.get("kind") == "PodDisruptionBudget"]
check(len(pdbs) == 1, "one Cluster Autoscaler PodDisruptionBudget")
budget = pdbs[0] if pdbs else {}
check(budget.get("apiVersion") == "policy/v1", "parsed budget is policy/v1")
bmeta = budget.get("metadata") or {}
check(bmeta.get("name") == "cluster-autoscaler", "budget name matches the Deployment")
check(bmeta.get("namespace") == "kube-system", "budget namespace is kube-system")
check((dep.get("metadata") or {}).get("namespace") == "kube-system", "Deployment namespace is kube-system")
bspec = budget.get("spec") or {}
check(bspec.get("minAvailable") == 1, "parsed minAvailable is 1")
check("maxUnavailable" not in bspec, "budget does not set maxUnavailable")
check(not isinstance(bspec.get("minAvailable"), str), "minAvailable is not a percent string")
dep_sel = (spec.get("selector") or {}).get("matchLabels")
pdb_sel = (bspec.get("selector") or {}).get("matchLabels")
check(dep_sel == {"app": "cluster-autoscaler"}, "Deployment selector is app=cluster-autoscaler")
check(pdb_sel == dep_sel, "budget selector matches the Deployment selector")
if failed:
    sys.exit(1)
PY

if command -v kubectl >/dev/null 2>&1; then
  if kubectl apply --dry-run=client --validate=false -f "$MANIFEST" >/tmp/cp-ca-kubectl.out 2>/tmp/cp-ca-kubectl.err; then
    ok "kubectl client dry-run accepts cluster-autoscaler.yaml"
  elif grep -qE 'connection refused|localhost:8080' /tmp/cp-ca-kubectl.err; then
    ok "kubectl has no cluster; skipped client dry-run"
  else
    bad "kubectl client dry-run rejected cluster-autoscaler.yaml"
    cat /tmp/cp-ca-kubectl.err || true
  fi
  rm -f /tmp/cp-ca-kubectl.out /tmp/cp-ca-kubectl.err
else
  ok "kubectl not installed; skipped client dry-run"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
