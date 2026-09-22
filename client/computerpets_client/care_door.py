"""Advertised care paths. Java answers 409. The blotter still feeds locally.

Overlay ``desktop/renderer/keeper.js`` and desk ``web/src/lib/pets/keeper.ts``
keep the same status and the same three paths. This module does not call them.
"""

from __future__ import annotations

CARE_DOOR_STATUS = 409
ADVERTISED_CARE = {
    "feed": "/pet/feed",
    "play": "/pet/play",
    "rest": "/pet/rest",
}


def care_door_refusal(verb: str) -> dict:
    path = ADVERTISED_CARE[verb]
    return {
        "status": CARE_DOOR_STATUS,
        "title": "Care is local",
        "detail": f"Care is local. {path} is not a door.",
        "door": "local",
        "performed": False,
        "verb": verb,
    }
