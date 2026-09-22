# 0006. Spring dev / staging / prod profiles and Kubernetes manifests (not Helm)

- **Status:** Accepted
- **Date:** 2026-08-17
- **Code:** `application.yml`, `application-dev.yml`, `application-staging.yml`, `application-prod.yml`, `ProductionProfileGuard`; `deploy/k8s/`

## Context

One `application.yml` plus env vars is enough for `mvn` and tests. A
cluster still needs a fail-hard shape: Postgres, shared Redis, no
Microsoft `dev-mode`, no H2. Helm would add a chart, values files, and
a packaging story this repo does not have. A service mesh would add a
sidecar for a control-plane that is already one Deployment.

## Decision

**Profiles overlay the same YAML + env keys.** No second config format.

| Profile | Database | Rate-limit / deny-list store | Microsoft `dev-mode` |
|---------|----------|------------------------------|----------------------|
| *(none)* / `dev` | H2 unless `SPRING_DATASOURCE_*` is set (compose already points `dev` at Postgres) | Redis default; `memory` allowed | env, default false |
| `staging` | Postgres required | Redis | false in the file (env can still override) |
| `prod` | Postgres required | Redis **required** | **never** — `ProductionProfileGuard` refuses env overrides |

`SPRING_PROFILES_ACTIVE=prod` is the documented production shape. The
guard also refuses an H2 JDBC URL.

**Kubernetes lives in `deploy/k8s/`** (Kustomize, not Helm): namespace,
Secret, ConfigMap, in-cluster Postgres 16 + Redis 7 (compose-equivalent
scaffolding), app Deployment + Service, optional Ingress. Probes are
`/actuator/health/liveness` and `/readiness` (permitted without a JWT).

Blue/green is two Deployments (`computerpets-blue` live,
`computerpets-green` at 0 replicas) and a Service `color` selector.
No mesh.

## Consequences

- Forgetting `SPRING_PROFILES_ACTIVE=prod` on a cluster still boots the
  H2 default. The k8s ConfigMap must keep `prod`.
- In-cluster Postgres/Redis are not a managed HA pair. They match
  docker-compose so the manifests are honest scaffolding.
- Image signing is keyless cosign on GHCR publish + fail-closed verify
  ([0061](0061-ghcr-image-signing.md)). Managed stores are Terraform in
  `deploy/terraform/` ([0062](0062-terraform-managed-stores.md)); in-cluster
  Postgres/Redis remain scaffolding until a keeper applies that root.
  Secret *injection* is env, Docker `*_FILE` mounts, or External Secrets /
  Vault agent into the existing Opaque Secret ([0056](0056-house-secrets-from-file-mounts.md)).
  A hosted Vault cluster is still the keeper's infrastructure.
- Helm values and a service mesh are non-goals until the app outgrows
  one Deployment and a selector flip.
