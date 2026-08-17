"use strict";

class LicenseError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {unknown} [detail]
   */
  constructor(code, message, detail) {
    super(message);
    this.name = "LicenseError";
    this.code = code;
    if (detail !== undefined) this.detail = detail;
  }
}

module.exports = { LicenseError };
