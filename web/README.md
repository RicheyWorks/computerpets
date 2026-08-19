# Living desk

New keepers start at the root [README](../README.md).

Browser companion for ComputerPets. The full house of **80** living kinds is awake — Rui and the original nineteen, plus ten named snakes, a tide of ten sea creatures, a garden of ten plants, a hive of ten insects, a cellar of ten fungi, and a far den of ten guests that never evolved here. They turn before they cross the blotter, ease to a stop, and keep their own idle habits — a dog scratches, a snake flicks its tongue, a plant leans to the lamp, a bee waggles, a fungus leans or puffs. The tide den at `/sea` teaches the marine guests. The garden den at `/garden` is ten plants on the blotter; plaques teach. The hive den at `/hive` is ten insects on the blotter; plaques teach. The cellar den at `/cellar` is ten fungi on the blotter; plaques teach. The far den at `/far` is ten guests that never evolved here; plaques teach. The nest is a room. The square sits on the paper. Neglect can close a line. The nest still keeps one. The hatch is a room. The draw lands you with the guest. The desk is the same house. You sit on the same wood.

## Run

```bash
cd web
npm install
npm run dev
```

Opens the desk. Guests get Rui immediately. Signed-in keepers can hatch and care through the kennel. The kennel is a room. The cards stay paper. The shelf is a room. The eighty sit by den, not by rarity.

Optional talk voice uses `XAI_API_KEY` (Grok chat + TTS). Without it, Rui still answers from local lines and the browser speech synthesizer.

## Layout

```
web/
├── src/components/desk/   # living pet + study stage
├── src/lib/pets/          # catalog, care, Rui voice
├── public/sprites/        # Rui animation frames
├── public/pets/           # catalog portraits
└── public/habitat.jpg     # study
```

## Backend

Ownership, licenses, and NFT verify stay in the Java service at the repo root (`mvn spring-boot:run`). This folder is the living client.

Operators open `/admin` (not in the house nav) with `ADMIN_API_KEY` as `X-Admin-Key` against that service to look up and revoke licenses.

## Advertising demos

- `/catalog` — a room. The eighty sit by den, not by rarity.
- `/meet` — house landing
- `/snakes` — the snake den
- `/sea` — the tide den
- `/garden` — the garden den
- `/hive` — the hive den
- `/cellar` — the cellar den
- `/far` — the far den
- `/nest` — a room. The square sits on the paper.
- `/demo/{slug}` — a room. The guest is already walking. Every species (rui, miso, pip, thimble, … ember, cup, felt, comb, frill, gleam).
