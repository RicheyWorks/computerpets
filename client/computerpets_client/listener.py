"""Who is listening on the mind bus. Names only. Never a key, a URL, or a model.

The blotter has no plugin bus, so it is House lines.
Overlay cloud plugins listen only when ``has_key`` is strictly true.
Desk guests are House lines. A signed-in desk names a cloud plugin only when
``house_keys[id]`` is strictly true, or a local plugin whose URL is safe.
"""

from __future__ import annotations

from urllib.parse import urlparse

PRESETS: tuple[dict, ...] = (
    {"id": "local", "name": "House lines", "kind": "local", "needs_key": False, "base": ""},
    {"id": "xai", "name": "xAI Grok", "kind": "openai", "needs_key": True, "base": "https://api.x.ai/v1"},
    {"id": "openai", "name": "OpenAI", "kind": "openai", "needs_key": True, "base": "https://api.openai.com/v1"},
    {"id": "anthropic", "name": "Anthropic", "kind": "anthropic", "needs_key": True, "base": "https://api.anthropic.com"},
    {"id": "google", "name": "Google Gemini", "kind": "gemini", "needs_key": True, "base": "https://generativelanguage.googleapis.com/v1beta"},
    {"id": "groq", "name": "Groq", "kind": "openai", "needs_key": True, "base": "https://api.groq.com/openai/v1"},
    {"id": "openrouter", "name": "OpenRouter", "kind": "openai", "needs_key": True, "base": "https://openrouter.ai/api/v1"},
    {"id": "together", "name": "Together", "kind": "openai", "needs_key": True, "base": "https://api.together.xyz/v1"},
    {"id": "fireworks", "name": "Fireworks", "kind": "openai", "needs_key": True, "base": "https://api.fireworks.ai/inference/v1"},
    {"id": "deepseek", "name": "DeepSeek", "kind": "openai", "needs_key": True, "base": "https://api.deepseek.com/v1"},
    {"id": "mistral", "name": "Mistral", "kind": "openai", "needs_key": True, "base": "https://api.mistral.ai/v1"},
    {"id": "ollama", "name": "Ollama", "kind": "ollama", "needs_key": False, "base": "http://127.0.0.1:11434"},
    {"id": "lmstudio", "name": "LM Studio", "kind": "openai", "needs_key": False, "base": "http://127.0.0.1:1234/v1"},
    {"id": "custom", "name": "Custom webhook", "kind": "custom", "needs_key": False, "base": "http://127.0.0.1:8787/mind"},
)

_BY_ID = {row["id"]: row for row in PRESETS}
LOCAL_HOSTS = {"127.0.0.1", "localhost", "::1"}
HOUSE = {"id": "local", "name": "House lines", "line": "Listening · House lines"}
UNREAD = {"id": "unread", "name": "not sure", "line": "Listening · not sure"}


def _private_ipv4(host: str) -> bool:
    parts = host.split(".")
    if len(parts) != 4:
        return False
    try:
        nums = [int(p) for p in parts]
    except ValueError:
        return False
    if any(n < 0 or n > 255 for n in nums):
        return False
    a, b = nums[0], nums[1]
    if a in {10, 0, 127}:
        return True
    if a == 169 and b == 254:
        return True
    if a == 192 and b == 168:
        return True
    if a == 172 and 16 <= b <= 31:
        return True
    return False


def _private_host(host: str) -> bool:
    h = str(host or "").lower().strip("[]")
    if h in LOCAL_HOSTS:
        return True
    if h.endswith(".local") or h.endswith(".internal"):
        return True
    if "metadata" in h:
        return True
    if h.startswith("fc") or h.startswith("fd") or h.startswith("fe80"):
        return True
    return _private_ipv4(h)


def _allow_local(preset_id: str) -> bool:
    return preset_id in {"ollama", "lmstudio", "custom"}


def url_ok(raw: str, preset_id: str) -> bool:
    text = str(raw or "").strip()
    if not text or any(ch.isspace() for ch in text):
        return False
    try:
        url = urlparse(text)
    except ValueError:
        return False
    if url.username or url.password:
        return False
    if url.scheme not in {"http", "https"}:
        return False
    host = (url.hostname or "").lower().strip("[]")
    if not host:
        return False
    if host in LOCAL_HOSTS:
        return _allow_local(preset_id)
    if url.scheme != "https":
        return False
    if _private_host(host):
        return False
    return True


def _named(preset: dict) -> dict:
    return {"id": preset["id"], "name": preset["name"], "line": f"Listening · {preset['name']}"}


def _house() -> dict:
    return dict(HOUSE)


def name_listener(facts: dict | None = None) -> dict:
    src = facts if isinstance(facts, dict) else {}
    door = src.get("door") if src.get("door") in {"desk", "blotter"} else "overlay"
    if door == "blotter":
        return _house()
    signed_in = src.get("signed_in") is True or src.get("signedIn") is True
    if door == "desk" and not signed_in:
        return _house()
    house_keys = src.get("house_keys") if isinstance(src.get("house_keys"), dict) else src.get("houseKeys")
    if not isinstance(house_keys, dict):
        house_keys = {}
    plugin = src.get("plugin")
    plugin = plugin.strip() if isinstance(plugin, str) else ""
    if door == "desk" and signed_in and not plugin:
        return _named(_BY_ID["xai"]) if house_keys.get("xai") is True else _house()
    preset = _BY_ID.get(plugin)
    if not preset or preset["kind"] == "local":
        return _house()
    base_raw = src.get("base_url") if isinstance(src.get("base_url"), str) else src.get("baseUrl")
    base = base_raw.strip() if isinstance(base_raw, str) and base_raw.strip() else preset["base"]
    if not url_ok(base, preset["id"]):
        return _house()
    if preset["needs_key"]:
        if door == "desk":
            return _named(preset) if house_keys.get(preset["id"]) is True else _house()
        has_key = src.get("has_key") is True or src.get("hasKey") is True
        return _named(preset) if has_key else _house()
    return _named(preset)


def listener_line(facts: dict | None = None) -> str:
    return name_listener(facts)["line"]


def present_listener(raw) -> dict:
    if not isinstance(raw, dict):
        return dict(UNREAD)
    extra = [k for k in raw.keys() if k not in {"id", "name", "line"}]
    if extra:
        return dict(UNREAD)
    if raw.get("id") == UNREAD["id"] and raw.get("name") == UNREAD["name"] and raw.get("line") == UNREAD["line"]:
        return dict(UNREAD)
    preset = _BY_ID.get(raw.get("id")) if isinstance(raw.get("id"), str) else None
    if not preset or raw.get("name") != preset["name"]:
        return dict(UNREAD)
    line = f"Listening · {preset['name']}"
    if raw.get("line") != line:
        return dict(UNREAD)
    return {"id": preset["id"], "name": preset["name"], "line": line}
