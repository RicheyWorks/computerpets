"""Daily weather matches the house clock in web/src/lib/pets/weather.ts."""

from datetime import datetime, timezone

from computerpets_client.weather import (
    civil_day_number,
    weather_idle,
    weather_label,
    weather_line,
    weather_of,
)


def test_civil_day_matches_house_utc_formula():
    # Date.UTC(2026, 7, 17) / 86400000 === 20682
    assert civil_day_number(datetime(2026, 8, 17)) == 20682
    assert civil_day_number(datetime(2026, 8, 17, 23, 59, tzinfo=timezone.utc)) == 20682


def test_weather_day_is_stable_and_uses_house_skies():
    morning = weather_of(datetime(2026, 8, 17, 8, 0))
    night = weather_of(datetime(2026, 8, 17, 22, 0))
    assert morning == night == "wind"
    assert weather_of(datetime(2024, 6, 9)) == "heat"
    assert weather_of(datetime(2026, 1, 1)) == "wind"
    assert weather_label("wind") == "Wind"
    assert set(weather_label(w) for w in ("clear", "rain", "wind", "heat")) == {
        "Clear",
        "Rain",
        "Wind",
        "Heat",
    }


def test_pets_sit_or_swim_in_the_same_weather():
    assert weather_idle("goldfish", "rain") == "wander"
    assert weather_idle("axolotl", "rain") == "wander"
    assert weather_idle("penguin", "rain") == "wander"
    assert weather_idle("mallard", "rain") == "wander"
    assert weather_idle("canada_goose", "rain") == "wander"
    assert weather_idle("red_panda", "rain") == "sit"
    assert weather_idle("turtle", "rain") == "sit"
    assert weather_idle("ball_python", "heat") == "sit"
    assert weather_idle("milk_snake", "heat") == "sit"
    assert weather_idle("cat", "heat") == "sit"
    assert weather_idle("phoenix", "wind") == "wander"
    assert weather_idle("crow", "wind") == "wander"
    assert weather_idle("pileated", "wind") == "wander"
    assert weather_idle("robin", "wind") == "wander"
    assert weather_idle("red_panda", "wind") is None
    assert weather_idle("barn_owl", "wind") is None
    assert weather_idle("red_panda", "clear") is None


def test_weather_lines_are_the_house_copy():
    assert weather_line("goldfish", "rain") == "Proper weather. At last."
    assert weather_line("mallard", "rain") == "Proper weather. At last."
    assert weather_line("canada_goose", "rain") == "Proper weather. At last."
    assert weather_line("red_panda", "rain") == "The blotter is honest about rain."
    assert weather_line("budgie", "wind") == "The air has opinions."
    assert weather_line("pileated", "wind") == "The air has opinions."
    assert weather_line("robin", "wind") == "The air has opinions."
    assert weather_line("red_panda", "wind") == "Something moved that was not me."
    assert weather_line("ball_python", "heat") == "Heat. I was waiting for this clause."
    assert weather_line("red_panda", "clear") is None
