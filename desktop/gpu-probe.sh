#!/bin/sh
# Linux GPU probe. Same CSV line as desktop/gpu-probe.ps1 and gpu-probe-mac.sh.
# nvidia-smi prints name, temperature, utilization, memory, and power.
# When that binary is missing, fails, or prints nothing, amdgpu sysfs may
# print the same line from gpu_busy_percent and mem_info_vram_used /
# mem_info_vram_total. Temperature and power stay [N/A] on that line.
# A missing file, a failed read, or a non-numeric file stays [N/A], not a zero.
# A VRAM total of zero is not capacity. Bytes under half a MiB stay [N/A]
# unless the file itself is zero. VRAM busyness, GTT, and hwmon are not
# copied. Intel sysfs is not read. Windows PDH sections stay ABSENT.
# GPU_SYSFS_ROOT overrides /sys/class/drm so a fixture can stand in for a card.
sysfs_root=${GPU_SYSFS_ROOT:-/sys/class/drm}

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
  emit_amdgpu "$sysfs_root"
fi
printf '%s\n' "ENGINE_ABSENT"
printf '%s\n' "MEMORY_ABSENT"
printf '%s\n' "END"
exit 0
