"""Care-door contract stays the same on blotter, desk, and overlay."""

from pathlib import Path

from computerpets_client.care_door import ADVERTISED_CARE, CARE_DOOR_STATUS, care_door_refusal

ROOT = Path(__file__).resolve().parents[2]


def test_refusal_is_409_and_does_not_perform_care():
    for verb, path in ADVERTISED_CARE.items():
        body = care_door_refusal(verb)
        assert body["status"] == 409
        assert body["status"] == CARE_DOOR_STATUS
        assert body["performed"] is False
        assert body["door"] == "local"
        assert body["verb"] == verb
        assert body["detail"] == f"Care is local. {path} is not a door."
        assert "hunger" not in body
        assert "bond" not in body


def test_desk_and_overlay_lockstep():
    desk = (ROOT / "web/src/lib/pets/keeper.ts").read_text(encoding="utf-8")
    overlay = (ROOT / "desktop/renderer/keeper.js").read_text(encoding="utf-8")
    assert "CARE_DOOR_STATUS = 409" in desk
    assert "CARE_DOOR_STATUS = 409" in overlay
    for path in ADVERTISED_CARE.values():
        assert path in desk
        assert path in overlay
