# Local Docker secret files for docker-compose.secrets.yml
#
# Generate (do not invent production values in docs or tickets):
#
#   mkdir -p secrets
#   openssl rand -base64 32 > secrets/license_secret_key
#   openssl rand -base64 48 > secrets/jwt_secret_key
#   openssl rand -base64 48 > secrets/bundle_signing_key
#   openssl rand -base64 32 > secrets/admin_api_key
#
# Then:
#   docker compose -f docker-compose.yml -f docker-compose.secrets.yml up --build
#
# Files in this directory are gitignored except this README.
# Prefer env / .env for everyday local mvn runs (see .env.example).
