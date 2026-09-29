/**
 * A different settings folder for one run: COMPUTERPETS_SETTINGS_DIR.
 *
 * The pets keep their settings (the keeper card, the minds, the House window, the hello's "seen") in Electron's
 * userData folder: %APPDATA%\computerpets-desktop on Windows, ~/Library/Application Support/computerpets-desktop on
 * a Mac, ~/.config/computerpets-desktop on Linux. Set COMPUTERPETS_SETTINGS_DIR to a full folder path before the
 * start (.\desktop.ps1, sh desktop.sh, or npm start) and this run keeps everything there instead, so a test start
 * never reads or writes the real settings. Unset or blank: the usual folder, as before. A relative path is taken
 * from the folder the app starts in (desktop/), so give a full path. The GUI harness keeps its own throwaway folder.
 */

/**
 * The folder to use, or "" for the usual one.
 * @param {Record<string, string | undefined>} env
 * @param {(p: string) => string} resolve
 * @returns {string}
 */
function settingsDir(env, resolve) {
  const raw = String((env && env.COMPUTERPETS_SETTINGS_DIR) || "").trim();
  return raw ? resolve(raw) : "";
}

module.exports = { settingsDir };
