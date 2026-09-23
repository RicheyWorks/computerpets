variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "cluster_name" {
  type = string
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
  vpc_cni_values   = jsondecode(file("${path.module}/vpc-cni-configuration-values.json"))
  kube_proxy_patch = file("${path.module}/kube-proxy-api-pool-toleration.yaml")
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
}

resource "terraform_data" "system_daemon_toleration_gate" {
  lifecycle {
    precondition {
      condition     = local.recorded
      error_message = "API pool system DaemonSet toleration is fail-closed (ADR 0096). vpc-cni configuration_values must be only tolerations: the chart default operator Exists, then key computerpets/node-pool, operator Equal, value api, effect NoSchedule. The kube-proxy strategic-merge patch must carry that same Equal entry and must not name an image. The kube-proxy addon schema rejects configuration_values tolerations. Set enable_node_pool=false for kind or minikube. No live AWS apply from this gate."
    }
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
