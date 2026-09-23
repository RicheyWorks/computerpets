#!/bin/sh
# Linux GPU probe. Same CSV line as desktop/gpu-probe.ps1 and gpu-probe-mac.sh.
# nvidia-smi prints name, temperature, utilization, memory, and power.
# When that binary is missing, fails, or prints nothing, amdgpu sysfs may
# print the same line from gpu_busy_percent and mem_info_vram_used /
# mem_info_vram_total. Temperature and power stay [N/A] on that line.
# A missing file, a failed read, or a non-numeric file stays [N/A], not a zero.
# A VRAM total of zero is not capacity. Bytes under half a MiB stay [N/A]
# unless the file itself is zero. VRAM busyness, GTT, and hwmon are not
# copied. When nvidia-smi and amdgpu both print nothing, an i915 or xe
# card may print utilization from DRM client fdinfo. i915 uses
# drm-engine-render (cumulative nanoseconds). xe uses drm-cycles-rcs
# and drm-total-cycles-rcs (cumulative cycles). The probe reads those
# keys twice in one run, sums the card's render engine across clients
# present in both reads, and prints a percent only when the interval
# is positive and no counter moved backwards. A zero interval, a
# rewind, a missing file, or a percent above 100 stays INTEL_EMPTY.
# Temperature, power, and memory stay [N/A]. Per-client fdinfo memory
# is not device VRAM. rc6_residency_ms, gtidle/idle_residency_ms, and
# frequency files are not copied. PMU is not opened. The overlay tick
# is five seconds and a hung probe is killed at eight, so the gap
# between reads defaults to 200ms, never more than one second, and a
# scan that already ran long does not start the second read.
# GPU_SYSFS_ROOT overrides /sys/class/drm. GPU_PROC_ROOT overrides
# /proc. GPU_FDINFO_ROOT_2 plus GPU_FDINFO_INTERVAL_NS is a fixture
# stand-in for the second read and the measured gap. Windows PDH
# sections stay ABSENT.
sysfs_root=${GPU_SYSFS_ROOT:-/sys/class/drm}
proc_root=${GPU_PROC_ROOT:-/proc}
fdinfo_tmp=""
cleanup_fdinfo() {
  if [ -n "$fdinfo_tmp" ]; then
    rm -rf "$fdinfo_tmp"
    fdinfo_tmp=""
  fi
}
trap cleanup_fdinfo EXIT
trap 'cleanup_fdinfo; exit 1' INT TERM

read_one() {
  if [ ! -f "$1" ] || [ ! -r "$1" ]; then
    return 1
  fi
  raw=$(cat "$1" 2>/dev/null) || return 1
  raw=$(printf '%s' "$raw" | tr -d ' \t\r\n')
  [ -n "$raw" ] || return 1
  printf '%s' "$raw"
}

is_plain_num() {
  printf '%s' "$1" | grep -Eq '^[0-9]+([.][0-9]+)?$'
}

is_bytes() {
  printf '%s' "$1" | grep -Eq '^[0-9]+$'
}

bytes_to_mib() {
  awk -v n="$1" 'BEGIN {
    if (n+0 < 0) exit 1
    if (n+0 == 0) { printf "0"; exit }
    if (n+0 < 524288) exit 0
    printf "%.0f", int((n + 524288) / 1048576)
  }'
}

emit_amdgpu() {
  root=$1
  found=0
  lines=""
  nlines=0
  if [ ! -d "$root" ]; then
    printf '%s\n' "AMDGPU_ABSENT"
    return
  fi
  names=$(
    for entry in "$root"/card*; do
      [ -d "$entry" ] || continue
      base=$(basename "$entry")
      case "$base" in
        card*[!0-9]*) continue ;;
        card*[0-9]) printf '%s\n' "$base" ;;
      esac
    done | sort -V
  )
  old_ifs=$IFS
  IFS='
'
  for base in $names; do
    [ -n "$base" ] || continue
    dev="$root/$base/device"
    [ -d "$dev" ] || continue
    [ -L "$dev/driver" ] || continue
    target=$(readlink "$dev/driver" 2>/dev/null || true)
    [ -n "$target" ] || continue
    drv=$(basename "$target")
    [ "$drv" = "amdgpu" ] || continue
    found=1
    name="amdgpu"
    if [ -r "$dev/uevent" ]; then
      pci=$(awk -F= '/^PCI_ID=/ { print $2; exit }' "$dev/uevent" 2>/dev/null | tr -d ' \t\r\n')
      if printf '%s' "$pci" | grep -Eq '^[0-9A-Fa-f]+:[0-9A-Fa-f]+$'; then
        name="amdgpu $pci"
      fi
    fi
    util_field="[N/A]"
    used_field="[N/A]"
    total_field="[N/A]"
    have=0
    util_raw=$(read_one "$dev/gpu_busy_percent" || true)
    if [ -n "$util_raw" ] && is_plain_num "$util_raw" && awk -v n="$util_raw" 'BEGIN { exit !(n+0 >= 0 && n+0 <= 100) }'; then
      util_field=$util_raw
      have=1
    fi
    used_raw=$(read_one "$dev/mem_info_vram_used" || true)
    total_raw=$(read_one "$dev/mem_info_vram_total" || true)
    use_used=0
    use_total=0
    if [ -n "$total_raw" ] && is_bytes "$total_raw" && awk -v t="$total_raw" 'BEGIN { exit !(t+0 > 0) }'; then
      use_total=1
    fi
    if [ -n "$used_raw" ] && is_bytes "$used_raw"; then
      use_used=1
    fi
    if [ "$use_used" -eq 1 ] && [ "$use_total" -eq 1 ]; then
      if ! awk -v u="$used_raw" -v t="$total_raw" 'BEGIN { exit !(u+0 <= t+0) }'; then
        use_used=0
        use_total=0
      fi
    fi
    if [ "$use_total" -eq 0 ] && [ -n "$total_raw" ] && is_bytes "$total_raw" && awk -v t="$total_raw" 'BEGIN { exit !(t+0 == 0) }'; then
      use_used=0
    fi
    if [ "$use_used" -eq 1 ]; then
      mib=$(bytes_to_mib "$used_raw")
      if [ -n "$mib" ]; then
        used_field=$mib
        have=1
      fi
    fi
    if [ "$use_total" -eq 1 ]; then
      mib=$(bytes_to_mib "$total_raw")
      if [ -n "$mib" ]; then
        total_field=$mib
        have=1
      fi
    fi
    if [ "$have" -eq 1 ]; then
      row="$name, [N/A], $util_field, $used_field, $total_field, [N/A]"
      if [ "$nlines" -eq 0 ]; then
        lines=$row
      else
        lines="$lines
$row"
      fi
      nlines=$((nlines + 1))
    fi
  done
  IFS=$old_ifs
  if [ "$found" -eq 0 ]; then
    printf '%s\n' "AMDGPU_ABSENT"
  elif [ "$nlines" -eq 0 ]; then
    printf '%s\n' "AMDGPU_EMPTY"
  else
    printf '%s\n' "AMDGPU"
    printf '%s\n' "$lines"
    printf '%s\n' "ENDAMDGPU"
  fi
}

fits_i64() {
  n=$(printf '%s' "$1" | sed 's/^0*//')
  [ -n "$n" ] || n=0
  case "$n" in
    *[!0-9]*) return 1 ;;
  esac
  if [ "${#n}" -gt 19 ]; then
    return 1
  fi
  if [ "${#n}" -eq 19 ]; then
    max=9223372036854775807
    if [ "$n" != "$max" ]; then
      small=$(printf '%s\n%s\n' "$n" "$max" | sort | head -n 1)
      [ "$small" = "$n" ] || return 1
    fi
  fi
  printf '%s' "$n"
}

add_i64() {
  a=$(fits_i64 "$1") || return 1
  b=$(fits_i64 "$2") || return 1
  s=$((a + b)) || return 1
  if [ "$s" -lt 0 ] || [ "$s" -lt "$a" ]; then
    return 1
  fi
  printf '%s' "$s"
}

sub_i64() {
  a=$(fits_i64 "$1") || return 1
  b=$(fits_i64 "$2") || return 1
  if [ "$a" -lt "$b" ]; then
    return 1
  fi
  printf '%s' $((a - b))
}

mul_i64() {
  a=$(fits_i64 "$1") || return 1
  b=$(fits_i64 "$2") || return 1
  if [ "$a" -eq 0 ] || [ "$b" -eq 0 ]; then
    printf '0'
    return 0
  fi
  if [ "$a" -gt $((9223372036854775807 / b)) ]; then
    return 1
  fi
  printf '%s' $((a * b))
}

percent_of() {
  d=$(fits_i64 "$1") || return 1
  den=$(fits_i64 "$2") || return 1
  if [ "$den" -le 0 ] || [ "$d" -gt "$den" ]; then
    return 1
  fi
  if [ "$den" -gt 92233720368547758 ]; then
    return 1
  fi
  p=$(((d * 100 + den / 2) / den))
  if [ "$p" -gt 100 ]; then
    return 1
  fi
  printf '%s' "$p"
}

now_ns() {
  date +%s%N 2>/dev/null || true
}

note_cap() {
  c=$1
  [ "$c" = "-" ] && return 0
  got=$(fits_i64 "$c") || return 1
  if [ "$got" -lt 1 ] || [ "$got" -gt 64 ]; then
    return 1
  fi
  if [ -z "$fd_cap" ]; then
    fd_cap=$got
  elif [ "$fd_cap" != "$got" ]; then
    return 1
  fi
  return 0
}

card_percent() {
  kind=$1
  pairfile=$2
  interval=$3
  fd_sum=0
  fd_total=0
  fd_cap=""
  fd_bad=0
  fd_have=0
  while IFS=' ' read -r fd_key fd_r1 fd_c1 fd_t1 fd_k1 fd_r2 fd_c2 fd_t2 fd_k2; do
    [ -n "$fd_key" ] || continue
    fd_have=1
    if [ "$kind" = "i915" ]; then
      fd_d=$(sub_i64 "$fd_r2" "$fd_r1") || fd_bad=1
      if [ "$fd_bad" -eq 0 ]; then
        fd_sum=$(add_i64 "$fd_sum" "$fd_d") || fd_bad=1
      fi
      if [ "$fd_bad" -eq 0 ]; then
        note_cap "$fd_k1" || fd_bad=1
      fi
      if [ "$fd_bad" -eq 0 ]; then
        note_cap "$fd_k2" || fd_bad=1
      fi
    else
      fd_dc=$(sub_i64 "$fd_c2" "$fd_c1") || fd_bad=1
      fd_dt=$(sub_i64 "$fd_t2" "$fd_t1") || fd_bad=1
      if [ "$fd_bad" -eq 0 ]; then
        fd_sum=$(add_i64 "$fd_sum" "$fd_dc") || fd_bad=1
      fi
      if [ "$fd_bad" -eq 0 ]; then
        fd_total=$(add_i64 "$fd_total" "$fd_dt") || fd_bad=1
      fi
    fi
    if [ "$fd_bad" -ne 0 ]; then
      break
    fi
  done < "$pairfile"
  if [ "$fd_have" -eq 0 ] || [ "$fd_bad" -ne 0 ]; then
    return 1
  fi
  if [ "$kind" = "i915" ]; then
    cap=${fd_cap:-1}
    denom=$(mul_i64 "$interval" "$cap") || return 1
    percent_of "$fd_sum" "$denom" || return 1
  else
    if [ "$fd_total" -le 0 ]; then
      return 1
    fi
    percent_of "$fd_sum" "$fd_total" || return 1
  fi
}

write_fdinfo_awk() {
  cat > "$fdinfo_tmp/parse.awk" << 'END_AWK'
function trim(s) {
  gsub(/^[ \t]+/, "", s)
  gsub(/[ \t]+$/, "", s)
  return s
}
function reset_rec() {
  driver = ""
  pdev = ""
  cid = ""
  render = "-"
  cycles = "-"
  total = "-"
  cap = "-"
  have_render = 0
  have_cycles = 0
  have_total = 0
  have_cap = 0
  inrec = 0
}
function consider(   key, rec, ok) {
  if (inrec == 0) return
  ok = 0
  if (driver == "i915" && have_render == 1) ok = 1
  if (driver == "xe" && have_cycles == 1 && have_total == 1) ok = 1
  if (ok == 0) return
  if (have_render == 0) render = "-"
  if (have_cycles == 0) cycles = "-"
  if (have_total == 0) total = "-"
  if (have_cap == 0) cap = "-"
  key = pdev SUBSEP driver SUBSEP cid
  rec = render SUBSEP cycles SUBSEP total SUBSEP cap
  if (key in seen) {
    if (seen[key] != rec) conflict[pdev SUBSEP driver] = 1
  } else {
    seen[key] = rec
    order[++norder] = key
  }
}
BEGIN { reset_rec() }
$0 == "__CP_FDINFO_BREAK__" {
  consider()
  reset_rec()
  next
}
{
  inrec = 1
  line = $0
  sub(/\r$/, "", line)
  if (match(line, /^drm-driver:[ \t]*/)) {
    v = trim(substr(line, RLENGTH + 1))
    if (v == "i915" || v == "xe") driver = v
    else driver = ""
  } else if (match(line, /^drm-pdev:[ \t]*/)) {
    v = trim(substr(line, RLENGTH + 1))
    v = tolower(v)
    if (v ~ /^[0-9a-f]{4}:[0-9a-f]{2}:[0-9a-f]{2}\.[0-7]$/) pdev = v
  } else if (match(line, /^drm-client-id:[ \t]*/)) {
    v = trim(substr(line, RLENGTH + 1))
    if (v ~ /^[0-9]+$/) cid = v
  } else if (match(line, /^drm-engine-render:[ \t]*/)) {
    v = trim(substr(line, RLENGTH + 1))
    if (v ~ /^[0-9]+[ \t]+ns$/) {
      sub(/[ \t]+ns$/, "", v)
      render = v
      have_render = 1
    }
  } else if (match(line, /^drm-engine-capacity-render:[ \t]*/)) {
    v = trim(substr(line, RLENGTH + 1))
    if (v ~ /^[0-9]+$/) {
      cap = v
      have_cap = 1
    }
  } else if (match(line, /^drm-cycles-rcs:[ \t]*/)) {
    v = trim(substr(line, RLENGTH + 1))
    if (v ~ /^[0-9]+$/) {
      cycles = v
      have_cycles = 1
    }
  } else if (match(line, /^drm-total-cycles-rcs:[ \t]*/)) {
    v = trim(substr(line, RLENGTH + 1))
    if (v ~ /^[0-9]+$/) {
      total = v
      have_total = 1
    }
  }
}
END {
  for (k in conflict) {
    split(k, a, SUBSEP)
    printf "%s %s\n", a[1], a[2] > bad
  }
  for (i = 1; i <= norder; i++) {
    split(order[i], a, SUBSEP)
    split(seen[order[i]], b, SUBSEP)
    printf "%s|%s|%s %s %s %s %s\n", a[1], a[2], a[3], b[1], b[2], b[3], b[4] > out
  }
}
END_AWK
}

scan_proc() {
  root=$1
  out=$2
  bad=$3
  : > "$out"
  : > "$bad"
  if [ ! -d "$root" ]; then
    return 1
  fi
  list=$fdinfo_tmp/list
  find "$root" -mindepth 3 -maxdepth 3 -type f -readable -regex '.*/[0-9][0-9]*/fdinfo/[0-9][0-9]*$' > "$list" 2>/dev/null || true
  count=$(wc -l < "$list" | tr -d ' ')
  [ -n "$count" ] || count=0
  if [ "$count" -gt "$fdinfo_max" ]; then
    return 2
  fi
  if [ "$count" -eq 0 ]; then
    return 0
  fi
  stream=$fdinfo_tmp/stream
  : > "$stream"
  while IFS= read -r fd_file; do
    if [ -f "$fd_file" ] && [ -r "$fd_file" ]; then
      head -c 65536 "$fd_file" >> "$stream" 2>/dev/null || true
      printf '\n' >> "$stream"
    fi
    printf '%s\n' '__CP_FDINFO_BREAK__' >> "$stream"
  done < "$list"
  awk -f "$fdinfo_tmp/parse.awk" -v out="$out" -v bad="$bad" "$stream" || return 1
  return 0
}

emit_intel() {
  root=$1
  found=0
  if [ ! -d "$root" ]; then
    printf '%s\n' "INTEL_ABSENT"
    return
  fi
  names=$(
    for entry in "$root"/card*; do
      [ -d "$entry" ] || continue
      base=$(basename "$entry")
      case "$base" in
        card*[!0-9]*) continue ;;
        card*[0-9]) printf '%s\n' "$base" ;;
      esac
    done | sort -V
  )
  fdinfo_tmp=$(mktemp -d 2>/dev/null || true)
  if [ -z "$fdinfo_tmp" ] || [ ! -d "$fdinfo_tmp" ]; then
    printf '%s\n' "INTEL_EMPTY"
    return
  fi
  cards=$fdinfo_tmp/cards
  : > "$cards"
  old_ifs=$IFS
  IFS='
'
  for base in $names; do
    [ -n "$base" ] || continue
    dev="$root/$base/device"
    [ -d "$dev" ] || continue
    [ -L "$dev/driver" ] || continue
    target=$(readlink "$dev/driver" 2>/dev/null || true)
    [ -n "$target" ] || continue
    drv=$(basename "$target")
    case "$drv" in
      i915|xe) ;;
      *) continue ;;
    esac
    found=1
    slot=""
    pci=""
    if [ -r "$dev/uevent" ]; then
      slot=$(awk -F= '/^PCI_SLOT_NAME=/ { print $2; exit }' "$dev/uevent" 2>/dev/null | tr -d ' \t\r\n' | tr 'A-F' 'a-f')
      pci=$(awk -F= '/^PCI_ID=/ { print $2; exit }' "$dev/uevent" 2>/dev/null | tr -d ' \t\r\n')
    fi
    printf '%s' "$slot" | grep -Eq '^[0-9a-f]{4}:[0-9a-f]{2}:[0-9a-f]{2}\.[0-7]$' || continue
    label=$drv
    if printf '%s' "$pci" | grep -Eq '^[0-9A-Fa-f]+:[0-9A-Fa-f]+$'; then
      label="$drv $pci"
    fi
    printf '%s|%s|%s\n' "$slot" "$drv" "$label" >> "$cards"
  done
  IFS=$old_ifs
  if [ "$found" -eq 0 ]; then
    cleanup_fdinfo
    printf '%s\n' "INTEL_ABSENT"
    return
  fi
  if [ ! -s "$cards" ]; then
    cleanup_fdinfo
    printf '%s\n' "INTEL_EMPTY"
    return
  fi
  fdinfo_max=4000
  if [ -n "${GPU_FDINFO_MAX_FILES+x}" ]; then
    case "$GPU_FDINFO_MAX_FILES" in
      ''|*[!0-9]*)
        cleanup_fdinfo
        printf '%s\n' "INTEL_EMPTY"
        return
        ;;
    esac
    fdinfo_max=$(fits_i64 "$GPU_FDINFO_MAX_FILES") || {
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    }
    if [ "$fdinfo_max" -lt 1 ] || [ "$fdinfo_max" -gt 4000 ]; then
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    fi
  fi
  interval_ms=200
  if [ -n "${GPU_FDINFO_INTERVAL_MS+x}" ]; then
    case "$GPU_FDINFO_INTERVAL_MS" in
      ''|*[!0-9]*)
        cleanup_fdinfo
        printf '%s\n' "INTEL_EMPTY"
        return
        ;;
    esac
    interval_ms=$(fits_i64 "$GPU_FDINFO_INTERVAL_MS") || {
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    }
    if [ "$interval_ms" -lt 1 ] || [ "$interval_ms" -gt 1000 ]; then
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    fi
  fi
  fixture=0
  if [ -n "$GPU_FDINFO_ROOT_2" ]; then
    fixture=1
    if [ ! -d "$GPU_FDINFO_ROOT_2" ]; then
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    fi
    case "${GPU_FDINFO_INTERVAL_NS-}" in
      ''|*[!0-9]*)
        cleanup_fdinfo
        printf '%s\n' "INTEL_EMPTY"
        return
        ;;
    esac
    interval_ns=$(fits_i64 "$GPU_FDINFO_INTERVAL_NS") || {
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    }
    if [ "$interval_ns" -le 0 ] || [ "$interval_ns" -gt 3000000000 ]; then
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    fi
  fi
  write_fdinfo_awk
  t0=$(now_ns)
  t0=$(fits_i64 "$t0" 2>/dev/null || true)
  if [ -z "$t0" ]; then
    cleanup_fdinfo
    printf '%s\n' "INTEL_EMPTY"
    return
  fi
  snap1=$fdinfo_tmp/snap1
  bad1=$fdinfo_tmp/bad1
  scan_proc "$proc_root" "$snap1" "$bad1"
  scan_code=$?
  if [ "$scan_code" -ne 0 ]; then
    cleanup_fdinfo
    printf '%s\n' "INTEL_EMPTY"
    return
  fi
  t1=$(fits_i64 "$(now_ns)" 2>/dev/null || true)
  if [ -z "$t1" ] || [ "$t1" -lt "$t0" ]; then
    cleanup_fdinfo
    printf '%s\n' "INTEL_EMPTY"
    return
  fi
  first_span=$((t1 - t0))
  if [ "$first_span" -gt 1500000000 ]; then
    cleanup_fdinfo
    printf '%s\n' "INTEL_EMPTY"
    return
  fi
  if [ "$fixture" -eq 1 ]; then
    snap2=$fdinfo_tmp/snap2
    bad2=$fdinfo_tmp/bad2
    scan_proc "$GPU_FDINFO_ROOT_2" "$snap2" "$bad2"
    scan_code=$?
    if [ "$scan_code" -ne 0 ]; then
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    fi
  else
    sec=$(awk -v ms="$interval_ms" 'BEGIN { printf "%.3f", ms / 1000 }')
    sleep "$sec" || {
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    }
    t2=$(fits_i64 "$(now_ns)" 2>/dev/null || true)
    if [ -z "$t2" ] || [ "$t2" -le "$t0" ]; then
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    fi
    interval_ns=$((t2 - t0))
    if [ "$interval_ns" -le 0 ] || [ "$interval_ns" -gt 3000000000 ]; then
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    fi
    snap2=$fdinfo_tmp/snap2
    bad2=$fdinfo_tmp/bad2
    scan_proc "$proc_root" "$snap2" "$bad2"
    scan_code=$?
    if [ "$scan_code" -ne 0 ]; then
      cleanup_fdinfo
      printf '%s\n' "INTEL_EMPTY"
      return
    fi
  fi
  t3=$(fits_i64 "$(now_ns)" 2>/dev/null || true)
  if [ -z "$t3" ] || [ "$t3" -lt "$t0" ]; then
    cleanup_fdinfo
    printf '%s\n' "INTEL_EMPTY"
    return
  fi
  if [ $((t3 - t0)) -gt 3500000000 ]; then
    cleanup_fdinfo
    printf '%s\n' "INTEL_EMPTY"
    return
  fi
  LC_ALL=C sort -o "$fdinfo_tmp/s1" "$snap1"
  LC_ALL=C sort -o "$fdinfo_tmp/s2" "$snap2"
  join -1 1 -2 1 "$fdinfo_tmp/s1" "$fdinfo_tmp/s2" > "$fdinfo_tmp/pairs" 2>/dev/null || true
  lines=""
  nlines=0
  while IFS='|' read -r slot drv label; do
    [ -n "$slot" ] || continue
    if grep -Fxq "$slot $drv" "$bad1" || grep -Fxq "$slot $drv" "$bad2"; then
      continue
    fi
    one=$fdinfo_tmp/one
    awk -v p="$slot" -v d="$drv" '
      {
        split($1, a, "|")
        if (a[1] == p && a[2] == d) print
      }
    ' "$fdinfo_tmp/pairs" > "$one"
    pct=$(card_percent "$drv" "$one" "$interval_ns") || continue
    row="$label, [N/A], $pct, [N/A], [N/A], [N/A]"
    if [ "$nlines" -eq 0 ]; then
      lines=$row
    else
      lines="$lines
$row"
    fi
    nlines=$((nlines + 1))
  done < "$cards"
  cleanup_fdinfo
  if [ "$nlines" -eq 0 ]; then
    printf '%s\n' "INTEL_EMPTY"
    return
  fi
  printf '%s\n' "INTEL"
  printf '%s\n' "$lines"
  printf '%s\n' "ENDINTEL"
}

nvidia_hit=0
smi=$(command -v nvidia-smi 2>/dev/null || true)
if [ -z "$smi" ]; then
  printf '%s\n' "NVIDIA_ABSENT"
else
  raw=$("$smi" --query-gpu=name,temperature.gpu,utilization.gpu,memory.used,memory.total,power.draw --format=csv,noheader,nounits 2>/dev/null)
  code=$?
  trimmed=$(printf '%s\n' "$raw" | awk 'NF { print }')
  if [ "$code" -ne 0 ]; then
    printf '%s\n' "NVIDIA_ABSENT"
  elif [ -z "$trimmed" ]; then
    printf '%s\n' "NVIDIA_EMPTY"
  else
    printf '%s\n' "NVIDIA"
    printf '%s\n' "$trimmed"
    printf '%s\n' "ENDNVIDIA"
    nvidia_hit=1
  fi
fi
if [ "$nvidia_hit" -eq 0 ]; then
  amd_out=$(emit_amdgpu "$sysfs_root")
  printf '%s\n' "$amd_out"
  amd_hit=0
  if printf '%s\n' "$amd_out" | grep -qx 'AMDGPU'; then
    amd_hit=1
  fi
  if [ "$amd_hit" -eq 0 ]; then
    emit_intel "$sysfs_root"
  fi
fi
printf '%s\n' "ENGINE_ABSENT"
printf '%s\n' "MEMORY_ABSENT"
printf '%s\n' "END"
exit 0
