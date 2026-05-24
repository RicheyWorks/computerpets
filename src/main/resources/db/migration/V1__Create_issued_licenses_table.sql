CREATE TABLE issued_licenses (
    jti VARCHAR(36) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    pet VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    issued_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP
);

CREATE INDEX idx_issued_licenses_owner ON issued_licenses(owner);
CREATE INDEX idx_issued_licenses_revoked ON issued_licenses(revoked_at);