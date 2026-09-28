// Sets up a web mount test: installs the small DOM, registers the module hooks, then loads React.
// Usage: const m = await mountSetup({ faults: { "lib/pets/cat-tricks.ts": ["stepTrick"] } });
import { register } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { installDom } from "./mount-dom.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
export const SRC = path.resolve(here, "..", "src") + path.sep;

export async function mountSetup({ faults = {}, stubs = {}, width, height } = {}) {
  const dom = installDom({ width, height });
  register(pathToFileURL(path.join(here, "mount-hooks.mjs")).href, { data: { src: SRC, faults, stubs } });
  globalThis.__mountFaults = {};
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const load = (rel) => import(pathToFileURL(path.join(SRC, rel)).href);
  /** A fresh stage (a div on the body) with its own React root. */
  const stage = () => {
    const container = dom.document.createElement("div");
    dom.document.body.appendChild(container);
    const root = createRoot(container);
    return {
      container,
      render: (el) => React.act(() => root.render(el)),
      unmount: async () => {
        await React.act(() => root.unmount());
        container.parentNode?.removeChild(container);
      },
    };
  };
  /** Runs frames inside act so React state set by a loop (a guest leaving) is committed. */
  const frames = (n, ms) => React.act(() => dom.frames(n, ms));
  /** Makes `name` throw (or stop throwing, with null). `fn` may count calls and throw only some. */
  const fault = (name, fn) => {
    if (fn) globalThis.__mountFaults[name] = fn;
    else delete globalThis.__mountFaults[name];
  };
  /** The raw frame stepper (no act): for stepping one frame at a time inside a single act. */
  const framesNow = dom.frames;
  return { ...dom, React, h: React.createElement, stage, frames, framesNow, load, fault };
}
