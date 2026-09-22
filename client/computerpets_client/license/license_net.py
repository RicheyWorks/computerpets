"""Unlock and a bound download name the backend host before the license hash leaves.

A signed bundle GET names the CDN host before that request leaves.
The sentence matches ``clientNetLine`` in ``desktop/renderer/weather-areas.js``.
A loopback host stays on this computer. The path, the query, the fragment,
and any userinfo stay off the line.
"""

from __future__ import annotations

from urllib.parse import urlparse

LICENSE_HOST_NAME = "the license host"
LOCAL_STAYS = "this unlock stays on this computer. the license hash does not leave."
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


def license_may_send(backend_url: object, shown: object) -> bool:
    target = license_target(backend_url)
    if not target or target["local"]:
        return True
    line = license_honesty(backend_url)
    net = client_net_line(str(target["label"]))
    if not line or not net or not isinstance(shown, str):
        return False
    return line in shown and net in shown
