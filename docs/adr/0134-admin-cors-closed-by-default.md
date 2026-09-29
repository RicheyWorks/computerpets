# 0134. The admin CORS allow-list is closed by default, and prod refuses `*`

- **Status:** Accepted
- **Date:** 2026-09-28
- **Code:** `src/main/java/com/enterprisepet/config/SecurityConfig.java`, `src/main/java/com/enterprisepet/config/ProductionProfileGuard.java`, `src/main/resources/application.yml`, `src/main/resources/application-dev.yml`, `docker-compose.yml`, `src/test/java/com/enterprisepet/config/AdminCorsOriginsTest.java`, `src/test/java/com/enterprisepet/config/ProductionProfileGuardTest.java`, `web/scripts/plain-reasons.test.mjs`, `deploy/k8s/README.md`, `docs/SETUP.md`

## Context

`admin.allowed-origins` (`ADMIN_ALLOWED_ORIGINS`) lists the web sites whose `/admin` page may call `/api/admin/**` from a browser. It arrived with the plain-reasons pass and defaulted to `*`, the behavior before it existed. Every admin call is HMAC-signed with `ADMIN_API_KEY` ([0071](0071-admin-request-signature.md)), so `*` did not open the ledger. It did let any page on the internet send signed-looking requests from a keeper's browser. A deploy that forgot the setting stayed open, and nothing said so.

The only browser caller is the web `/admin` page (`web/src/lib/admin/api.ts`). Locally it runs on `http://localhost:8080` (`npm run dev`) and calls the Java service on `http://localhost:8081`, which is another origin. Deployed, it either sits behind the same site as the service (same origin, so CORS does not apply) or names the service through `VITE_LICENSE_API_URL`. The desktop app and the blotter do not use CORS.

## Decision

1. The default is empty: no other web site may call `/api/admin/**` from a browser. A page served from the service's own origin still works, because CORS only applies across origins.
2. The `dev` profile (and compose, which runs `dev`) allows loopback pages on any port: `http://localhost:[*]`, `http://127.0.0.1:[*]`, and in `dev` also `http://[::1]:[*]`. The local web `/admin` flow keeps working with no setting. `ADMIN_ALLOWED_ORIGINS` still overrides it.
3. On `prod`, `ProductionProfileGuard` refuses to start when an entry is `*` or has only a wildcard for its host (`https://*`, `http://*:[*]`). A named site, a subdomain pattern like `https://*.example.com`, or unset (same origin only) passes. The guard's start line now says `admin origins=same-origin|listed`.
4. Heartbeat (`/api/public/**`) and the care door (`/pet/feed`, `/pet/play`, `/pet/rest`) stay open to any origin. They are not admin calls.

## Consequences

- An operator whose web site is on another origin sets `ADMIN_ALLOWED_ORIGINS=https://<your web site>` (ConfigMap, `deploy/k8s/README.md`). Until then the browser refuses the preflight and the `/admin` page says it could not reach the service. The ledger is never open either way.
- `staging` has no default of its own, so it is closed like the base config. It does not run the prod guard, so `*` is still possible there on purpose.
- No live infrastructure changed. The k8s and managed configmaps keep the setting commented out with a placeholder.
