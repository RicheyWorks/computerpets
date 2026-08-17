from computerpets_client.license.errors import LicenseError
from computerpets_client.license.signed_url import download_mac_message, sign_download_mac, verify_signed_download_url

KEY = "test-bundle-signing-key-not-a-placeholder"


def test_mac_includes_jti_when_present():
    assert (
        download_mac_message({"petKey": "red_panda", "owner": "76561198000000000", "jti": "jti-1", "exp": 1755411300})
        == "red_panda|76561198000000000|jti-1|1755411300"
    )


def test_mac_omits_jti_when_absent():
    assert download_mac_message({"petKey": "cat", "owner": "owner1", "exp": 1}) == "cat|owner1|1"


def test_sign_is_url_safe_base64_no_padding():
    sig = sign_download_mac("red_panda|owner|jti-1|100", KEY)
    assert "=" not in sig
    assert all(ch.isalnum() or ch in "-_" for ch in sig)


def test_accepts_url_with_jti_and_matching_mac():
    exp = 1755411300
    message = download_mac_message(
        {
            "petKey": "red_panda",
            "owner": "steam:owner",
            "jti": "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
            "exp": exp,
        }
    )
    sig = sign_download_mac(message, KEY)
    url = (
        "https://cdn.enterprisepet.example/bundles/red_panda.zip"
        "?owner=steam%3Aowner&jti=3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80"
        f"&exp={exp}&sig={sig}"
    )
    parsed = verify_signed_download_url(
        url,
        {
            "signingKey": KEY,
            "jti": "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
            "petKey": "red_panda",
            "owner": "steam:owner",
        },
    )
    assert parsed["jti"] == "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80"


def test_fails_closed_when_jti_missing():
    try:
        verify_signed_download_url(
            "https://cdn.enterprisepet.example/bundles/red_panda.zip?owner=o&exp=1&sig=x",
            {"jti": "need-me"},
        )
        raise AssertionError("expected LicenseError")
    except LicenseError as err:
        assert err.code == "signed_url_invalid"


def test_fails_closed_on_bad_mac():
    url = "https://cdn.enterprisepet.example/bundles/red_panda.zip?owner=o&jti=j&exp=1&sig=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    try:
        verify_signed_download_url(url, {"signingKey": KEY, "jti": "j"})
        raise AssertionError("expected LicenseError")
    except LicenseError as err:
        assert err.code == "signed_url_invalid"
