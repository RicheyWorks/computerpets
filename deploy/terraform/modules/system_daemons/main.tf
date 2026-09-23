variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "reassert_kube_proxy_toleration" {
  type        = bool
  description = "When true, plan probes DaemonSet kube-proxy and apply reasserts coverage if it drifted (ADR 0097). Default false so CI and kind/minikube do not call kubectl."
  default     = false
}

locals {
  # system-daemons ADR 0096
  # addon=vpc-cni
  # daemonset=aws-node
  # kube-proxy-path=strategic-merge-patch
  # kube-proxy-configuration-values=rejected
  # toleration-key=computerpets/node-pool
  # toleration-operator=Equal
  # toleration-value=api
  # toleration-effect=NoSchedule
  # chart-default-toleration=operator-Exists
  # image-fork=false
  # addon-version-pinned=false
  # kind-minikube=untainted
  # This module does not create an EKS cluster. It does not fork an
  # addon image. It does not set addon_version. Kind and minikube do
  # not instantiate it (enable_node_pool=false). Do not taint a kind
  # or minikube node. A toleration does not require the taint.
  # The kube-proxy managed addon schema rejects a tolerations field.
  # Do not put that field in kube-proxy configuration_values.
  # kube-proxy-hook=ADR-0097
  # kube-proxy-reassert-default=false
  # coverage=keyless-Exists-or-exact-Equal
  # kind-minikube-hook=refused
  vpc_cni_values   = jsondecode(file("${path.module}/vpc-cni-configuration-values.json"))
  kube_proxy_patch = file("${path.module}/kube-proxy-api-pool-toleration.yaml")
  kube_proxy_hook  = file("${path.module}/reassert-kube-proxy-toleration.sh")
  tolerations      = try(local.vpc_cni_values.tolerations, [])

  cluster_ok = can(regex("^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$", var.cluster_name))

  vpc_cni_ok = (
    keys(local.vpc_cni_values) == ["tolerations"] &&
    length(local.tolerations) == 2 &&
    try(local.tolerations[0].operator, "") == "Exists" &&
    length(keys(local.tolerations[0])) == 1 &&
    try(local.tolerations[1].key, "") == "computerpets/node-pool" &&
    try(local.tolerations[1].operator, "") == "Equal" &&
    try(local.tolerations[1].value, "") == "api" &&
    try(local.tolerations[1].effect, "") == "NoSchedule" &&
    length(keys(local.tolerations[1])) == 4
  )

  kube_proxy_patch_ok = (
    strcontains(local.kube_proxy_patch, "kind: DaemonSet") &&
    strcontains(local.kube_proxy_patch, "name: kube-proxy") &&
    strcontains(local.kube_proxy_patch, "namespace: kube-system") &&
    strcontains(local.kube_proxy_patch, "key: computerpets/node-pool") &&
    strcontains(local.kube_proxy_patch, "operator: Equal") &&
    strcontains(local.kube_proxy_patch, "value: api") &&
    strcontains(local.kube_proxy_patch, "effect: NoSchedule") &&
    !strcontains(local.kube_proxy_patch, "image:") &&
    !strcontains(local.kube_proxy_patch, "configuration_values")
  )

  recorded = local.vpc_cni_ok && local.kube_proxy_patch_ok

  hook_ok = (
    strcontains(local.kube_proxy_hook, "fail closed") &&
    strcontains(local.kube_proxy_hook, "minikube") &&
    strcontains(local.kube_proxy_hook, "kind-") &&
    strcontains(local.kube_proxy_hook, "BLANKET_EXISTS") &&
    strcontains(local.kube_proxy_hook, "computerpets/node-pool") &&
    strcontains(local.kube_proxy_hook, "--probe") &&
    strcontains(local.kube_proxy_hook, "--live") &&
    strcontains(local.kube_proxy_hook, "strategic") &&
    strcontains(local.kube_proxy_hook, "kube-proxy-api-pool-toleration.yaml") &&
    !strcontains(local.kube_proxy_hook, "kubectl taint") &&
    !strcontains(local.kube_proxy_hook, "configuration_values")
  )

  reassert = var.reassert_kube_proxy_toleration && local.cluster_ok
}

resource "terraform_data" "system_daemon_toleration_gate" {
  lifecycle {
    precondition {
      condition     = local.recorded
      error_message = "API pool system DaemonSet toleration is fail-closed (ADR 0096). vpc-cni configuration_values must be only tolerations: the chart default operator Exists, then key computerpets/node-pool, operator Equal, value api, effect NoSchedule. The kube-proxy strategic-merge patch must carry that same Equal entry and must not name an image. The kube-proxy addon schema rejects configuration_values tolerations. Set enable_node_pool=false for kind or minikube. No live AWS apply from this gate."
    }
  }
}

resource "terraform_data" "kube_proxy_toleration_hook_gate" {
  lifecycle {
    precondition {
      condition     = local.hook_ok
      error_message = "kube-proxy API pool toleration hook is fail-closed (ADR 0097). The reassert script must classify a keyless operator Exists (effect empty or NoSchedule) or the exact Equal entry, refuse kind and minikube, and fail closed when a strategic-merge patch does not stick. It must not taint and must not send configuration_values. Set reassert_kube_proxy_toleration=false for CI, kind, and minikube. No live AWS apply from this gate."
    }
  }
}

# Read-only probe. Apply reasserts only when this count is 1 and coverage
# changed. CI and terraform test leave the flag false, so this data source
# is not planned and kubectl is not called. A kind or minikube context
# makes the probe exit non-zero and the plan fails closed.
data "external" "kube_proxy_toleration" {
  count = local.reassert ? 1 : 0
  program = [
    "bash",
    "${path.module}/reassert-kube-proxy-toleration.sh",
    "--probe",
  ]
  query = {
    cluster_name = var.cluster_name
  }
}

resource "terraform_data" "kube_proxy_toleration_reassert" {
  count = local.reassert ? 1 : 0

  triggers_replace = {
    patch_sha256  = filebase64sha256("${path.module}/kube-proxy-api-pool-toleration.yaml")
    script_sha256 = filebase64sha256("${path.module}/reassert-kube-proxy-toleration.sh")
    covered       = data.external.kube_proxy_toleration[0].result.covered
  }

  depends_on = [
    aws_eks_addon.vpc_cni,
    terraform_data.kube_proxy_toleration_hook_gate,
  ]

  provisioner "local-exec" {
    command = "bash \"${path.module}/reassert-kube-proxy-toleration.sh\" --live"
  }
}

# vpc-cni owns the aws-node DaemonSet. configuration_values replaces the
# tolerations list, so the chart default operator Exists stays in the
# document beside the exact API pool entry. OVERWRITE is what writes
# that document. PRESERVE would keep a live document that omits it.
# addon_version stays unset so this resource does not pin an image.
# An existing managed addon must be imported before the first apply:
# module.system_daemons[0].aws_eks_addon.vpc_cni
# id <cluster>:vpc-cni
# kube-proxy durability is the reassert hook (ADR 0097), not this addon.
resource "aws_eks_addon" "vpc_cni" {
  count                       = local.cluster_ok ? 1 : 0
  cluster_name                = var.cluster_name
  addon_name                  = "vpc-cni"
  configuration_values        = jsonencode(local.vpc_cni_values)
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  depends_on = [terraform_data.system_daemon_toleration_gate]
}

output "recorded" {
  description = "True when both the vpc-cni document and the kube-proxy patch carry the API pool toleration."
  value       = local.recorded
}

output "addon_planned" {
  description = "True when aws_eks_addon.vpc_cni is planned. False until eks_cluster_name is set."
  value       = local.cluster_ok
}

output "vpc_cni_configuration_values" {
  description = "JSON document passed to the vpc-cni addon. Tolerations only."
  value       = jsonencode(local.vpc_cni_values)
}

output "kube_proxy_hook_recorded" {
  description = "True when the kube-proxy reassert script still classifies coverage and fails closed (ADR 0097)."
  value       = local.hook_ok
}

output "kube_proxy_reassert_enabled" {
  description = "True only when the keeper opted into the live probe. False for CI, kind, and minikube."
  value       = local.reassert
}
