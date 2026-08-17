# Living desk

Browser companion for ComputerPets. The full house of **40** species is awake — Rui and the original nineteen, plus ten named snakes and a tide of ten sea creatures. They turn before they cross the blotter, ease to a stop, and keep their own idle habits — a dog scratches, a snake flicks its tongue. The tide den at `/sea` teaches the marine guests.

## Run

```bash
cd web
npm install
npm run dev
```

Opens the desk. Guests get Rui immediately. Signed-in keepers can hatch and care through the kennel.

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

- `/meet` — house landing
- `/snakes` — the snake den
- `/sea` — the tide den
- `/demo/{slug}` — live shareable demo for every species (rui, miso, pip, thimble, … ember, cup)
