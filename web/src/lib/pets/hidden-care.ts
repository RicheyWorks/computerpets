/**
 * The words under the care row while the pet is hidden. Feed, the treat and Play need the pet on the floor, and
 * Talk's line shows in a bubble over the pet, so all four wait until Call back. They used to go grey (Talk did
 * nothing at all) with no word why.
 */
export function hiddenCareLine(name: string, treat: string): string {
  const who = name.trim() || "The pet";
  const t = treat.trim() || "the treat";
  return `${who} is hidden. Press Call back to bring ${who} back. Feed, ${t}, Play and Talk wait until then.`;
}
