"""Unlock and a bound download name the backend host before the license hash leaves.

The sentence matches ``clientNetLine`` in ``desktop/renderer/weather-areas.js``.
A loopback backend stays on this computer. The path, the query, the fragment,
and any userinfo stay off the line.
"""

from __future__ import annotations

from urllib.parse import urlparse

LICENSE_HOST_NAME = "the license host"
LOCAL_STAYS = "this unlock stays on this computer. the license hash does not leave."
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


def license_may_send(backend_url: object, shown: object) -> bool:
    target = license_target(backend_url)
    if not target or target["local"]:
        return True
    line = license_honesty(backend_url)
    net = client_net_line(str(target["label"]))
    if not line or not net or not isinstance(shown, str):
        return False
    return line in shown and net in shown
