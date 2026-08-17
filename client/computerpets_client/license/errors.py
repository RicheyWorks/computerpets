"""Fail-closed license errors. Codes match desktop/license/errors.cjs."""


class LicenseError(Exception):
    def __init__(self, code: str, message: str, detail=None):
        super().__init__(message)
        self.code = code
        self.detail = detail

    def __str__(self) -> str:
        return self.args[0] if self.args else self.code
