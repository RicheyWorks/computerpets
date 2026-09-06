/** Catching the lure and arriving at it are the same catch. One hop. */

export type PlayVia = "catch" | "arrive";

export type PlayMark = "lure" | "treat";

export type PlayAct = "play" | "snack" | "hide" | "idle" | "none";

export type PlayChase = {
  taken: boolean;
  cmd: string;
  mark: PlayMark | null;
};

/** Who gets the finish. A second grab of the same lure is not another hop. */
export function playClaim(via: PlayVia, chase: PlayChase): PlayAct {
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

export type PlayHop = {
  act: PlayAct;
  next: PlayChase;
  applyPlay: number;
  persistPlay: number;
  issuePlay: number;
  issueEat: number;
};

/** Step one grab. Local apply or persist, not both. The pose issues once. */
export function playHop(chase: PlayChase, via: PlayVia, onCare = false): PlayHop {
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

export type PlayChaseResult = {
  acts: PlayAct[];
  applyPlay: number;
  persistPlay: number;
  issuePlay: number;
  issueEat: number;
  taken: boolean;
  mark: PlayMark | null;
  cmd: string;
};

/** Run a chase. Catch then arrive, or arrive then catch — one hop. */
export function playChase(vias: PlayVia[], start: PlayChase, onCare = false): PlayChaseResult {
  let chase = start;
  const acts: PlayAct[] = [];
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
