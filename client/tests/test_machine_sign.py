from computerpets_client.license.errors import LicenseError
from computerpets_client.license.machine_sign import (
    NONCE_HEADER,
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
        nonce="0123456789abcdef",
        body=b'{"petType":"red_panda"}',
    )
    assert signed["signature"] == "8na55WUBS507nkCWT83Goq-Cec4o1FpXeweNUm26UqU"
    assert signed["nonce"] == "0123456789abcdef"
    assert signed[TIMESTAMP_HEADER] == "1700000000"
    assert signed[NONCE_HEADER] == "0123456789abcdef"
    assert signed[SIGNATURE_HEADER] == signed["signature"]


def test_fails_closed_without_license_key():
    try:
        sign_machine_request(key="", path="/api/verify/steam", body=b"")
    except LicenseError as err:
        assert err.code == "missing_secret"
    else:
        raise AssertionError("expected missing_secret")
