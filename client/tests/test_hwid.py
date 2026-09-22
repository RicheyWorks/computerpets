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


def test_hashes_linux_machine_id_and_hides_the_raw_value():
    seen: list[str] = []

    def read(path: str) -> str:
        seen.append(path)
        if path.endswith("hwid.txt"):
            raise FileNotFoundError(path)
        return "machine-aaa\n"

    written: dict[str, str] = {}

    def write(path: str, data: str) -> None:
        assert "machine-aaa" not in data
        written[path] = data

    from computerpets_client.license.hwid import resolve_hwid_detail

    detail = resolve_hwid_detail(
        user_data_dir="/tmp/cp-hwid-mark",
        plat="linux",
        read_file=read,
        write_file=write,
    )
    assert detail["id"] == "eaa1f7bdd907e76c52b378ce67b87a05bb287933089e7adc50ca18399cbb53a4"
    assert detail["source"] == "etc-machine-id"
    assert detail["read"] == "machine"
    assert "raw" not in detail
    assert detail["rawLeavesMachine"] is False
    assert "machine-aaa" not in str(detail)
    os_reads = [item for item in seen if not item.endswith("hwid.txt")]
    assert os_reads[0].endswith("/etc/machine-id")
    assert written["/tmp/cp-hwid-mark/hwid.txt"] == detail["id"]


def test_reuses_a_stored_mark_without_reading_the_os():
    def read(path: str) -> str:
        if not path.endswith("hwid.txt"):
            raise AssertionError(path)
        return "legacy-device\n"

    def write(path: str, data: str) -> None:
        raise AssertionError((path, data))

    from computerpets_client.license.hwid import peek_hwid, resolve_hwid_detail

    detail = resolve_hwid_detail(user_data_dir="/tmp/cp-hwid-mark", plat="linux", read_file=read, write_file=write)
    assert detail["id"] == "legacy-device"
    assert detail["read"] == "stored"
    peeked = peek_hwid(
        user_data_dir="/tmp/cp-hwid-empty",
        read_file=lambda path: (_ for _ in ()).throw(FileNotFoundError(path)) if path.endswith("hwid.txt") else "no",
    )
    assert peeked["read"] == "unread"
    assert peeked["id"] == ""


def test_windows_hostname_fallback_is_hashed():
    from computerpets_client.license.hwid import describe_machine_marks, resolve_hwid_detail

    def fail_reg(_cmd: str) -> str:
        raise OSError("no registry")

    written: dict[str, str] = {}
    detail = resolve_hwid_detail(
        user_data_dir="/tmp/cp-hwid-host",
        plat="windows",
        read_file=lambda path: (_ for _ in ()).throw(FileNotFoundError(path)),
        write_file=lambda path, data: written.__setitem__(path, data),
        exec_cmd=fail_reg,
        hostname="KEEP-ME-SECRET",
    )
    assert detail["source"] == "hostname"
    assert "KEEP-ME-SECRET" not in str(detail)
    assert "KEEP-ME-SECRET" not in next(iter(written.values()))
    assert len(str(detail["id"])) == 64
    win = next(mark for mark in describe_machine_marks("windows") if mark["source"] == "machine-guid")
    assert win["where"] == "HKLM\\SOFTWARE\\Microsoft\\Cryptography"
    assert win["value"] == "MachineGuid"
    assert describe_machine_marks("linux")[0]["where"] == "/etc/machine-id"
