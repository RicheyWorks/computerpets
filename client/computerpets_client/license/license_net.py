"""Unlock and a bound download say the license website's name before the code made from
this computer's ID is sent there.

An unbound download says that name before it asks; it sends no such code.
Downloading your pet's files says the download website's name before it asks for them.
Each line names the website in plain words, with the address sentence of
``plainNetLine`` in ``desktop/renderer/weather-areas.js``.
A loopback host stays on this computer. The path, the query, the fragment,
and any userinfo stay off the line.
"""

from __future__ import annotations

from typing import Any, Callable
from urllib.parse import urlparse

from .errors import LicenseError

LICENSE_HOST_NAME = "the license website"
LOCAL_STAYS = "Unlocking stays on this computer. The code made from this computer's ID does not leave."
DOWNLOAD_LOCAL = "This download stays on this computer. It talks to this computer. It does not send the code made from this computer's ID."
BUNDLE_HOST_NAME = "the download website"
BUNDLE_IDLE = "Your pet's files are not downloaded until this line names the website."
BUNDLE_LOCAL = "This download stays on this computer. Your pet's files come from this computer."
_LOOPBACK = frozenset({"127.0.0.1", "localhost", "::1"})


def client_net_line(host: str = "") -> str:
    """The older sentence (weather-areas ``clientNetLine``). License lines now use ``plain_net_line``."""
    where = f" to {host}" if host else ""
    return f"this computer's network address goes with the https request{where}, as any client."


PLAIN_NET_HEAD = "This computer's internet address also goes to "
PLAIN_NET_TAIL = ", like visiting any website."


def plain_net_line(names: str = "") -> str:
    """Same kid-plain sentence as weather-areas ``plainNetLine``. An empty name is no sentence."""
    return f"{PLAIN_NET_HEAD}{names}{PLAIN_NET_TAIL}" if names else ""


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
    net = plain_net_line(str(target["label"]))
    if not net:
        return ""
    return f"This asks {target['label']}, the license website, to check your license. It sends what you typed for your license and a scrambled code made from this computer's ID. The ID itself stays here. {net} A download tied to this computer sends that same code."


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
    net = plain_net_line(str(target["label"]))
    if not net:
        return ""
    return f"This gets your pet's files from {target['label']}, the download website, with the link the license website gave. {net} It does not send the code made from this computer's ID."


def bundle_may_fetch(download_url: object, shown: object) -> bool:
    target = bundle_target(download_url)
    if not target or target["local"]:
        return True
    line = bundle_honesty(download_url)
    net = plain_net_line(str(target["label"]))
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
            f"Nothing was sent to {host}. This page has to name the license website first.",
        )
    return request()


def download_talk_honesty(backend_url: object) -> str:
    target = license_target(backend_url)
    if not target or target["local"]:
        return ""
    net = plain_net_line(str(target["label"]))
    if not net:
        return ""
    return f"This asks {target['label']}, the license website, for your pet. It sends your saved license and the pass from unlocking. {net} It does not send the code made from this computer's ID."


def download_may_post(backend_url: object, shown: object) -> bool:
    target = license_target(backend_url)
    if not target or target["local"]:
        return True
    line = download_talk_honesty(backend_url)
    net = plain_net_line(str(target["label"]))
    if not line or not net or not isinstance(shown, str):
        return False
    return line in shown and net in shown


def license_may_send(backend_url: object, shown: object) -> bool:
    target = license_target(backend_url)
    if not target or target["local"]:
        return True
    line = license_honesty(backend_url)
    net = plain_net_line(str(target["label"]))
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
            f"Nothing was sent to {host}. This page has to name the license website first.",
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
                f"Your pet's files were not downloaded from {host}. This page has to name the download website first.",
            )
        return {"ok": False, "status": 0, "bytes": 0, "held": True}
    return request()
