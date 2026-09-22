/** Unlock and a bound download name the backend host before the license hash leaves. Same sentence as News and Radio (`clientNetLine`). A loopback backend stays on this computer. */
(function (root) {
  const LICENSE_HOST_NAME = "the license host";
  const LOCAL_STAYS = "this unlock stays on this computer. the license hash does not leave.";

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

  const api = {
    LICENSE_HOST_NAME,
    LOCAL_STAYS,
    licenseHostName,
    licenseTarget,
    licenseHonesty,
    licenseMaySend,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.LicenseNet = api;
})(typeof window !== "undefined" ? window : globalThis);
