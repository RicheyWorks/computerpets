/**
 * The line under "Test this mind" on /mind, in plain words. It used to print the raw reply source
 * ("local: Say that again…"), so a keeper who picked an AI could not tell it was house lines that answered,
 * or why. The talk post only asks an online AI for a signed-in keeper with the house key; a guest always gets
 * house lines (talk-spend.ts, listener-read.ts). The reply source says who really answered.
 */
export type MindTestReply = { source: string; text: string };

export function mindTestLine(
  res: MindTestReply,
  picked: { name: string; local: boolean },
  signedIn: boolean,
): string {
  const said = `“${res.text}”`;
  if (picked.local) return `House lines: ${said}`;
  if (res.source !== "local") return `${picked.name}: ${said}`;
  if (!signedIn) {
    return `House lines answered: ${said} ${picked.name} only answers for a signed-in keeper, so pets use house lines until you sign in.`;
  }
  return `House lines answered: ${said} ${picked.name} did not answer. For builders, below, names the server key it needs.`;
}
