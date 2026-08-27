/** Rui's ribbon lure. House lines stay. */
(function (root) {
  const RIBBON_SPECIAL = "I found a ribbon. It was not lost. It is now safer.";
  const RIBBON_CATCH = "A ribbon. Catch it.";
  const RIBBON_PLAY = "Catch the ribbon. I invented this game.";

  function blankRibbon(x) {
    return { x: x, hops: 0, stolen: false, carried: false };
  }

  function stealRibbon(ribbon, petX) {
    return { ...ribbon, x: petX, stolen: true, carried: true, hops: ribbon.hops };
  }

  function dropRibbon(ribbon, x) {
    return { ...ribbon, x: x, carried: false };
  }

  function carryX(ribbon, petX, facing) {
    if (!ribbon || !ribbon.carried) return ribbon ? ribbon.x : petX;
    return petX + facing * 38;
  }

  function isRibbonSpecial(special) {
    return special === "ribbon";
  }

  const api = {
    RIBBON_SPECIAL,
    RIBBON_CATCH,
    RIBBON_PLAY,
    blankRibbon,
    stealRibbon,
    dropRibbon,
    carryX,
    isRibbonSpecial,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRibbon = api;
})(typeof window !== "undefined" ? window : globalThis);
