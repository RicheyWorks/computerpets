"""Client-contract unlock. Port of desktop/license/ — same wire format."""

from .errors import LicenseError
from .decrypt import AES_KEY_BYTES, GCM_IV_BYTES, GCM_TAG_BYTES, decode_license_key, decrypt_license
from .hwid import MAX_HWID_LENGTH, assert_hwid, resolve_hwid
from .http_client import create_license_client, normalize_backend_url
from .session import DEFAULT_BACKEND, create_license_session, default_backend_url
from .signed_url import (
    download_mac_message,
    parse_signed_download_url,
    sign_download_mac,
    verify_signed_download_url,
)

__all__ = [
    "AES_KEY_BYTES",
    "DEFAULT_BACKEND",
    "GCM_IV_BYTES",
    "GCM_TAG_BYTES",
    "LicenseError",
    "MAX_HWID_LENGTH",
    "assert_hwid",
    "create_license_client",
    "create_license_session",
    "decode_license_key",
    "decrypt_license",
    "default_backend_url",
    "download_mac_message",
    "normalize_backend_url",
    "parse_signed_download_url",
    "resolve_hwid",
    "sign_download_mac",
    "verify_signed_download_url",
]
