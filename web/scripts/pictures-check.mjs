/**
 * The pet portraits under web/public/pets come through Git LFS (.gitattributes). A Git without LFS
 * (common on Mac and Linux: Xcode's git, apt's git) copies small text pointers instead of JPGs, and
 * every portrait on the site would be a broken picture with no word said. The dev server (and a
 * build) says so plainly, with the same Git LFS steps as desktop.sh / desktop.ps1 and the overlay.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const PORTRAIT = ["pets", "crow.jpg"];
export const POINTER = "version https://git-lfs";
export const STEPS =
  "Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull";

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

/** "ready" | "lfs-pointers" | "missing", read from public/pets/crow.jpg. */
export function portraitsState(publicDir = PUBLIC_DIR, io = { readFileSync }) {
  let bytes;
  try {
    bytes = io.readFileSync(join(publicDir, ...PORTRAIT));
  } catch {
    return "missing";
  }
  return Buffer.from(bytes).subarray(0, POINTER.length).toString("latin1") === POINTER ? "lfs-pointers" : "ready";
}

/** The plain line the dev server prints, or "" when the portraits are real. */
export function portraitsWords(state) {
  if (state === "ready") return "";
  const why =
    state === "missing"
      ? "The pet portraits are not in this copy of ComputerPets."
      : "The pet portraits did not download. They come through Git LFS, which this Git does not have yet.";
  return `${why} ${STEPS}, and run npm run dev again.`;
}

/** Vite plugin: warn once when the dev server (or a build) starts with pointer portraits. */
export function picturesCheckPlugin(publicDir = PUBLIC_DIR, io = { readFileSync }) {
  let said = false;
  const say = (logger) => {
    if (said) return;
    said = true;
    const line = portraitsWords(portraitsState(publicDir, io));
    if (line) (logger ?? console).warn(`\n[computerpets] ${line}\n`);
  };
  return {
    name: "computerpets:pictures-check",
    configResolved(config) {
      say(config.logger);
    },
  };
}
