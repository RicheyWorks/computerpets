from computerpets_client.license.errors import LicenseError
from computerpets_client.license.hwid import MAX_HWID_LENGTH, assert_hwid, resolve_hwid


def test_hwid_is_at_most_128_and_stable_when_persisted():
    files: dict[str, str] = {}

    def read(path: str) -> str:
        if path.endswith("hwid.txt"):
            if path not in files:
                raise FileNotFoundError(path)
            return files[path]
        return "machine-aaa\n"

    def write(path: str, data: str) -> None:
        files[path] = data

    a = resolve_hwid(user_data_dir="/tmp/cp-hwid", plat="linux", read_file=read, write_file=write, fallback_id="unused")

    def read_persist(path: str) -> str:
        if path.endswith("hwid.txt"):
            return files[path]
        return "machine-bbb\n"

    b = resolve_hwid(user_data_dir="/tmp/cp-hwid", plat="linux", read_file=read_persist, write_file=write)
    assert len(a) <= MAX_HWID_LENGTH
    assert a == b
    assert len(a) == 64


def test_rejects_hwid_longer_than_128():
    try:
        assert_hwid("x" * 129)
        raise AssertionError("expected LicenseError")
    except LicenseError as err:
        assert err.code == "hwid_too_long"
        assert err.detail["maxLength"] == 128


def test_does_not_normalize_case():
    assert assert_hwid("Device-ABC") == "Device-ABC"
    assert assert_hwid("Device-ABC") != "device-abc"
