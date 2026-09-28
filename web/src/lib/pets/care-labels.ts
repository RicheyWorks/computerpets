/**
 * A care bar never shows two buttons with the same word. Five guests' tricks had the word of another button: the
 * phoenix's treat and trick were both "Ember", the koala's both "Gum", the nexus's both "Count", and the
 * salamander's and the grouper's trick was "Hide", next to the Hide that sends the pet away. The trick keeps its
 * word and says it is the trick.
 */
export function distinctLabel(verb: string, taken: readonly string[]): string {
  const low = verb.trim().toLowerCase();
  return taken.some((t) => t.trim().toLowerCase() === low) ? `${verb} trick` : verb;
}

/** The care bar's other words (the ones a trick may not repeat), before a room's own extras. */
export const CARE_WORDS = ["Feed", "Play", "Talk", "Hide", "Call back", "Shed"] as const;
