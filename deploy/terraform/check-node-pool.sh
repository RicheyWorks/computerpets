#!/usr/bin/env bash
# ADR 0082 — private multi-AZ EKS node groups. No cloud account.
# Does not terraform apply. Does not create a cluster in this check.
# SSH stays closed. Nodes stay private. Zone label is not stamped.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MODULE="${ROOT}/deploy/terraform/modules/node_pool/main.tf"
VARS="${ROOT}/deploy/terraform/variables.tf"
OUTPUTS="${ROOT}/deploy/terraform/outputs.tf"
ROOT_MAIN="${ROOT}/deploy/terraform/main.tf"
TFVARS="${ROOT}/deploy/terraform/terraform.tfvars.example"
README="${ROOT}/deploy/terraform/README.md"
ADR="${ROOT}/docs/adr/0082-multi-az-node-pool.md"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
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

echo "== node pool files =="
need_file "$MODULE"
need_file "$ADR"
need_file "$VARS"

echo "== deny-safe markers =="
need_grep "$MODULE" 'node-pool ADR 0082' "module names ADR 0082"
need_grep "$MODULE" 'min-availability-zones=2' "module requires two zones"
need_grep "$MODULE" 'one-node-group-per-zone=true' "one node group per zone"
need_grep "$MODULE" 'public-nodes=false' "public nodes stay off"
need_grep "$MODULE" 'ssh-ingress=closed' "SSH ingress stays closed"
need_grep "$MODULE" 'zone-label=topology\.kubernetes\.io/zone' "zone label is the Kubernetes one"
need_grep "$MODULE" 'zone-label-source=instance-az' "zone label comes from the instance AZ"
need_grep "$MODULE" 'capacity=ON_DEMAND' "capacity is on-demand"
need_grep "$MODULE" 'imds=required' "IMDS requires tokens"
need_grep "$MODULE" 'imds-hop-limit=2' "IMDS hop limit is 2"
need_grep "$MODULE" 'root-volume-encrypted=true' "root volume is encrypted"
need_grep "$MODULE" 'min_size_per_zone[[:space:]]*=[[:space:]]*1' "min size per zone is 1"
need_grep "$MODULE" 'desired_size_per_zone[[:space:]]*=[[:space:]]*1' "desired size per zone is 1"
need_grep "$MODULE" 'aws_eks_node_group" "zone"' "managed node group exists"
need_grep "$MODULE" 'subnet_ids[[:space:]]*=[[:space:]]*\[each\.value\]' "each group takes one subnet"
need_grep "$MODULE" 'capacity_type[[:space:]]*=[[:space:]]*"ON_DEMAND"' "node group is on-demand"
need_grep "$MODULE" 'associate_public_ip_address[[:space:]]*=[[:space:]]*false' "launch template refuses a public IP"
need_grep "$MODULE" 'http_tokens[[:space:]]*=[[:space:]]*"required"' "launch template requires IMDSv2"
need_grep "$MODULE" 'http_put_response_hop_limit[[:space:]]*=[[:space:]]*2' "launch template sets hop limit 2"
need_grep "$MODULE" 'encrypted[[:space:]]*=[[:space:]]*true' "root volume encryption is on"
need_grep "$MODULE" 'computerpets/node-pool' "custom pool label is not the zone label"
need_grep "$ROOT_MAIN" 'terraform_data" "node_pool_gate"' "root plan gate exists"
need_grep "$ROOT_MAIN" 'length\(var\.node_pool_subnets\) >= 2' "plan gate requires two zones"
need_grep "$VARS" 'variable "enable_node_pool"' "root flag exists"
need_grep "$VARS" 'variable "node_pool_subnets"' "subnet map variable exists"
need_grep "$VARS" 'variable "eks_cluster_name"' "cluster name variable exists"
need_grep "$OUTPUTS" 'output "node_pool_zone_count"' "zone count is an output"
need_grep "$OUTPUTS" 'output "node_pool_public_nodes"' "public-nodes flag is an output"
need_grep "$OUTPUTS" 'output "node_pool_ssh_ingress"' "SSH ingress is an output"
need_grep "$README" 'ADR 0082' "terraform README names ADR 0082"
need_grep "$TFVARS" 'node_pool_subnets' "tfvars example documents the subnet map"
need_not_grep "$TFVARS" '^eks_cluster_name[[:space:]]*=' "tfvars example does not assign a cluster name"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'No Rui sprites' "no Rui sprites"
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
# API pool pin is ADR 0093. This check only requires the same label.
need_grep "$BLUE" 'nodeSelector:' "blue is pinned to the pool (ADR 0093)"
need_grep "$GREEN" 'nodeSelector:' "green is pinned to the pool (ADR 0093)"
need_grep "$BLUE" 'computerpets/node-pool: api$' "blue selects the api pool label"
need_grep "$GREEN" 'computerpets/node-pool: api$' "green selects the api pool label"

python3 - "$MODULE" "$ROOT_MAIN" <<'PY'
import pathlib, re, sys
module = pathlib.Path(sys.argv[1]).read_text()
root = pathlib.Path(sys.argv[2]).read_text()

def code_only(text):
    return "\n".join(line.split("#", 1)[0] for line in text.splitlines())

code = code_only(module)
root_code = code_only(root)
failed = False

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

labels = re.search(r"labels\s*=\s*\{([^}]*)\}", code, re.S)
label_body = labels.group(1) if labels else ""
check(labels is not None and "topology.kubernetes.io/zone" not in label_body,
      "labels block does not stamp the zone label")
check(re.search(r"remote_access\s*\{", code) is None, "module has no remote_access block")
check(re.search(r"(?m)^\s*key_name\s*=", code) is None, "module has no SSH key_name")
check("0.0.0.0/0" not in code and "0.0.0.0/0" not in root_code, "node pool has no open CIDR")
check("associate_public_ip_address = true" not in code, "public IP is not enabled")
check('resource "aws_eks_cluster"' not in code and 'resource "aws_eks_cluster"' not in root_code,
      "this root does not create an EKS cluster")
check('resource "aws_autoscaling_group"' not in code and 'resource "aws_autoscaling_group"' not in root_code,
      "this root does not declare a raw ASG")
check('resource "aws_vpc"' not in code and 'resource "aws_subnet"' not in code,
      "this module does not create a VPC or subnet")
check("from_port" not in code, "module does not open an ingress port")
check('resource "aws_security_group"' not in code, "module does not add its own security group")
if failed:
    sys.exit(1)
PY

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
