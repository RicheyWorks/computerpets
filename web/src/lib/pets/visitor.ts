import { LIVING_KINDS, type LivingKind } from "./living";

export function todaysVisitor(hostKey: string, now = new Date()): LivingKind {
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  const others = LIVING_KINDS.filter((k) => k.key !== hostKey);
  return others[Math.abs(day + hostKey.length) % others.length]!;
}

const LINES: Record<string, string> = {
  red_panda: "I came for the ribbon. I'll put it back. Maybe.",
  cat: "I inspected the blotter. It will do.",
  dog: "I brought the whole tail. Then I took it home.",
  rabbit: "A short visit. The greens here are theoretical.",
  hamster: "I mapped the crumbs. Officially.",
  guinea_pig: "Wheek. That is the entire review.",
  turtle: "I arrived. I will leave in due course.",
  goldfish: "I drifted through. That counts.",
  budgie: "A note: your house is loud. I approve.",
  fox: "I found this desk first. Then I left it.",
  penguin: "A pebble of a visit.",
  parrot: "I came to quote the furniture.",
  ferret: "I borrowed a dongle. I'll return a better one.",
  hedgehog: "A quiet walk-through.",
  chinchilla: "The dust here is a scandal. I took a sample.",
  axolotl: "I grew a little more present. Then less.",
  toucan: "The bill approves of this blotter.",
  iguana: "I blinked at your lamp. Then I left.",
  dragon: "A courtesy inspection of the hoard.",
  phoenix: "I warmed the corner. You're welcome.",
  ball_python: "I came as a bun. I will leave as a bun.",
  corn_snake: "I threaded through. Your gap is fine.",
  kingsnake: "I inspected. You may keep the desk.",
  green_tree_python: "I hung on your lamp. Briefly.",
  hognose: "I died on your blotter. I got over it.",
  garter: "I patrolled. The moss is adequate.",
  boa: "I held the edge. Then I let go.",
  milk_snake: "I was a rumor. Then I was lunch-minded.",
  rosy_boa: "I borrowed the warm corner. I left it pink.",
  carpet_python: "I charted your shelf. You may land.",
};

export function visitLine(guestKey: string) {
  return LINES[guestKey] ?? "I came. I saw the lamp. I left.";
}
