"""Unlock and a bound download name the backend host before the license hash leaves.

An unbound download names that host before the POST leaves. That POST has no hash.
A signed bundle GET names the CDN host before that request leaves.
The sentence matches ``clientNetLine`` in ``desktop/renderer/weather-areas.js``.
A loopback host stays on this computer. The path, the query, the fragment,
and any userinfo stay off the line.
"""

from __future__ import annotations

from typing import Any, Callable
from urllib.parse import urlparse

from .errors import LicenseError

LICENSE_HOST_NAME = "the license host"
LOCAL_STAYS = "this unlock stays on this computer. the license hash does not leave."
DOWNLOAD_LOCAL = "this download stays on this computer. it talks to this computer. the license hash is not on that request."
BUNDLE_HOST_NAME = "the bundle host"
BUNDLE_IDLE = "a signed bundle is not fetched until this line names the host."
BUNDLE_LOCAL = "this download stays on this computer. the signed bundle does not leave."
_LOOPBACK = frozenset({"127.0.0.1", "localhost", "::1"})


def client_net_line(host: str = "") -> str:
    where = f" to {host}" if host else ""
    return f"this computer's network address goes with the https request{where}, as any client."


def license_host_name(raw: object) -> str:
    try:
        host = urlparse(str(raw or "").strip()).hostname or ""
    except ValueError:
        return ""
    return host.strip("[]")


def _loopback(host: str) -> bool:
    return host.lower() in _LOOPBACK


def license_target(backend_url: object) -> dict[str, object] | None:
    host = license_host_name(backend_url)
    if not host:
        return None
    return {"local": _loopback(host), "label": host or LICENSE_HOST_NAME}


def license_honesty(backend_url: object) -> str:
    target = license_target(backend_url)
    if not target or target["local"]:
        return ""
    net = client_net_line(str(target["label"]))
    if not net:
        return ""
    return f"this unlock sends the license hash. {net} a bound download sends that same hash."


def _bundle_url(raw: object):
    text = str(raw or "").strip()
    if not text:
        return None
    try:
        return urlparse(text)
    except ValueError:
        return None


def bundle_host_name(raw: object) -> str:
    parsed = _bundle_url(raw)
    if parsed is None or parsed.scheme == "file":
        return ""
    return (parsed.hostname or "").strip("[]")


def bundle_target(download_url: object) -> dict[str, object] | None:
    text = str(download_url or "").strip()
    if not text:
        return None
    parsed = _bundle_url(text)
    if parsed is None or parsed.scheme == "file":
        return {"local": True, "label": ""}
    host = (parsed.hostname or "").strip("[]")
    if not host or _loopback(host):
        return {"local": True, "label": host}
    return {"local": False, "label": host or BUNDLE_HOST_NAME}


def bundle_honesty(download_url: object) -> str:
    target = bundle_target(download_url)
    if not target or target["local"]:
        return ""
    net = client_net_line(str(target["label"]))
    if not net:
        return ""
    return f"this download gets the signed bundle. {net} the license hash is not on that request."


def bundle_may_fetch(download_url: object, shown: object) -> bool:
    target = bundle_target(download_url)
    if not target or target["local"]:
        return True
    line = bundle_honesty(download_url)
    net = client_net_line(str(target["label"]))
    if not line or not net or not isinstance(shown, str):
        return False
    return line in shown and net in shown


def post_license_hash(shown: object, backend_url: object, request: Callable[[], Any]) -> Any:
    """The only unlock-hash POST, including a bound download that sends that same hash.

    A miss raises and does not call ``request``, so the caller does not read an OS id
    or write ``hwid.txt`` inside that request. A loopback backend still calls ``request``.
    """
    if not license_may_send(backend_url, shown):
        host = license_host_name(backend_url) or LICENSE_HOST_NAME
        raise LicenseError(
            "license_net_unnamed",
            f"the license hash was not sent to {host}. name that host before it leaves.",
        )
    return request()


def download_talk_honesty(backend_url: object) -> str:
    target = license_target(backend_url)
    if not target or target["local"]:
        return ""
    net = client_net_line(str(target["label"]))
    if not net:
        return ""
    return f"this download talks to {target['label']}. {net} the license hash is not on that request."


def download_may_post(backend_url: object, shown: object) -> bool:
    target = license_target(backend_url)
    if not target or target["local"]:
        return True
    line = download_talk_honesty(backend_url)
    net = client_net_line(str(target["label"]))
    if not line or not net or not isinstance(shown, str):
        return False
    return line in shown and net in shown


def license_may_send(backend_url: object, shown: object) -> bool:
    target = license_target(backend_url)
    if not target or target["local"]:
        return True
    line = license_honesty(backend_url)
    net = client_net_line(str(target["label"]))
    if not line or not net or not isinstance(shown, str):
        return False
    return line in shown and net in shown


def post_unbound_download(shown: object, backend_url: object, request: Callable[[], Any]) -> Any:
    """The only unbound download POST. A miss raises and does not call ``request``.

    That POST has no hash and does not read an OS id. A loopback backend still calls ``request``.
    """
    if not download_may_post(backend_url, shown):
        host = license_host_name(backend_url) or LICENSE_HOST_NAME
        raise LicenseError(
            "download_net_unnamed",
            f"this download was not sent to {host}. name that host before it leaves.",
        )
    return request()


def get_signed_bundle(
    shown: object, download_url: object, request: Callable[[], Any], strict: bool = False
) -> Any:
    """The only signed-bundle GET. A miss does not call ``request`` and does not scrub the signed query.

    ``strict`` raises the session gate. Otherwise the miss is a held read.
    A loopback CDN or a file URL still calls ``request``.
    """
    if not bundle_may_fetch(download_url, shown):
        if strict:
            host = bundle_host_name(download_url) or BUNDLE_HOST_NAME
            raise LicenseError(
                "cdn_net_unnamed",
                f"the signed bundle was not fetched from {host}. name that host before it leaves.",
            )
        return {"ok": False, "status": 0, "bytes": 0, "held": True}
    return request()
