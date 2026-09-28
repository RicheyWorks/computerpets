"use strict";

/**
 * Loaded by first-run-drive.cjs only (`electron -r first-run-drive-hook.cjs`), before main.cjs runs, so nothing can
 * slip past it: a message box is recorded instead of shown (the drive reads its words and presses its buttons by
 * answering it), and app.relaunch is recorded instead of starting a second copy outside the drive (the drive starts
 * the app again itself). Native menus are recorded the same way in the drive's launch. Not part of the built app.
 */
const { app, dialog } = require("electron");

const g = /** @type {any} */ (globalThis);
g.__dialogs = [];
g.__relaunches = 0;

/** @param {any} a @param {any} [b] */
dialog.showMessageBox = function showMessageBoxRecorded(a, b) {
  const o = b && typeof b === "object" ? b : a || {};
  return new Promise((resolve) => {
    g.__dialogs.push({
      message: String(o.message || ""),
      detail: String(o.detail || ""),
      buttons: Array.isArray(o.buttons) ? o.buttons.map(String) : [],
      answered: false,
      /** @param {number} i */
      answer(i) {
        this.answered = true;
        resolve({ response: i, checkboxChecked: false });
      },
    });
  });
};

app.relaunch = function relaunchRecorded() {
  g.__relaunches += 1;
};
