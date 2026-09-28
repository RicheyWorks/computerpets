#!/bin/sh
# Mac and Linux start. Same checks as desktop.ps1: Node first, then the pieces, then the overlay.
set -eu
cd "$(dirname "$0")/desktop"

stop_start() {
  printf '%s\n' "$1"
  exit 1
}

# 1. Node runs the overlay. Check it is here and new enough before anything else.
command -v node >/dev/null 2>&1 || stop_start "Node is not installed yet. Install the LTS from https://nodejs.org (version 22 or newer), open a new Terminal in the computerpets folder, and run sh desktop.sh again."
command -v npm >/dev/null 2>&1 || stop_start "npm is missing. It comes with Node. Install the LTS from https://nodejs.org again, open a new Terminal in the computerpets folder, and run sh desktop.sh again."
version=$(node -v 2>/dev/null || true)
major=$(printf '%s' "$version" | sed -n 's/^v\([0-9][0-9]*\)\..*/\1/p')
if [ -z "$major" ] || [ "$major" -lt 22 ]; then
  stop_start "This Node is ${version:-unknown}. The pets need version 22 or newer. Install the LTS from https://nodejs.org, open a new Terminal in the computerpets folder, and run sh desktop.sh again."
fi

# 2. The pieces. node_modules alone is not enough: a get-the-pieces run that was closed halfway
#    leaves the folder without Electron. The stamp is written only after npm install finishes,
#    and a newer package.json (after a pull) asks for the pieces again.
electron=node_modules/electron/path.txt
stamp=node_modules/.computerpets-installed
pieces() {
  if [ ! -f "$electron" ]; then echo missing
  elif [ ! -f "$stamp" ]; then echo unfinished
  elif [ package.json -nt "$stamp" ]; then echo changed
  else echo ready
  fi
}
state=$(pieces)

# 3. The pictures. The overlay's pet pictures are stored with Git LFS. A Git without LFS (common on
#    Mac and Linux) copies small text pointers instead, and every pet would be invisible.
picture=renderer/sprites/crow/idle/1.png
pictures() {
  if [ ! -f "$picture" ]; then echo missing
  elif head -c 23 "$picture" | grep -q '^version https://git-lfs'; then echo lfs-pointers
  else echo ready
  fi
}
seen=$(pictures)

# --check says what the start sees and changes nothing: no install, no overlay.
# The last line says what to type next, in plain words (the pictures first: the start stops there).
if [ "${1:-}" = "--check" ]; then
  echo "ok: node $version"
  echo "pieces: $state"
  echo "pictures: $seen"
  if [ "$seen" != ready ]; then
    echo "next: The pet pictures are not here yet. Install Git LFS from https://git-lfs.com, then in the computerpets folder type git lfs install and then git lfs pull. Then type sh desktop.sh and press Enter."
  else
    case "$state" in
      missing) echo "next: Type sh desktop.sh and press Enter. It gets the pieces (a few minutes the first time), then the pets come on." ;;
      unfinished) echo "next: Type sh desktop.sh and press Enter. It finishes getting the pieces, then the pets come on." ;;
      changed) echo "next: Type sh desktop.sh and press Enter. It gets the new pieces, then the pets come on." ;;
      *) echo "next: Type sh desktop.sh and press Enter to turn the pets on." ;;
    esac
  fi
  exit 0
fi

[ "$seen" = ready ] || stop_start "The pet pictures did not download. They come through Git LFS, which this Git does not have yet. Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull, and run sh desktop.sh again."

if [ "$state" != ready ]; then
  echo "Getting the pieces (npm install). The first time can take a few minutes. Leave this window open."
  npm install || stop_start "npm install did not finish. Check the internet, then run sh desktop.sh again. It gets the pieces again."
  [ -f "$electron" ] || npm rebuild electron || true
  [ -f "$electron" ] || stop_start "The overlay piece (Electron) did not download. Check the internet, delete the desktop/node_modules folder, and run sh desktop.sh again."
  date > "$stamp"
fi

# 4. Turn the pets on. npm start is electron .
exec npm start
