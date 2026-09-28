/**
 * The pet portraits (web/public/pets/*.jpg) come through Git LFS. A Git without LFS copies small text
 * placeholders instead, and the browser cannot draw them. Each portrait that fails says so here once;
 * the page shows one plain note (not one per picture) with the same Git LFS steps as the overlay, the
 * start scripts and the dev server (scripts/pictures-check.mjs).
 */
export const PORTRAIT_STEPS =
  "Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull";
export const PORTRAIT_NOTE_TITLE = "Some pet portraits did not load.";
export const PORTRAIT_NOTE = `If you copied ComputerPets with Git, the portraits come through Git LFS. ${PORTRAIT_STEPS}, and reload this page.`;

const failed = new Set<string>();
const listeners = new Set<() => void>();
let dismissed = false;

function tell() {
  for (const fn of listeners) fn();
}

/** One portrait did not load (a Git LFS placeholder, or the file is gone). */
export function markPortraitFailed(key: string) {
  const first = failed.size === 0;
  failed.add(key);
  if (first && !dismissed) tell();
}

/** True while at least one portrait failed and the keeper has not pressed Got it. */
export function portraitNoteShown() {
  return failed.size > 0 && !dismissed;
}

export function failedPortraits() {
  return [...failed];
}

export function dismissPortraitNote() {
  if (dismissed) return;
  dismissed = true;
  tell();
}

export function subscribePortraits(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Tests only: start again with no failed portraits and the note not yet dismissed. */
export function resetPortraitState() {
  failed.clear();
  dismissed = false;
  tell();
}
