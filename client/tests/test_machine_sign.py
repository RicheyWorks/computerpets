from computerpets_client.license.errors import LicenseError
from computerpets_client.license.machine_sign import (
    SIGNATURE_HEADER,
    TIMESTAMP_HEADER,
    sign_machine_request,
)


def test_matches_house_vector():
    signed = sign_machine_request(
        key="test-license-secret",
        method="POST",
        path="/api/verify/steam",
        query="",
        timestamp="1700000000",
        body=b'{"petType":"red_panda"}',
    )
    assert signed["signature"] == "aQnHDFNgA6mc5FUEYEc3XsqmUFRtefDA_KfiCluM47E"
    assert signed[TIMESTAMP_HEADER] == "1700000000"
    assert signed[SIGNATURE_HEADER] == signed["signature"]


def test_fails_closed_without_license_key():
    try:
        sign_machine_request(key="", path="/api/verify/steam", body=b"")
    except LicenseError as err:
        assert err.code == "missing_secret"
    else:
        raise AssertionError("expected missing_secret")
