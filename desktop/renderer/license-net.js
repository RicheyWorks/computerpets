/** Unlock and a bound download name the backend host before the license hash leaves. An unbound download names that host before the POST leaves. That POST has no hash. A signed bundle GET names the CDN host before that request leaves. Each line names the website in plain words, with the same address sentence as the weather, news, and quote plates (`plainNetLine`). A loopback host stays on this computer. */
(function (root) {
  const LICENSE_HOST_NAME = "the license host";
  const LOCAL_STAYS = "Unlocking stays on this computer. The code made from this computer's ID does not leave.";
  const DOWNLOAD_LOCAL = "This download stays on this computer. It talks to this computer. It does not send the code made from this computer's ID.";
  const BUNDLE_HOST_NAME = "the bundle host";
  const BUNDLE_IDLE = "Your pet's files are not downloaded until this line names the website.";
  const BUNDLE_LOCAL = "This download stays on this computer. Your pet's files come from this computer.";

  function plainNetLine(name) {
    const areas = root.PetWeatherAreas;
    if (!areas || typeof areas.plainNetLine !== "function") return "";
    return areas.plainNetLine(name);
  }

  function licenseHostName(raw) {
    try {
      return new URL(String(raw || "").trim()).hostname.replace(/^\[|\]$/g, "") || "";
    } catch (err) {
      return "";
    }
  }

  function isLoopbackHost(host) {
    const name = String(host || "").toLowerCase();
    return name === "127.0.0.1" || name === "localhost" || name === "::1";
  }

  function licenseTarget(backendUrl) {
    const host = licenseHostName(backendUrl);
    if (!host) return null;
    return { local: isLoopbackHost(host), label: host || LICENSE_HOST_NAME };
  }

  function licenseHonesty(backendUrl) {
    const target = licenseTarget(backendUrl);
    if (!target || target.local) return "";
    const net = plainNetLine(target.label);
    if (!net) return "";
    return `This asks ${target.label}, the license website, to check your license. It sends what you typed for your license and a scrambled code made from this computer's ID. The ID itself stays here. ${net} A download tied to this computer sends that same code.`;
  }

  function licenseMaySend(backendUrl, shown) {
    const target = licenseTarget(backendUrl);
    if (!target || target.local) return true;
    const line = licenseHonesty(backendUrl);
    const net = plainNetLine(target.label);
    if (!line || !net || typeof shown !== "string") return false;
    return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
  }

  /**
   * The only unlock-hash POST from this page, including a bound download.
   * A miss resolves to a hold and does not call `request`. A loopback backend still calls it.
   */
  function postLicenseHash(shown, backendUrl, request) {
    if (!licenseMaySend(backendUrl, shown)) return Promise.resolve({ held: true });
    return Promise.resolve().then(request);
  }

  function downloadTalkHonesty(backendUrl) {
    const target = licenseTarget(backendUrl);
    if (!target || target.local) return "";
    const net = plainNetLine(target.label);
    if (!net) return "";
    return `This asks ${target.label}, the license website, for your pet. It sends your saved license and the pass from unlocking. ${net} It does not send the code made from this computer's ID.`;
  }

  function downloadMayPost(backendUrl, shown) {
    const target = licenseTarget(backendUrl);
    if (!target || target.local) return true;
    const line = downloadTalkHonesty(backendUrl);
    const net = plainNetLine(target.label);
    if (!line || !net || typeof shown !== "string") return false;
    return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
  }

  /** The only unbound download POST from this page. A miss does not call `request`. */
  function postUnboundDownload(shown, backendUrl, request) {
    if (!downloadMayPost(backendUrl, shown)) return Promise.resolve({ held: true });
    return Promise.resolve().then(request);
  }

  function bundleUrl(raw) {
    try {
      return new URL(String(raw || "").trim());
    } catch (err) {
      return null;
    }
  }

  function bundleHostName(raw) {
    const url = bundleUrl(raw);
    if (!url || url.protocol === "file:") return "";
    return url.hostname.replace(/^\[|\]$/g, "") || "";
  }

  function bundleTarget(downloadUrl) {
    const raw = String(downloadUrl || "").trim();
    if (!raw) return null;
    const url = bundleUrl(raw);
    if (!url || url.protocol === "file:") return { local: true, label: "" };
    const host = url.hostname.replace(/^\[|\]$/g, "");
    if (!host || isLoopbackHost(host)) return { local: true, label: host };
    return { local: false, label: host || BUNDLE_HOST_NAME };
  }

  function bundleHonesty(downloadUrl) {
    const target = bundleTarget(downloadUrl);
    if (!target || target.local) return "";
    const net = plainNetLine(target.label);
    if (!net) return "";
    return `This gets your pet's files from ${target.label}, the download website, with the link the license website gave. ${net} It does not send the code made from this computer's ID.`;
  }

  function bundleMayFetch(downloadUrl, shown) {
    const target = bundleTarget(downloadUrl);
    if (!target || target.local) return true;
    const line = bundleHonesty(downloadUrl);
    const net = plainNetLine(target.label);
    if (!line || !net || typeof shown !== "string") return false;
    return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
  }

  /** The only signed-bundle GET from this page. A miss does not call `request` and does not scrub the query. */
  function getSignedBundle(shown, downloadUrl, request) {
    if (!bundleMayFetch(downloadUrl, shown)) return Promise.resolve({ ok: false, status: 0, bytes: 0, held: true });
    return Promise.resolve().then(request);
  }

  const api = {
    LICENSE_HOST_NAME,
    LOCAL_STAYS,
    DOWNLOAD_LOCAL,
    BUNDLE_HOST_NAME,
    BUNDLE_IDLE,
    BUNDLE_LOCAL,
    licenseHostName,
    licenseTarget,
    licenseHonesty,
    licenseMaySend,
    postLicenseHash,
    downloadTalkHonesty,
    downloadMayPost,
    postUnboundDownload,
    bundleHostName,
    bundleTarget,
    bundleHonesty,
    bundleMayFetch,
    getSignedBundle,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.LicenseNet = api;
})(typeof window !== "undefined" ? window : globalThis);
