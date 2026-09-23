#!/bin/sh
# Linux GPU probe. Same line protocol as desktop/gpu-probe.ps1.
# nvidia-smi prints name, temperature, utilization, memory, and power.
# Windows PDH engine and adapter-memory counters do not exist here, so those
# sections stay ABSENT. A missing tool is ABSENT, not a zero.
# amdgpu and Intel sysfs are not read. Mac does not run this script.
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
  fi
fi
printf '%s\n' "ENGINE_ABSENT"
printf '%s\n' "MEMORY_ABSENT"
printf '%s\n' "END"
exit 0
