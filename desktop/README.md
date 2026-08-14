# Desktop companion — Windows and Mac

All twenty pets live on the real desktop. Transparent overlay, always on top, click-through except on the animal. Tray / menu-bar lists the whole house.

## Run

```bash
cd desktop
npm install
npm start
```

Windows: `..\desktop.ps1` from the repo root.  
Mac / Linux: `sh ../desktop.sh`

- Drag them
- Click to talk
- Right-click for Feed / Play / Rest / Talk / switch companion
- Tray (Windows) or menu bar (Mac) has the same menu

## Package

```bash
npm run dist:win    # Windows installer + portable exe
npm run dist:mac    # Mac dmg + zip (run on a Mac)
```

Installers land in `desktop/dist`.

Phones and tablets use the web Live companion (`/live`) — Add to Home Screen.
