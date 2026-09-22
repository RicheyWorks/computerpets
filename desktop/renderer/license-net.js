/** Unlock and a bound download name the backend host before the license hash leaves. An unbound download names that host before the POST leaves. That POST has no hash. A signed bundle GET names the CDN host before that request leaves. Same sentence as News and Radio (`clientNetLine`). A loopback host stays on this computer. */
(function (root) {
  const LICENSE_HOST_NAME = "the license host";
  const LOCAL_STAYS = "this unlock stays on this computer. the license hash does not leave.";
  const DOWNLOAD_LOCAL = "this download stays on this computer. it talks to this computer. the license hash is not on that request.";
  const BUNDLE_HOST_NAME = "the bundle host";
  const BUNDLE_IDLE = "a signed bundle is not fetched until this line names the host.";
  const BUNDLE_LOCAL = "this download stays on this computer. the signed bundle does not leave.";

  function clientNetLine(host) {
    const areas = root.PetWeatherAreas;
    if (!areas || typeof areas.clientNetLine !== "function") return "";
    return areas.clientNetLine(host);
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
    const net = clientNetLine(target.label);
    if (!net) return "";
    return `this unlock sends the license hash. ${net} a bound download sends that same hash.`;
  }

  function licenseMaySend(backendUrl, shown) {
    const target = licenseTarget(backendUrl);
    if (!target || target.local) return true;
    const line = licenseHonesty(backendUrl);
    const net = clientNetLine(target.label);
    if (!line || !net || typeof shown !== "string") return false;
    return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
  }

  function downloadTalkHonesty(backendUrl) {
    const target = licenseTarget(backendUrl);
    if (!target || target.local) return "";
    const net = clientNetLine(target.label);
    if (!net) return "";
    return `this download talks to ${target.label}. ${net} the license hash is not on that request.`;
  }

  function downloadMayPost(backendUrl, shown) {
    const target = licenseTarget(backendUrl);
    if (!target || target.local) return true;
    const line = downloadTalkHonesty(backendUrl);
    const net = clientNetLine(target.label);
    if (!line || !net || typeof shown !== "string") return false;
    return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
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
    const net = clientNetLine(target.label);
    if (!net) return "";
    return `this download gets the signed bundle. ${net} the license hash is not on that request.`;
  }

  function bundleMayFetch(downloadUrl, shown) {
    const target = bundleTarget(downloadUrl);
    if (!target || target.local) return true;
    const line = bundleHonesty(downloadUrl);
    const net = clientNetLine(target.label);
    if (!line || !net || typeof shown !== "string") return false;
    return shown.indexOf(line) !== -1 && shown.indexOf(net) !== -1;
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
    downloadTalkHonesty,
    downloadMayPost,
    bundleHostName,
    bundleTarget,
    bundleHonesty,
    bundleMayFetch,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.LicenseNet = api;
})(typeof window !== "undefined" ? window : globalThis);
