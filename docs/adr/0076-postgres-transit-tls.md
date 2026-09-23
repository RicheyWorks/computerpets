# 0076. Postgres transit TLS

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `PostgresJdbcSsl`; `ProductionProfileGuard.rejectUnsafePostgresTls`; `deploy/terraform/modules/postgres`; `check-postgres-tls.sh`

## Context

[0075](0075-redis-auth-and-transit-tls.md) left this gap: managed Postgres encrypted storage and did not set `rds.force_ssl`. `jdbc_url` was `jdbc:postgresql://host:5432/db` with no `sslmode`. Inventory on `main` tip `016f302c9`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `application.yml` / `application-prod.yml` | Passed `SPRING_DATASOURCE_URL` through to Hikari. Prod refused H2 | No `sslmode`. The pgjdbc default can prefer SSL and fall back to cleartext |
| `ReadReplicaDataSourceConfiguration` | Built the replica pool from the replica URL as set | No TLS check. Replica routing itself is unchanged ([0059](0059-hikari-pool-and-read-replica.md)) |
| `deploy/k8s/postgres.yaml`, `configmap.yaml`, compose | Postgres 16 with a cleartext JDBC URL | Correct for local. Not an RDS instance with `rds.force_ssl` |
| `deploy/terraform/modules/postgres` | Private RDS, storage encrypted, AWS-managed master password | No parameter group. `jdbc_url` had no `sslmode` |

`sslmode=require` encrypts and does not check the server certificate. `sslmode=verify-full` checks the CA and the hostname. This repo does not ship an Amazon RDS CA bundle. A path the operator mounts is the only way `verify-full` is available.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, or Redis AUTH beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Managed JDBC URLs require TLS. The RDS parameter group sets `rds.force_ssl=1`. Local and in-cluster Postgres stay cleartext. Prod fails closed when the pair is half-configured.**

1. **One URL.** There is still one primary JDBC URL and one optional replica URL. `PostgresJdbcSsl.managedUrl` is the shape Terraform writes: `sslmode=require`, or `sslmode=verify-full&sslrootcert=<path>` when a CA path is set. The app does not rewrite an operator URL at startup.
2. **Settings.** `POSTGRES_SSL_REQUIRED` (default false) and `POSTGRES_SSL_ROOT_CERT` (default empty). Blank means the same cleartext URL as before.
3. **Fail closed.** On `prod`, cleartext and managed TLS are all-or-nothing. Leave the flag and the CA path unset, and omit `sslmode` (or set `sslmode=disable`), for in-cluster Postgres. For RDS, set `POSTGRES_SSL_REQUIRED=true` and `sslmode=require` with no `sslrootcert`. If a CA path is set, both URLs must use `sslmode=verify-full` and the same `sslrootcert`, and the file must be a readable PEM (`BEGIN CERTIFICATE`). `prefer`, `allow`, `verify-ca`, a duplicate `sslmode`, and the legacy `ssl` property are refused. The replica, when set, must use the same mode. The CA path is not logged. A URL or a `..` path is refused. The guard cannot tell an RDS host from an in-cluster host; forgetting both the flag and `sslmode` still looks like in-cluster cleartext, and `rds.force_ssl=1` then rejects that client at the server.
4. **Terraform.** Every provisioned instance gets `aws_db_parameter_group` with `rds.force_ssl=1` (`apply_method = immediate`) and uses that group. `jdbc_url` includes `?sslmode=require`. `postgres_ssl_root_cert` defaults empty and is not a secret. A non-empty absolute path (no `..`, space, or query) switches the URL to `sslmode=verify-full`. A bad path fails the plan. The path is not a Terraform output by itself; it appears only inside `jdbc_url` when set. Do not commit a bundle. This is not `write_house_secret_values`.
5. **Wiring.** When using the managed output, set `POSTGRES_SSL_REQUIRED=true`. If the output is `verify-full`, mount that PEM and set `POSTGRES_SSL_ROOT_CERT` to the same path. In-cluster `postgres.yaml`, the in-cluster ConfigMap, and compose do not gain TLS.
6. **Verify without a cloud bill.** `check-postgres-tls.sh` and `PostgresJdbcSslTest` lock the URL and the HCL markers. `terraform test` in `deploy/terraform/postgres_tls.tftest.hcl` plans with a mock provider: a provisioned instance forces SSL and emits `sslmode=require`; a fixture CA path emits `verify-full`; a query or a `..` path is refused. CI does not `apply`.

## Consequences

- Compose, `mvn` against `localhost:5432`, and the in-cluster Postgres Deployment keep booting with no TLS.
- A keeper who sets `POSTGRES_SSL_REQUIRED` and forgets `sslmode` does not start a process that would talk to Postgres in the clear while claiming TLS.
- A keeper who applies the RDS module gets `rds.force_ssl=1` in the same plan. The first attach of that parameter group to an existing instance can reboot it. `rds.force_ssl` itself is dynamic.
- `sslmode=require` does not authenticate the server. A network path that can present any certificate still can, until the operator mounts the RDS CA and uses `verify-full`. This repo does not vendor that bundle. A wrong PEM fails the handshake closed. There is no switch to disable verify once `verify-full` is selected.
- Staging does not run `ProductionProfileGuard`. A staging URL without `sslmode` against this RDS fails when the pool connects.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** API listener TLS landed as [0077](0077-api-listener-tls.md). Not started in this ADR.
