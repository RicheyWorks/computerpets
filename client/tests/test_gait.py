from computerpets_client.gait import (
    TURN_S,
    TURN_SNAKE_S,
    facing_after,
    overshoot_px,
    turn_hold_s,
    walk_speed,
)


def test_walk_speed_ease_out_is_not_linear():
    base = 100.0
    near = walk_speed(24, 1, base)
    linear_near = (24 / 56) * base
    assert walk_speed(56, 1, base) == base
    assert near > 30
    assert near < linear_near - 1


def test_reverse_target_does_not_flip_facing_on_frame_zero():
    assert facing_after(1, 100, 20, 0, TURN_S) == 1
    assert facing_after(1, 100, 20, TURN_S / 2, TURN_S) == 1
    assert facing_after(1, 100, 20, TURN_S, TURN_S) == -1


def test_snakes_and_turtles_turn_longer():
    assert turn_hold_s(crawl=True, walk=36) == TURN_SNAKE_S
    assert turn_hold_s(crawl=False, walk=26, hop=3) > TURN_S
    assert overshoot_px(crawl=True, walk=36) == 4
    assert overshoot_px(crawl=False, walk=122, hop=30) == 7
