/** A tap on the guest is a choice, not a sit. They pick. Then they do that sit. */
(function (root) {
  const GUEST_CHOICE = [
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
  ];

  function guestTap() {
    return "choice";
  }

  function poseFlip(walking) {
    return walking ? { id: "sit", label: "Sit" } : { id: "walk", label: "Walk" };
  }

  function guestMarks(sit) {
    sit = sit || {};
    const hidden = !!sit.hidden;
    const leaving = !!sit.leaving;
    const busy = hidden || leaving;
    const marks = [];
    if (!busy) {
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
    return marks;
  }

  function guestPick(id) {
    return GUEST_CHOICE.indexOf(id) >= 0 ? id : null;
  }

  function guestHitPad(sit) {
    // Extra wood. The pad is empty. It does not paint a plate.
    if (sit && sit.phone) return 12;
    if (sit && sit.tablet) return 16;
    return 0;
  }

  const api = { GUEST_CHOICE, guestTap, poseFlip, guestMarks, guestPick, guestHitPad };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetChoice = api;
})(typeof window !== "undefined" ? window : globalThis);
