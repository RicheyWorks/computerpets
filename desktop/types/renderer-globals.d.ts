// Types for the globals the overlay's script tags share on `window` (desktop/renderer/index.html).
// Each Pet* module is a small UMD file that sets `window.PetX = api` and `module.exports = api`, so its
// type is simply that module's own exports. Only read by tsc checkJs (desktop/tsconfig.checkjs.json);
// nothing here ships or runs.

interface Window {
  PetArrive: typeof import("../renderer/arrive.js");
  PetBirdFly: typeof import("../renderer/bird-fly.js");
  PetCallGuests: typeof import("../renderer/call-guests.js");
  PetCard: typeof import("../renderer/card.js");
  PetChoice: typeof import("../renderer/choice.js");
  PetDesk: typeof import("../renderer/desk.js");
  PetDeskHouse: typeof import("../renderer/desk-house.js");
  PetDeskPlants: typeof import("../renderer/desk-plants.js");
  PetDeskPlates: typeof import("../renderer/desk-plates.js");
  PetEthogram: typeof import("../renderer/ethogram.js");
  PetFrameGuard: typeof import("../renderer/frame-guard.js");
  PetGait: typeof import("../renderer/gait.js");
  PetGpu: typeof import("../renderer/gpu.js");
  PetGroundTricks: typeof import("../renderer/ground-tricks.js");
  PetHive: typeof import("../renderer/hive.js");
  PetHouseMusic: typeof import("../renderer/house-music.js");
  PetHouseSleep: typeof import("../renderer/house-sleep.js");
  PetHouseSounds: typeof import("../renderer/house-sounds.js");
  PetKeeper: typeof import("../renderer/keeper.js");
  PetLife: typeof import("../renderer/life.js");
  PetListener: typeof import("../renderer/listener.js");
  PetMarket: typeof import("../renderer/market.js");
  PetNews: typeof import("../renderer/news.js");
  PetPlay: typeof import("../renderer/play.js");
  PetPresence: typeof import("../renderer/presence.js");
  PetRibbon: typeof import("../renderer/ribbon.js");
  PetRobinFly: typeof import("../renderer/robin-fly.js");
  PetRoster: typeof import("../renderer/roster-load.js");
  PetRuiTricks: typeof import("../renderer/rui-tricks.js");
  PetSpecial: typeof import("../renderer/specials.js");
  /** sprite-surface.d.ts (shared with web) types the painting half; attach and the fit helpers are overlay-only. */
  PetSpriteSurface: import("../renderer/sprite-surface.js").SpriteSurfaceModule & {
    attach: (...args: any[]) => any;
    fitContainBottom: (...args: any[]) => any;
    backingOf: (...args: any[]) => any;
  };
  PetVisitor: typeof import("../renderer/visitor.js");
  PetWeather: typeof import("../renderer/weather.js");
  PetWeatherAreas: typeof import("../renderer/weather-areas.js");
  PetWindowPlay: typeof import("../renderer/window-play.js");
  /** mind.js sets this without module.exports; typed loosely until mind.js gets JSDoc. */
  PetMind: any;
  /** traits.js: per-pet movement traits, keyed by pet key. */
  PET_TRAITS: Record<string, any>;
  /** pet.js hooks for desktop/gui-harness.cjs; only set when the GUI harness runs. */
  PetGuiHarness: any;
  /** The bridge preload.cjs exposes with contextBridge.exposeInMainWorld("desk", ...). */
  desk: any;
  /** Older Safari name for AudioContext. */
  webkitAudioContext?: typeof AudioContext;
}
