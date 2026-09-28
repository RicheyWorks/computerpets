"""PyQt6 blotter client for ComputerPets.

Unlock follows docs/CLIENT-CONTRACT.md (same wire format as desktop/license/).
The living pet walks without a license; unlock is fail-closed.
"""

import sys

__version__ = "0.1.0"

# The floor is 3.10, the oldest Python the whole suite has run on (3.10.0 on the Windows dev box). Nothing
# here needs 3.11. This file stays plain enough for an older Python to read, so it can say so in one line
# instead of failing somewhere deep inside PyQt6 or the package.
MIN_PYTHON = (3, 10)


def python_too_old_message(version=None):
    """One plain line when this Python is older than MIN_PYTHON, else None."""
    v = tuple(sys.version_info if version is None else version)
    v = (tuple(v) + (0, 0, 0))[:3]
    if v[:2] >= MIN_PYTHON:
        return None
    return (
        "ComputerPets needs Python %d.%d or newer. This is Python %d.%d.%d. "
        "Get a newer one from https://www.python.org/downloads, then start it again." % (MIN_PYTHON + v)
    )


_too_old = python_too_old_message()
if _too_old:
    sys.stderr.write(_too_old + "\n")
    raise SystemExit(1)
