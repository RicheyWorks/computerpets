# Desktop companion

Rui lives on the Windows desktop — not in a browser tab. Transparent overlay, always on top, click-through except on the panda. He walks the taskbar, talks, eats, and sleeps.

## Run (Windows)

```powershell
cd C:\Users\730ri\projects\ComputerPets
git pull
cd desktop
npm install
npm start
```

Close the browser tab if you still have `web` running. This window has no chrome. Look at the bottom of your screen.

- Drag Rui
- Click him to talk
- Right-click for Feed / Play / Rest / Talk / Quit
- Tray icon (hidden in the overflow) also has the menu

Quit from the tray or the right-click menu. Hiding him keeps the tray.

## Package an installer (optional)

```powershell
cd desktop
npm run dist
```

The installer lands in `desktop\dist`.
