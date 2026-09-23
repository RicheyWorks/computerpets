#!/bin/sh
# Mac GPU probe. Reads IOAccelerator PerformanceStatistics and prints the
# line protocol the desktop parsers already understand.
# A missing ioreg is ABSENT, not a zero. A dictionary with no accepted field
# is EMPTY. Temperature and power are not in this dictionary, so those fields
# stay [N/A]. Alloc system memory is not capacity and is not copied.
# Renderer and tiler percents are not device utilization.
# Linux amdgpu and Intel sysfs are a later probe, not this script.
ioreg_bin=$(command -v ioreg 2>/dev/null || true)
if [ -z "$ioreg_bin" ]; then
  printf '%s\n' "NVIDIA_ABSENT" "ENGINE_ABSENT" "MEMORY_ABSENT" "END"
  exit 0
fi
raw=$("$ioreg_bin" -r -w 0 -c IOAccelerator -l 2>/dev/null)
code=$?
if [ "$code" -ne 0 ]; then
  printf '%s\n' "NVIDIA_ABSENT" "ENGINE_ABSENT" "MEMORY_ABSENT" "END"
  exit 0
fi
trimmed=$(printf '%s\n' "$raw" | awk 'NF { found = 1 } END { if (found) print "yes" }')
if [ -z "$trimmed" ]; then
  printf '%s\n' "NVIDIA_EMPTY" "ENGINE_ABSENT" "MEMORY_ABSENT" "END"
  exit 0
fi
parsed=$(printf '%s\n' "$raw" | awk '
function skip_ws(s, i,    n, c) {
  n = length(s)
  while (i <= n) {
    c = substr(s, i, 1)
    if (c != " " && c != "\t" && c != "\n" && c != "\r") return i
    i++
  }
  return i
}
function block_end(s, i,    n, depth, c) {
  n = length(s)
  depth = 0
  while (i <= n) {
    c = substr(s, i, 1)
    if (c == "{") depth++
    else if (c == "}") {
      depth--
      if (depth == 0) return i
    }
    i++
  }
  return 0
}
function read_quoted(s, i,    n, c, out) {
  n = length(s)
  out = ""
  i++
  while (i <= n) {
    c = substr(s, i, 1)
    if (c == "\"") {
      qtext = out
      qpos = i + 1
      return
    }
    out = out c
    i++
  }
  qtext = ""
  qpos = n + 1
}
function rindex(s, needle,    from, pos, last, chunk) {
  last = 0
  from = 1
  while (from <= length(s)) {
    chunk = substr(s, from)
    pos = index(chunk, needle)
    if (pos == 0) break
    last = from + pos - 1
    from = last + length(needle)
  }
  return last
}
function is_num(s) {
  return s ~ /^-?[0-9]+(\.[0-9]+)?$/
}
function bytes_to_mib(n,    mib) {
  if (n == 0) return "0"
  if (n < 524288) return ""
  mib = int((n + 524288) / 1048576)
  return sprintf("%.0f", mib)
}
function clean_name(n) {
  gsub(/\r/, "", n)
  gsub(/\n/, "", n)
  gsub(/\t/, " ", n)
  gsub(/^[ ]+/, "", n)
  gsub(/[ ]+$/, "", n)
  return n
}
function class_token(s, at,    i, n, c, name) {
  i = at + 7
  n = length(s)
  name = ""
  while (i <= n) {
    c = substr(s, i, 1)
    if (c == "," || c == " " || c == ">" || c == "\n" || c == "\r") break
    name = name c
    i++
  }
  return name
}
function model_in(region,    p, i, c) {
  p = rindex(region, "\"model\"")
  if (p == 0) return ""
  i = skip_ws(region, p + 7)
  if (substr(region, i, 1) != "=") return ""
  i = skip_ws(region, i + 1)
  c = substr(region, i, 1)
  if (c == "\"") {
    read_quoted(region, i)
    return qtext
  }
  if (substr(region, i, 2) == "<\"") {
    read_quoted(region, i + 1)
    return qtext
  }
  return ""
}
function display_name(prefix,    class_at, model, class_name) {
  class_at = rindex(prefix, "<class ")
  if (class_at == 0) return ""
  class_name = class_token(prefix, class_at)
  model = model_in(substr(prefix, class_at))
  if (model != "") return clean_name(model)
  if (class_name != "") return clean_name(class_name)
  return ""
}
function parse_stats(inner,    i, n, c, key, val, end) {
  st_util = ""
  st_activity = ""
  st_in_use = ""
  st_vram_used = ""
  st_vram_free = ""
  i = 1
  n = length(inner)
  while (i <= n) {
    i = skip_ws(inner, i)
    if (i > n) break
    c = substr(inner, i, 1)
    if (c == ",") { i++; continue }
    if (c != "\"") { i++; continue }
    read_quoted(inner, i)
    key = qtext
    i = skip_ws(inner, qpos)
    if (substr(inner, i, 1) == "=") i = skip_ws(inner, i + 1)
    if (i > n) break
    c = substr(inner, i, 1)
    if (c == "\"") {
      read_quoted(inner, i)
      val = qtext
      i = qpos
    } else if (c == "{") {
      end = block_end(inner, i)
      if (end == 0) break
      i = end + 1
      continue
    } else if (c == "<") {
      end = index(substr(inner, i), ">")
      if (end == 0) break
      i = i + end
      continue
    } else {
      val = ""
      while (i <= n) {
        c = substr(inner, i, 1)
        if (c == "," || c == "}" || c == " " || c == "\t" || c == "\n" || c == "\r") break
        val = val c
        i++
      }
    }
    if (!is_num(val)) continue
    if ((val + 0) < 0) continue
    if (key == "Device Utilization %" && (val + 0) <= 100) st_util = val
    else if (key == "GPU Activity(%)" && (val + 0) <= 100) st_activity = val
    else if (key == "In use system memory") st_in_use = val
    else if (key == "vramUsedBytes") st_vram_used = val
    else if (key == "vramFreeBytes") st_vram_free = val
  }
}
function field_or_na(v) {
  if (v == "") return "[N/A]"
  return v
}
BEGIN { buf = "" }
{
  if (buf == "") buf = $0
  else buf = buf "\n" $0
}
END {
  s = buf
  n = length(s)
  from = 1
  count = 0
  lines = ""
  mark = "\"PerformanceStatistics\""
  while (from <= n) {
    pos = index(substr(s, from), mark)
    if (pos == 0) break
    pos = from + pos - 1
    i = skip_ws(s, pos + length(mark))
    if (substr(s, i, 1) != "=") {
      from = pos + 1
      continue
    }
    i = skip_ws(s, i + 1)
    if (substr(s, i, 1) != "{") {
      from = pos + 1
      continue
    }
    end = block_end(s, i)
    if (end == 0) break
    parse_stats(substr(s, i + 1, end - i - 1))
    util = ""
    if (st_util != "") util = st_util
    else if (st_activity != "") util = st_activity
    used_m = ""
    total_m = ""
    if (st_vram_used != "" && st_vram_free != "") {
      used_m = bytes_to_mib(st_vram_used + 0)
      total_m = bytes_to_mib((st_vram_used + 0) + (st_vram_free + 0))
    } else if (st_in_use != "") {
      used_m = bytes_to_mib(st_in_use + 0)
    } else if (st_vram_used != "") {
      used_m = bytes_to_mib(st_vram_used + 0)
    }
    if (util != "" || used_m != "" || total_m != "") {
      name = display_name(substr(s, 1, pos - 1))
      line = name ", [N/A], " field_or_na(util) ", " field_or_na(used_m) ", " field_or_na(total_m) ", [N/A]"
      if (count == 0) lines = line
      else lines = lines "\n" line
      count++
    }
    from = end + 1
  }
  if (count == 0) print "NVIDIA_EMPTY"
  else {
    print "NVIDIA"
    print lines
    print "ENDNVIDIA"
  }
  print "ENGINE_ABSENT"
  print "MEMORY_ABSENT"
  print "END"
}
' 2>/dev/null)
case "$parsed" in
  *"END"*) printf '%s\n' "$parsed" ;;
  *) printf '%s\n' "NVIDIA_ABSENT" "ENGINE_ABSENT" "MEMORY_ABSENT" "END" ;;
esac
exit 0
