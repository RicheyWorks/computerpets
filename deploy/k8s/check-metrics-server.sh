#!/usr/bin/env bash
# ADR 0084 / 0085 / 0086 / 0087 / 0088 / 0089 — metrics-server install
# path, two replicas, required hostname anti-affinity, hard zone spread,
# a fail-closed kubelet CA mount, a fail-closed serving-cert Secret, and
# a required pin to the multi-AZ API node-pool label.
# No cluster. Does not kubectl apply. The manifest stays out of kustomize.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MS="${ROOT}/deploy/k8s/metrics-server.yaml"
KUSTOM="${ROOT}/deploy/k8s/kustomization.yaml"
HPA="${ROOT}/deploy/k8s/hpa.yaml"
BLUE="${ROOT}/deploy/k8s/deployment-blue.yaml"
GREEN="${ROOT}/deploy/k8s/deployment-green.yaml"
README="${ROOT}/deploy/k8s/README.md"
ADR="${ROOT}/docs/adr/0084-metrics-server.md"
ADR85="${ROOT}/docs/adr/0085-metrics-server-ha.md"
ADR86="${ROOT}/docs/adr/0086-metrics-server-kubelet-ca.md"
ADR87="${ROOT}/docs/adr/0087-metrics-server-serving-cert.md"
ADR88="${ROOT}/docs/adr/0088-metrics-server-zone-spread.md"
ADR89="${ROOT}/docs/adr/0089-metrics-server-node-pool.md"
ADR98="${ROOT}/docs/adr/0098-metrics-server-zone-hard-spread.md"
POOL="${ROOT}/deploy/terraform/modules/node_pool/main.tf"
PASS=0
FAIL=0

ok() { PASS=$((PASS + 1)); echo "ok - $*"; }
bad() { FAIL=$((FAIL + 1)); echo "not ok - $*"; }

need_file() {
  if [ -f "$1" ]; then ok "file $(basename "$1")"
  else bad "missing $1"; fi
}

need_absent() {
  if [ -e "$1" ]; then bad "unexpected file $1"
  else ok "absent $(basename "$1")"; fi
}

# House comments may name a forbidden flag. The gate reads the YAML body.
yaml_body() {
  grep -vE '^[[:space:]]*#' "$1" || true
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

need_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE -- "$pattern"; then ok "$name"
  else bad "$name (pattern not found in $(basename "$file") body)"; fi
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

need_not_grep_body() {
  local file="$1" pattern="$2" name="$3"
  if [ ! -f "$file" ]; then
    bad "$name (missing $(basename "$file"))"
    return
  fi
  if yaml_body "$file" | grep -qE -- "$pattern"; then bad "$name"
  else ok "$name"; fi
}

echo "== metrics-server files =="
need_file "$MS"
need_file "$KUSTOM"
need_file "$HPA"
need_file "$BLUE"
need_file "$GREEN"
need_file "$README"
need_file "$ADR"
need_file "$ADR85"
need_file "$ADR86"
need_file "$ADR87"
need_file "$ADR88"
need_file "$ADR89"
need_file "$ADR98"
need_file "$POOL"
need_absent "${ROOT}/deploy/k8s/Chart.yaml"
need_absent "${ROOT}/deploy/k8s/metrics-server/values.yaml"

echo "== upstream install contract =="
need_grep "$MS" 'Not in kustomization.yaml' "manifest says it stays out of kustomize"
need_grep "$MS" 'releases/download/v0\.9\.0/high-availability-1\.21\+\.yaml' "header cites upstream v0.9.0 high-availability-1.21+.yaml"
need_grep_body "$MS" '^kind: Deployment$' "kind includes a Deployment"
need_grep_body "$MS" '^kind: APIService$' "kind includes an APIService"
need_grep_body "$MS" 'name: metrics-server$' "addon name is metrics-server"
need_grep_body "$MS" 'namespace: kube-system$' "addon namespace is kube-system"
need_not_grep_body "$MS" 'namespace: computerpets$' "addon is not in the house namespace"
need_grep_body "$MS" 'image: registry\.k8s\.io/metrics-server/metrics-server:v0\.9\.0$' "image is pinned to v0.9.0"
need_not_grep_body "$MS" ':latest' "image tag is not floating"
need_not_grep_body "$MS" 'kubelet-insecure-tls' "kubelet scrapes stay verified"
need_grep_body "$MS" 'name: v1beta1\.metrics\.k8s\.io$' "APIService is v1beta1.metrics.k8s.io"
need_grep_body "$MS" 'group: metrics\.k8s\.io$' "API group is metrics.k8s.io"
need_grep_body "$MS" 'version: v1beta1$' "API version is v1beta1"
need_not_grep_body "$MS" 'insecureSkipTLSVerify' "APIService does not skip serving-cert verification"
need_grep_body "$MS" 'runAsNonRoot: true' "container runs as non-root"
need_grep_body "$MS" 'readOnlyRootFilesystem: true' "root filesystem is read-only"
need_grep_body "$MS" 'allowPrivilegeEscalation: false' "privilege escalation is off"
need_grep_body "$MS" 'priorityClassName: system-cluster-critical' "priority class is system-cluster-critical"
need_grep_body "$MS" 'serviceAccountName: metrics-server' "service account is metrics-server"
need_grep_body "$MS" '^  replicas: 2$' "Deployment replicas is 2"
need_not_grep_body "$MS" '^  replicas: 1$' "Deployment is not a single replica"
need_grep_body "$MS" 'podAntiAffinity:' "pod anti-affinity is set"
need_grep_body "$MS" 'requiredDuringSchedulingIgnoredDuringExecution:' "anti-affinity is required"
need_not_grep_body "$MS" 'preferredDuringSchedulingIgnoredDuringExecution:' "anti-affinity is not a preference"
need_grep_body "$MS" 'topologyKey: kubernetes.io/hostname$' "anti-affinity topology is hostname"
need_grep_body "$MS" 'topologySpreadConstraints:' "zone spread is set"
need_grep_body "$MS" 'topologyKey: topology\.kubernetes\.io/zone$' "zone spread topology is the zone label"
need_grep_body "$MS" 'maxSkew: 1$' "zone spread maxSkew is 1"
need_grep_body "$MS" 'whenUnsatisfiable: DoNotSchedule$' "zone spread is DoNotSchedule"
need_not_grep_body "$MS" 'whenUnsatisfiable: ScheduleAnyway$' "zone spread is not ScheduleAnyway"
need_grep_body "$MS" 'nodeTaintsPolicy: Honor$' "zone spread honors taints"
need_grep_body "$MS" 'nodeAffinityPolicy: Honor$' "zone spread counts only selected nodes"
need_not_grep_body "$MS" 'nodeAffinityPolicy: Ignore$' "zone spread does not count nodes outside the selector"
need_grep_body "$MS" 'computerpets/node-pool: api$' "nodeSelector requires the api pool label"
need_grep_body "$MS" 'kubernetes.io/os: linux$' "nodeSelector still requires linux"
need_not_grep_body "$MS" 'minDomains:' "zone spread has no zone floor"
need_not_grep_body "$MS" 'operator: NotIn$' "node selector is not inverted"
need_not_grep_body "$MS" 'operator: DoesNotExist$' "node selector does not match a missing key"
need_grep_body "$MS" '^      maxUnavailable: 1$' "rolling update maxUnavailable is 1"
need_grep_body "$MS" '^kind: PodDisruptionBudget$' "addon disruption budget is present"
need_grep_body "$MS" '^  minAvailable: 1$' "addon budget keeps one pod"
need_not_grep_body "$MS" 'hostNetwork:[[:space:]]*true' "no host network"
need_not_grep_body "$MS" 'hostPID:[[:space:]]*true' "no host PID"
need_not_grep_body "$MS" 'privileged:[[:space:]]*true' "no privileged container"

echo "== kubelet CA mount =="
need_grep_body "$MS" '--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca\.crt$' "kubelet CA flag points at the mount"
need_grep_body "$MS" 'mountPath: /etc/metrics-server/kubelet-ca$' "kubelet CA mount path matches the flag"
need_grep_body "$MS" '^[[:space:]]*readOnly: true$' "kubelet CA mount is read-only"
need_grep_body "$MS" '^[[:space:]]*optional: false$' "kubelet CA volume is required"
need_grep_body "$MS" '^[[:space:]]*- key: ca\.crt$' "kubelet CA key is ca.crt"
need_grep_body "$MS" '^[[:space:]]*path: ca\.crt$' "kubelet CA file name is ca.crt"
need_not_grep_body "$MS" 'kubelet-insecure-tls' "kubelet scrapes stay verified"
need_not_grep_body "$MS" 'deprecated-kubelet-completely-insecure' "kubelet hop stays encrypted"
need_not_grep_body "$MS" 'hostPath:' "kubelet CA is not a hostPath"
need_not_grep_body "$MS" 'kube-root-ca\.crt' "kubelet CA is not the automatic cluster root ConfigMap"
need_not_grep_body "$MS" 'serviceaccount/ca\.crt' "kubelet CA is not the service-account bundle"
need_not_grep_body "$MS" 'BEGIN CERTIFICATE' "this file does not vendor a CA"
need_not_grep_body "$MS" '^kind: ConfigMap$' "the CA ConfigMap is not in this file"
need_not_grep_body "$MS" '^kind: Secret$' "the CA Secret is not in this file"
need_not_grep_body "$MS" 'optional: true' "kubelet CA volume is not optional"

if [ -f "$MS" ]; then
  image_count="$(yaml_body "$MS" | grep -c 'image: registry.k8s.io/metrics-server/metrics-server:v0.9.0' || true)"
  if [ "${image_count}" = "1" ]; then ok "one pinned metrics-server image"
  else bad "expected one pinned metrics-server image (found ${image_count})"; fi
  skip_count="$(yaml_body "$MS" | grep -c 'insecureSkipTLSVerify' || true)"
  if [ "${skip_count}" = "0" ]; then ok "APIService TLS skip is absent"
  else bad "expected no insecureSkipTLSVerify (found ${skip_count})"; fi
  deploy_count="$(yaml_body "$MS" | grep -c '^kind: Deployment$' || true)"
  if [ "${deploy_count}" = "1" ]; then ok "one Deployment"
  else bad "expected one Deployment (found ${deploy_count})"; fi
  replica_count="$(yaml_body "$MS" | grep -c '^  replicas: 2$' || true)"
  if [ "${replica_count}" = "1" ]; then ok "replicas 2 appears once"
  else bad "expected one replicas: 2 (found ${replica_count})"; fi
  affinity_count="$(yaml_body "$MS" | grep -c 'podAntiAffinity:' || true)"
  if [ "${affinity_count}" = "1" ]; then ok "one podAntiAffinity"
  else bad "expected one podAntiAffinity (found ${affinity_count})"; fi
  spread_count="$(yaml_body "$MS" | grep -c 'topologySpreadConstraints:' || true)"
  if [ "${spread_count}" = "1" ]; then ok "one topologySpreadConstraints"
  else bad "expected one topologySpreadConstraints (found ${spread_count})"; fi
  zone_count="$(yaml_body "$MS" | grep -c 'topologyKey: topology.kubernetes.io/zone' || true)"
  if [ "${zone_count}" = "1" ]; then ok "one zone topology key"
  else bad "expected one zone topology key (found ${zone_count})"; fi
  host_key="$(yaml_body "$MS" | grep -c 'topologyKey: kubernetes.io/hostname' || true)"
  if [ "${host_key}" = "1" ]; then ok "hostname anti-affinity key appears once"
  else bad "expected one hostname topology key (found ${host_key})"; fi
  hard_count="$(yaml_body "$MS" | grep -c 'whenUnsatisfiable: DoNotSchedule' || true)"
  if [ "${hard_count}" = "1" ]; then ok "DoNotSchedule appears once"
  else bad "expected one DoNotSchedule (found ${hard_count})"; fi
  soft_count="$(yaml_body "$MS" | grep -c 'whenUnsatisfiable: ScheduleAnyway' || true)"
  if [ "${soft_count}" = "0" ]; then ok "ScheduleAnyway is absent"
  else bad "expected no ScheduleAnyway (found ${soft_count})"; fi
  pool_sel="$(yaml_body "$MS" | grep -c 'computerpets/node-pool: api' || true)"
  if [ "${pool_sel}" = "1" ]; then ok "pool label selector appears once"
  else bad "expected one computerpets/node-pool: api (found ${pool_sel})"; fi
  os_sel="$(yaml_body "$MS" | grep -c 'kubernetes.io/os: linux' || true)"
  if [ "${os_sel}" = "1" ]; then ok "linux nodeSelector appears once"
  else bad "expected one kubernetes.io/os: linux (found ${os_sel})"; fi
  affinity_pol="$(yaml_body "$MS" | grep -c 'nodeAffinityPolicy: Honor' || true)"
  if [ "${affinity_pol}" = "1" ]; then ok "nodeAffinityPolicy Honor appears once"
  else bad "expected one nodeAffinityPolicy: Honor (found ${affinity_pol})"; fi
  selector_count="$(yaml_body "$MS" | grep -c 'nodeSelector:' || true)"
  if [ "${selector_count}" = "1" ]; then ok "one nodeSelector"
  else bad "expected one nodeSelector (found ${selector_count})"; fi
  pdb_count="$(yaml_body "$MS" | grep -c '^kind: PodDisruptionBudget$' || true)"
  if [ "${pdb_count}" = "1" ]; then ok "one addon PodDisruptionBudget"
  else bad "expected one addon PodDisruptionBudget (found ${pdb_count})"; fi
  ca_flag="$(yaml_body "$MS" | grep -c -- '--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca.crt' || true)"
  if [ "${ca_flag}" = "1" ]; then ok "kubelet CA flag appears once"
  else bad "expected one kubelet CA flag (found ${ca_flag})"; fi
  ca_name="$(yaml_body "$MS" | grep -cE -- '^[[:space:]]*(- )?name: kubelet-ca$' || true)"
  if [ "${ca_name}" = "2" ]; then ok "kubelet-ca is named on the mount and the volume"
  else bad "expected kubelet-ca on the mount and the volume (found ${ca_name})"; fi
  ro_count="$(yaml_body "$MS" | grep -cE '^[[:space:]]*readOnly: true$' || true)"
  if [ "${ro_count}" = "2" ]; then ok "kubelet CA and serving cert mounts are read-only"
  else bad "expected two readOnly: true (found ${ro_count})"; fi
  opt_false="$(yaml_body "$MS" | grep -cE '^[[:space:]]*optional: false$' || true)"
  if [ "${opt_false}" = "2" ]; then ok "both cert volumes are required"
  else bad "expected two optional: false (found ${opt_false})"; fi
  cm_count="$(yaml_body "$MS" | grep -cE '^[[:space:]]*name: metrics-server-kubelet-ca$' || true)"
  sec_count="$(yaml_body "$MS" | grep -cE '^[[:space:]]*secretName: metrics-server-kubelet-ca$' || true)"
  if [ "${cm_count}" = "1" ] && [ "${sec_count}" = "0" ] && yaml_body "$MS" | grep -qE '^[[:space:]]*configMap:'; then
    ok "kubelet CA volume is a required ConfigMap"
  elif [ "${cm_count}" = "0" ] && [ "${sec_count}" = "1" ] && yaml_body "$MS" | grep -qE '^[[:space:]]*secret:'; then
    ok "kubelet CA volume is a required Secret"
  else
    bad "expected one kubelet CA source (ConfigMap or Secret metrics-server-kubelet-ca; configMap=${cm_count} secret=${sec_count})"
  fi
fi

echo "== serving cert mount =="
need_grep_body "$MS" '--tls-cert-file=/etc/metrics-server/serving/tls\.crt$' "serving cert flag points at the mount"
need_grep_body "$MS" '--tls-private-key-file=/etc/metrics-server/serving/tls\.key$' "serving key flag points at the mount"
need_grep_body "$MS" 'mountPath: /etc/metrics-server/serving$' "serving mount path matches the flags"
need_grep_body "$MS" '^[[:space:]]*- key: tls\.crt$' "serving cert key is tls.crt"
need_grep_body "$MS" '^[[:space:]]*path: tls\.crt$' "serving cert file name is tls.crt"
need_grep_body "$MS" '^[[:space:]]*- key: tls\.key$' "serving key key is tls.key"
need_grep_body "$MS" '^[[:space:]]*path: tls\.key$' "serving key file name is tls.key"
need_grep_body "$MS" '^[[:space:]]*secretName: metrics-server-serving$' "serving volume is Secret metrics-server-serving"
need_not_grep_body "$MS" 'insecureSkipTLSVerify' "APIService does not skip serving-cert verification"
need_not_grep_body "$MS" 'caBundle:' "this file does not vendor an APIService CA"
need_not_grep_body "$MS" 'kubelet-insecure-tls' "kubelet scrapes stay verified"
need_not_grep_body "$MS" 'BEGIN CERTIFICATE' "this file does not vendor a serving certificate"
need_not_grep_body "$MS" 'BEGIN PRIVATE KEY' "this file does not vendor a serving key"
need_not_grep_body "$MS" 'BEGIN RSA PRIVATE KEY' "this file does not vendor an RSA serving key"
need_not_grep_body "$MS" 'hostPath:' "serving cert is not a hostPath"
need_not_grep_body "$MS" '^kind: Secret$' "the serving Secret is not in this file"
need_not_grep_body "$MS" 'optional: true' "serving volume is not optional"

if [ -f "$MS" ]; then
  cert_flag="$(yaml_body "$MS" | grep -c -- '--tls-cert-file=/etc/metrics-server/serving/tls.crt' || true)"
  if [ "${cert_flag}" = "1" ]; then ok "serving cert flag appears once"
  else bad "expected one tls-cert-file flag (found ${cert_flag})"; fi
  key_flag="$(yaml_body "$MS" | grep -c -- '--tls-private-key-file=/etc/metrics-server/serving/tls.key' || true)"
  if [ "${key_flag}" = "1" ]; then ok "serving key flag appears once"
  else bad "expected one tls-private-key-file flag (found ${key_flag})"; fi
  serving_name="$(yaml_body "$MS" | grep -cE -- '^[[:space:]]*(- )?name: serving-cert$' || true)"
  if [ "${serving_name}" = "2" ]; then ok "serving-cert is named on the mount and the volume"
  else bad "expected serving-cert on the mount and the volume (found ${serving_name})"; fi
  serving_secret="$(yaml_body "$MS" | grep -cE -- '^[[:space:]]*secretName: metrics-server-serving$' || true)"
  if [ "${serving_secret}" = "1" ]; then ok "one serving Secret reference"
  else bad "expected one secretName metrics-server-serving (found ${serving_secret})"; fi
  serving_cm="$(yaml_body "$MS" | grep -cE -- 'metrics-server-serving' || true)"
  if [ "${serving_cm}" = "1" ]; then ok "serving object name appears once"
  else bad "expected metrics-server-serving once (found ${serving_cm})"; fi
fi

echo "== stays out of local apply =="
need_not_grep "$KUSTOM" '^[[:space:]]*-[[:space:]]*metrics-server\.yaml[[:space:]]*$' "kustomization does not list metrics-server.yaml"
need_grep "$KUSTOM" 'metrics-server\.yaml' "kustomization comment names the omitted file"
need_grep "$HPA" 'metrics-server\.yaml' "hpa.yaml names the install path"
need_grep "$HPA" 'minReplicas: 3' "HPA floor stays 3"
need_grep "$HPA" 'maxReplicas: 6' "HPA ceiling stays 6"
need_not_grep "$HPA" 'image:.*metrics-server' "hpa.yaml does not embed the addon image"
need_grep "$BLUE" 'replicas: 2' "blue local replica count stays 2"
need_grep "$GREEN" 'replicas: 0' "green stays the idle slot"
# API pool pin is ADR 0093. This check only requires the same label.
need_grep "$BLUE" 'nodeSelector:' "blue is pinned to the pool (ADR 0093)"
need_grep "$GREEN" 'nodeSelector:' "green is pinned to the pool (ADR 0093)"
need_grep "$BLUE" 'computerpets/node-pool: api$' "blue selects the api pool label"
need_grep "$GREEN" 'computerpets/node-pool: api$' "green selects the api pool label"
need_grep "$POOL" '"computerpets/node-pool"[[:space:]]*=[[:space:]]*"api"' "node pool label is computerpets/node-pool=api"

echo "== docs =="
need_grep "$README" 'metrics-server\.yaml' "README names the manifest"
need_grep "$README" 'ADR 0084' "README names ADR 0084"
need_grep "$README" 'ADR 0085' "README names ADR 0085"
need_grep "$README" 'v0\.9\.0' "README names the pinned tag"
need_grep "$README" 'replicas: 2' "README names two replicas"
need_grep "$README" 'kubelet-insecure-tls' "README forbids the kubelet TLS skip"
need_grep "$ADR" 'v0\.9\.0' "ADR names the pinned tag"
need_grep "$ADR" 'metrics\.k8s\.io' "ADR names the API group"
need_grep "$ADR" 'kubelet-insecure-tls' "ADR forbids the kubelet TLS skip"
need_grep "$ADR" 'Catalog stays 221' "catalog stays 221"
need_grep "$ADR" 'not in the kustomization' "ADR keeps the file out of kustomize"
need_grep "$ADR85" 'replicas: 2' "HA ADR names two replicas"
need_grep "$ADR85" 'anti-affinity' "HA ADR names anti-affinity"
need_grep "$ADR85" 'high-availability-1.21+' "HA ADR names the upstream file"
need_grep "$ADR85" 'kubelet-insecure-tls' "HA ADR forbids the kubelet TLS skip"
need_grep "$ADR85" 'Catalog stays 221' "HA ADR keeps catalog 221"
need_grep "$ADR85" 'not in the kustomization' "HA ADR keeps the file out of kustomize"
need_grep "$ADR86" 'kubelet-certificate-authority' "CA ADR names the flag"
need_grep "$ADR86" 'metrics-server-kubelet-ca' "CA ADR names the operator object"
need_grep "$ADR86" 'optional: false' "CA ADR requires the volume"
need_grep "$ADR86" 'ConfigMap' "CA ADR names a ConfigMap"
need_grep "$ADR86" 'Secret' "CA ADR names a Secret"
need_grep "$ADR86" 'kubelet-insecure-tls' "CA ADR forbids the kubelet TLS skip"
need_grep "$ADR86" 'Catalog stays 221' "CA ADR keeps catalog 221"
need_grep "$ADR86" 'not in the kustomization' "CA ADR keeps the file out of kustomize"
need_grep "$ADR86" 'replicas: 2' "CA ADR keeps two replicas"
need_grep "$README" 'ADR 0086' "README names ADR 0086"
need_grep "$README" 'kubelet-certificate-authority' "README names the kubelet CA flag"
need_grep "$README" 'metrics-server-kubelet-ca' "README names the operator CA object"
need_grep "$ADR87" 'tls-cert-file' "serving ADR names the cert flag"
need_grep "$ADR87" 'tls-private-key-file' "serving ADR names the key flag"
need_grep "$ADR87" 'metrics-server-serving' "serving ADR names the Secret"
need_grep "$ADR87" 'optional: false' "serving ADR requires the volume"
need_grep "$ADR87" 'insecureSkipTLSVerify' "serving ADR names the APIService skip"
need_grep "$ADR87" 'caBundle' "serving ADR names the keeper CA field"
need_grep "$ADR87" 'kubelet-insecure-tls' "serving ADR forbids the kubelet TLS skip"
need_grep "$ADR87" 'kubelet-certificate-authority' "serving ADR keeps the kubelet CA"
need_grep "$ADR87" 'replicas: 2' "serving ADR keeps two replicas"
need_grep "$ADR87" 'Catalog stays 221' "serving ADR keeps catalog 221"
need_grep "$ADR87" 'not in the kustomization' "serving ADR keeps the file out of kustomize"
need_grep "$README" 'ADR 0087' "README names ADR 0087"
need_grep "$README" 'tls-cert-file' "README names the serving cert flag"
need_grep "$README" 'metrics-server-serving' "README names the serving Secret"
need_grep "$README" 'insecureSkipTLSVerify' "README names the APIService skip"
need_grep "$ADR88" 'topology.kubernetes.io/zone' "zone ADR names the zone key"
need_grep "$ADR88" 'ScheduleAnyway' "zone ADR names the soft action"
need_grep "$ADR88" 'DoNotSchedule' "zone ADR names the hard action"
need_grep "$ADR88" 'kubernetes.io/hostname' "zone ADR keeps hostname anti-affinity"
need_grep "$ADR88" 'replicas: 2' "zone ADR keeps two replicas"
need_grep "$ADR88" 'insecureSkipTLSVerify' "zone ADR keeps serving verification"
need_grep "$ADR88" 'kubelet-insecure-tls' "zone ADR forbids the kubelet TLS skip"
need_grep "$ADR88" 'Catalog stays 221' "zone ADR keeps catalog 221"
need_grep "$ADR88" 'not in the kustomization' "zone ADR keeps the file out of kustomize"
need_grep "$README" 'ADR 0088' "README names ADR 0088"
need_grep "$README" 'ADR 0098' "README names ADR 0098"
need_grep "$README" 'topology.kubernetes.io/zone' "README names the zone key"
need_grep "$README" 'DoNotSchedule' "README names the hard zone action"
need_grep "$README" 'One labeled zone still schedules' "README is honest about one zone"
need_grep "$ADR98" 'DoNotSchedule' "hard zone ADR names DoNotSchedule"
need_grep "$ADR98" 'One labeled zone still schedules' "hard zone ADR is honest about one zone"
need_grep "$ADR98" 'Do not set minDomains' "hard zone ADR refuses minDomains"
need_grep "$ADR98" 'replicas: 2' "hard zone ADR keeps two replicas"
need_grep "$ADR98" 'Catalog stays 221' "hard zone ADR keeps catalog 221"
need_grep "$ADR98" 'not in the kustomization' "hard zone ADR keeps the file out of kustomize"
need_grep "$ADR98" 'No Rui sprites' "hard zone ADR has no Rui sprites"
need_grep "$ADR89" 'computerpets/node-pool' "pool ADR names the pool label"
need_grep "$ADR89" 'nodeAffinityPolicy' "pool ADR names nodeAffinityPolicy"
need_grep "$ADR89" 'ScheduleAnyway' "pool ADR keeps the soft zone action"
need_grep "$ADR89" 'kubernetes.io/hostname' "pool ADR keeps hostname anti-affinity"
need_grep "$ADR89" 'enable_node_pool=false' "pool ADR names the kind switch"
need_grep "$ADR89" 'Pending' "pool ADR names the unlabeled Pending path"
need_grep "$ADR89" 'replicas: 2' "pool ADR keeps two replicas"
need_grep "$ADR89" 'insecureSkipTLSVerify' "pool ADR keeps serving verification"
need_grep "$ADR89" 'kubelet-insecure-tls' "pool ADR forbids the kubelet TLS skip"
need_grep "$ADR89" 'Catalog stays 221' "pool ADR keeps catalog 221"
need_grep "$ADR89" 'not in the kustomization' "pool ADR keeps the file out of kustomize"
need_grep "$ADR89" 'No Rui sprites' "pool ADR has no Rui sprites"
need_grep "$README" 'ADR 0089' "README names ADR 0089"
need_grep "$README" 'computerpets/node-pool' "README names the pool label"
need_grep "$README" 'nodeAffinityPolicy' "README names nodeAffinityPolicy"
need_grep "$README" 'enable_node_pool=false' "README names the kind switch"

python3 - "$MS" <<'PY'
import pathlib, sys
text = pathlib.Path(sys.argv[1]).read_text()
body = "\n".join(line.split("#", 1)[0].rstrip() for line in text.splitlines())
lines = body.splitlines()
failed = False

def check(cond, name):
    global failed
    if cond:
        print(f"ok - {name}")
    else:
        print(f"not ok - {name}")
        failed = True

selectors = []
i = 0
while i < len(lines):
    if lines[i] == "      nodeSelector:":
        block = []
        i += 1
        while i < len(lines) and (lines[i].startswith("        ") or lines[i].strip() == ""):
            if lines[i].strip():
                block.append(lines[i].strip())
            i += 1
        selectors.append(block)
        continue
    i += 1

check(len(selectors) == 1, "one pod nodeSelector block")
keys = selectors[0] if selectors else []
check(keys == ["kubernetes.io/os: linux", "computerpets/node-pool: api"],
      "nodeSelector is linux plus the api pool label")

spread = []
i = 0
while i < len(lines):
    if lines[i] == "      topologySpreadConstraints:":
        i += 1
        while i < len(lines) and lines[i].startswith("      - "):
            # list item starts here; following fields are indented further
            item = [lines[i][len("      - "):].strip()]
            i += 1
            while i < len(lines) and (lines[i].startswith("        ") and not lines[i].startswith("      - ")):
                item.append(lines[i].strip())
                i += 1
            spread.append(item)
            continue
        break
    i += 1

check(len(spread) == 1, "one topology spread item")
item = spread[0] if spread else []
check("nodeAffinityPolicy: Honor" in item, "spread item sets nodeAffinityPolicy Honor")
check("whenUnsatisfiable: DoNotSchedule" in item, "spread item is DoNotSchedule")
check("whenUnsatisfiable: ScheduleAnyway" not in item, "spread item is not ScheduleAnyway")
check("topologyKey: topology.kubernetes.io/zone" in item, "spread item stays on the zone key")
check("nodeTaintsPolicy: Honor" in item, "spread item still honors taints")
if failed:
    sys.exit(1)
PY

if command -v kubectl >/dev/null 2>&1; then
  if kubectl apply --dry-run=client --validate=false -f "$MS" >/dev/null 2>&1; then
    ok "kubectl client dry-run accepts metrics-server.yaml"
  else
    bad "kubectl client dry-run rejected metrics-server.yaml"
  fi
else
  ok "kubectl not installed; skipped client dry-run"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
if [ "${FAIL}" -ne 0 ]; then
  exit 1
fi
