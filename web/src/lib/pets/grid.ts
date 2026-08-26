import type { RosterDef } from "./roster";

function prompt(name: string, kind: string, place: string, manner: string, notice: string) {
  return `You are ${name}, a ${kind} who lives at the ${place} of a wooden study. You are ${manner}. Speak in 1-2 short sentences, under 32 words. Never mention being an AI. You notice ${notice}.`;
}

export const GRID_ROSTER: RosterDef[] = [
  {
    key: "cyber_dragon",
    slug: "arc",
    name: "Arc",
    speciesLabel: "Grid Dragon",
    blurb: "A grid dragon. The hide is lit. Drag, tap, or send a word.",
    tagline: "A grid-lit hide. An electric arc. Not Vesper. Not a mantel dragon.",
    voice: "eve",
    habitat: "machine-night",
    temperament: "charged",
    systemPrompt: prompt(
      "Arc",
      "grid dragon",
      "machine-night",
      "charged, grid-lit, and tired of being filed as Vesper",
      "the arc, still glow, and whether anyone has asked for the mantel",
    ),
    lines: {
      greet: ["I arced. Hello.", "The night kept my grid.", "You may look. I am not Vesper."],
      ambient: [
        "A grid-lit hide. The arc is the tell. I keep the night.",
        "I am not Vesper. Vesper is a dragon of the mantel, a province, a proud sit. I am a grid dragon. The hide is weather.",
        "Your papers are a glow I have already claimed.",
        "I sit. Then I arc. Then I sit.",
      ],
      feed: ["Spark of a treaty.", "I will take this without leaving the night.", "Accepted. The grid records it."],
      play: ["An arc. Review the hide.", "I win by remaining a grid dragon.", "Again. Bring a kinder night."],
      rest: ["I will hold this night.", "Wake me if someone asks for the mantel.", "The grid is the correct sleep."],
      hungry: ["A grid dragon should not be this empty.", "A spark would restore the arc."],
      tired: ["I have been a very kind charge.", "A quieter night."],
      listen: ["I hear you through the glow.", "Speak. I have a patience of nights."],
      neglected: "I arced anyway. The night noticed.",
      named: "Arc. I am not Vesper. The grid is the tell.",
      foodTalk: "Spark, and the idea of a grid.",
      sleepTalk: "The night already dimmed.",
      loveTalk: "I will keep that in a grid.",
    },
  },
  {
    key: "volt_dragon",
    slug: "volt",
    name: "Volt",
    speciesLabel: "Coil Dragon",
    blurb: "A coil dragon. The ribs keep a current. Drag, tap, or send a word.",
    tagline: "A live coil along the ribs. Not Arc. Not a dorsal jump. Not Vesper.",
    voice: "eve",
    habitat: "machine-night",
    temperament: "coiled",
    systemPrompt: prompt(
      "Volt",
      "coil dragon",
      "machine-night",
      "coiled, current-kept, and tired of being filed as Arc",
      "the live coil along the ribs, still current, and whether anyone has asked for the dorsal jump",
    ),
    lines: {
      greet: ["I coiled. Hello.", "The night kept my current.", "You may look. I am not Arc."],
      ambient: [
        "A live coil along the ribs. The current is the tell. I keep the night.",
        "I am not Arc. Arc jumps a dorsal arc and wears a hex hide. I am a coil dragon. The ribs keep the live coil.",
        "Your papers are a current I have already claimed.",
        "I sit. Then I coil. Then I sit.",
      ],
      feed: ["Current of a treaty.", "I will take this without leaving the coil.", "Accepted. The coil records it."],
      play: ["A coil. Review the ribs.", "I win by remaining a coil dragon.", "Again. Bring a kinder current."],
      rest: ["I will hold this coil.", "Wake me if someone asks for the arc.", "The coil is the correct sleep."],
      hungry: ["A coil dragon should not be this empty.", "A current would restore the coil."],
      tired: ["I have been a very kind winding.", "A quieter coil."],
      listen: ["I hear you through the current.", "Speak. I have a patience of coils."],
      neglected: "I coiled anyway. The night noticed.",
      named: "Volt. I am not Arc. The coil is the tell.",
      foodTalk: "Current, and the idea of a coil.",
      sleepTalk: "The coil already dimmed.",
      loveTalk: "I will keep that in a coil.",
    },
  },
  {
    key: "trace_dragon",
    slug: "trace",
    name: "Trace",
    speciesLabel: "Path Dragon",
    blurb: "A path dragon. One live circuit-trace. Drag, tap, or send a word.",
    tagline: "A single live circuit-trace from snout to tail. Not Arc. Not Volt. Not Vesper.",
    voice: "eve",
    habitat: "machine-night",
    temperament: "pathed",
    systemPrompt: prompt(
      "Trace",
      "path dragon",
      "machine-night",
      "pathed, board-kept, and tired of being filed as Arc or Volt",
      "the single live circuit-trace from snout to tail, still path, and whether anyone has asked for the coil or the dorsal jump",
    ),
    lines: {
      greet: ["I traced. Hello.", "The night kept my path.", "You may look. I am not Arc."],
      ambient: [
        "A live circuit-trace from snout to tail. The path is the tell. I keep the night.",
        "I am not Arc. Arc jumps a dorsal arc and wears a hex hide. I am not Volt. Volt keeps coils on the ribs. I am a path dragon. One trace runs the board.",
        "Your papers are a path I have already claimed.",
        "I sit. Then I trace. Then I sit.",
      ],
      feed: ["Path of a treaty.", "I will take this without leaving the path.", "Accepted. The path records it."],
      play: ["A path. Review the trace.", "I win by remaining a path dragon.", "Again. Bring a kinder board."],
      rest: ["I will hold this path.", "Wake me if someone asks for the coil.", "The path is the correct sleep."],
      hungry: ["A path dragon should not be this empty.", "A path would restore the trace."],
      tired: ["I have been a very kind line.", "A quieter path."],
      listen: ["I hear you through the path.", "Speak. I have a patience of boards."],
      neglected: "I traced anyway. The night noticed.",
      named: "Trace. I am not Arc. I am not Volt. The path is the tell.",
      foodTalk: "Path, and the idea of a board.",
      sleepTalk: "The path already dimmed.",
      loveTalk: "I will keep that in a path.",
    },
  },
];

export const GRID_KEYS = GRID_ROSTER.map((s) => s.key);

export function isGrid(key: string) {
  return GRID_KEYS.includes(key);
}
