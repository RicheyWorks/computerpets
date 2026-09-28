/**
 * The plain words on every Minds screen: the web desk `/mind`, the overlay Settings window, and the
 * Python blotter. The same sentences sit in desktop/renderer/settings.html and
 * client/computerpets_client/minds.py, and a test holds all three together.
 */
export const MIND_WORDS = {
  intro: "Pets talk without an AI. Adding one is optional.",
  house: "House lines need nothing else. Your pets answer with their own words.",
  address: "AI website address",
  addressHelp: "Where that AI answers. Picking an AI fills this in, so most people leave it alone.",
  key: "Your key for that AI website",
  keyHelp: "A secret code from that AI website's own page. Keep it secret, like a password.",
} as const;
