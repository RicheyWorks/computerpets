# Desktop companion — Windows and Mac

All twenty pets live on the real desktop as a Tamagotchi-grade overlay. Unique hunger clocks, night cycles, mess, illness, age, and a special move each.

## Care

Right-click the pet or use the tray / menu bar:

- Feed, treat (species snack), play (chase a ribbon), rest, talk
- Hide — they walk off the screen. Call back — they walk in.
- Clean (click droppings on the floor too)
- Bath, medicine, praise
- Call back if they hide
- Special — species trick (ribbon, thump, wheek, steal, rebirth…)

They grow: hatchling → grown (day 1) → elder (day 7). Neglect them and they vanish until you call. Phoenix can burn out and come back kinder.

## Run

```bash
cd desktop
npm install
npm start
```

Windows: `..\desktop.ps1`  
Mac: `sh ../desktop.sh`

Windows toasts use the tray identity `works.richey.computerpets.desk`. The overlay tracks the work area across DPI and monitor changes.

## Package

```bash
npm run dist:win
npm run dist:mac
```
