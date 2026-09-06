/** Catching the lure and arriving at it are the same catch. One hop. */
(function (root) {
  function playClaim(via, chase) {
    if (via === "arrive" && chase.cmd === "leave") return "hide";
    if (via === "catch") {
      if (chase.taken || chase.mark !== "lure") return "none";
      return "play";
    }
    if (chase.cmd === "seek" && chase.mark === "treat") return "snack";
    if (chase.cmd === "seek" && chase.mark === "lure") return chase.taken ? "none" : "play";
    if (chase.cmd === "wander" || chase.cmd === "play" || chase.cmd === "eat" || chase.cmd === "enter") {
      return "idle";
    }
    return "none";
  }

  function playHop(chase, via, onCare = false) {
    const act = playClaim(via, chase);
    if (act === "play") {
      return {
        act,
        next: { taken: true, cmd: "play", mark: null },
        applyPlay: onCare ? 0 : 1,
        persistPlay: onCare ? 1 : 0,
        issuePlay: 1,
        issueEat: 0,
      };
    }
    if (act === "snack") {
      return {
        act,
        next: { taken: true, cmd: "eat", mark: null },
        applyPlay: 0,
        persistPlay: 0,
        issuePlay: 0,
        issueEat: 1,
      };
    }
    if (act === "hide") {
      return {
        act,
        next: { ...chase, taken: true },
        applyPlay: 0,
        persistPlay: 0,
        issuePlay: 0,
        issueEat: 0,
      };
    }
    if (act === "idle") {
      return {
        act,
        next: { ...chase, cmd: "idle" },
        applyPlay: 0,
        persistPlay: 0,
        issuePlay: 0,
        issueEat: 0,
      };
    }
    return {
      act,
      next: chase,
      applyPlay: 0,
      persistPlay: 0,
      issuePlay: 0,
      issueEat: 0,
    };
  }

  function playChase(vias, start, onCare = false) {
    let chase = start;
    const acts = [];
    let applyPlay = 0;
    let persistPlay = 0;
    let issuePlay = 0;
    let issueEat = 0;
    for (const via of vias) {
      const hop = playHop(chase, via, onCare);
      acts.push(hop.act);
      applyPlay += hop.applyPlay;
      persistPlay += hop.persistPlay;
      issuePlay += hop.issuePlay;
      issueEat += hop.issueEat;
      chase = hop.next;
    }
    return { acts, applyPlay, persistPlay, issuePlay, issueEat, taken: chase.taken, mark: chase.mark, cmd: chase.cmd };
  }

  const api = { playClaim, playHop, playChase };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPlay = api;
})(typeof window !== "undefined" ? window : globalThis);
