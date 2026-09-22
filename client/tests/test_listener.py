"""Honest mind-bus listener names. No keys, no invented cloud minds."""

import json

from computerpets_client.listener import (
    HOUSE,
    PRESETS,
    listener_line,
    name_listener,
    present_listener,
    url_ok,
)

SECRET = "sk-live-DO-NOT-PAINT"


def test_overlay_names_a_cloud_mind_only_with_a_real_key_flag():
    heard = name_listener({"door": "overlay", "plugin": "xai", "has_key": True, "api_key": SECRET})
    assert heard["line"] == "Listening · xAI Grok"
    assert SECRET not in json.dumps(heard)
    assert name_listener({"door": "overlay", "plugin": "xai"})["id"] == "local"
    painted = name_listener({"door": "overlay", "plugin": "openai", "has_key": SECRET})
    assert painted["id"] == "local"
    assert SECRET not in painted["line"]


def test_guests_blotter_and_unknown_plugins_are_house_lines():
    guest = name_listener(
        {"door": "desk", "plugin": "xai", "signed_in": False, "house_keys": {"xai": True}, "api_key": SECRET}
    )
    assert guest == HOUSE or guest["line"] == HOUSE["line"]
    assert SECRET not in json.dumps(guest)
    blotter = name_listener({"door": "blotter", "plugin": "xai", "has_key": True, "house_keys": {"xai": True}})
    assert blotter["line"] == "Listening · House lines"
    assert listener_line({"door": "blotter"}) == "Listening · House lines"
    unknown = name_listener({"door": "overlay", "plugin": SECRET, "has_key": True})
    assert unknown["id"] == "local"
    assert SECRET not in unknown["line"]


def test_signed_in_desk_uses_house_flags_not_a_client_key():
    yes = name_listener({"door": "desk", "plugin": "mistral", "signed_in": True, "house_keys": {"mistral": True}})
    assert yes["line"] == "Listening · Mistral"
    no = name_listener(
        {"door": "desk", "plugin": "mistral", "signedIn": True, "houseKeys": {"mistral": SECRET}, "hasKey": True}
    )
    assert no["id"] == "local"
    assert SECRET not in no["line"]
    implied = name_listener({"door": "desk", "signed_in": True, "house_keys": {"xai": True}})
    assert implied["id"] == "xai"


def test_local_plugins_need_a_safe_url_and_the_url_stays_off_the_line():
    assert name_listener({"door": "overlay", "plugin": "ollama"})["line"] == "Listening · Ollama"
    custom = name_listener(
        {"door": "overlay", "plugin": "custom", "base_url": f"https://hooks.example/mind?token={SECRET}"}
    )
    assert custom["line"] == "Listening · Custom webhook"
    assert SECRET not in json.dumps(custom)
    meta = name_listener({"door": "overlay", "plugin": "custom", "base_url": "http://169.254.169.254/latest"})
    assert meta["id"] == "local"
    assert "169.254" not in meta["line"]
    assert url_ok("http://user:pass@127.0.0.1:11434", "ollama") is False
    assert url_ok("https://api.x.ai/v1", "xai") is True
    assert len(PRESETS) == 14


def test_present_listener_drops_a_smuggled_key():
    leaked = present_listener({"id": "xai", "name": "xAI Grok", "line": "Listening · xAI Grok", "apiKey": SECRET})
    assert leaked["id"] == "unread"
    assert SECRET not in json.dumps(leaked)
    ok = present_listener(name_listener({"door": "overlay", "plugin": "lmstudio"}))
    assert ok["line"] == "Listening · LM Studio"
