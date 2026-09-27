/** A tap on the guest is a choice, not a sit. They pick. Then they do that sit. */
(function (root) {
  const GUEST_CHOICE = [
    "feed",
    "rest",
    "walk",
    "sit",
    "talk",
    "treat",
    "play",
    "special",
    "hide",
    "call",
    "pick",
    "send",
    "close",
    "exit",
  ];

  function guestTap() {
    return "choice";
  }

  function poseFlip(walking) {
    return walking ? { id: "sit", label: "Sit" } : { id: "walk", label: "Walk" };
  }

  function dismissMarks() {
    // Always last: Close dismisses the menu; Exit leaves pet care (unfocus).
    return [
      { id: "close", label: "Close" },
      { id: "exit", label: "Exit" },
    ];
  }

  function guestMarks(sit) {
    sit = sit || {};
    if (sit.role === "called" || sit.role === "visit") {
      return [
        { id: "talk", label: "Talk" },
        { id: "treat", label: sit.treatVerb || "Treat" },
        { id: "play", label: "Play" },
        poseFlip(!!sit.walking),
        { id: "send", label: sit.role === "called" ? "Send home" : "Bye" },
      ].concat(dismissMarks());
    }
    const hidden = !!sit.hidden;
    const leaving = !!sit.leaving;
    const busy = hidden || leaving;
    const marks = [];
    if (!busy) {
      marks.push({ id: "feed", label: "Feed" });
      marks.push({ id: "rest", label: "Rest" });
      marks.push(poseFlip(!!sit.walking));
    }
    marks.push({ id: "talk", label: "Talk" });
    if (!busy) {
      marks.push({ id: "treat", label: sit.treatVerb || "Treat" });
      marks.push({ id: "play", label: "Play" });
    }
    marks.push({ id: "special", label: sit.specialVerb || "Special" });
    if (hidden) marks.push({ id: "call", label: "Call back" });
    else if (!leaving) marks.push({ id: "hide", label: "Hide" });
    if (!hidden && (sit.gifts || 0) > 0) marks.push({ id: "pick", label: "Pick" });
    return marks.concat(dismissMarks());
  }

  function guestPick(id) {
    return GUEST_CHOICE.indexOf(id) >= 0 ? id : null;
  }

  /** The menu's name for screen readers (web guest-choice.tsx says the same). */
  const MENU_LABEL = "A sit";

  /**
   * A key inside the open choice menu, the same as the web sit menu (keeper.ts menuKey): "close" for
   * Escape, the index to focus for an arrow (both ways, wrapping), Home, or End, and null for anything else.
   */
  function menuKey(key, at, count) {
    if (key === "Escape" || key === "Esc") return "close";
    if (!count) return null;
    if (key === "ArrowRight" || key === "ArrowDown") return at < 0 ? 0 : (at + 1) % count;
    if (key === "ArrowLeft" || key === "ArrowUp") return at <= 0 ? count - 1 : at - 1;
    if (key === "Home") return 0;
    if (key === "End") return count - 1;
    return null;
  }

  function guestHitPad(sit) {
    // Extra wood. The pad is empty. It does not paint a plate.
    if (sit && sit.phone) return 12;
    if (sit && sit.tablet) return 16;
    return 0;
  }

  const api = { GUEST_CHOICE, MENU_LABEL, guestTap, poseFlip, guestMarks, guestPick, guestHitPad, dismissMarks, menuKey };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetChoice = api;
})(typeof window !== "undefined" ? window : globalThis);