# Living desk

Browser companion for ComputerPets. **Rui**, the red panda, is the first species awake: he walks the study, eats, pounces, sleeps, and talks.

The other nineteen catalog pets still use still portraits until they are brought to life the same way.

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

## Advertising demos

- `/meet` — house landing
- `/demo/{slug}` — live shareable demo for every species (rui, miso, pip, thimble, … ember)
