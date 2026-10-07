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
#    leaves it unfinished. npm writes node_modules/.package-lock.json last, when an install finishes
#    (this script's stamp says the same), so a plain npm install counts too; a newer package.json
#    (after a pull) asks for the pieces again. Electron 42 and newer do not download Electron itself
#    during npm install: it comes the first time Electron runs (the first npm start), so the pieces
#    are ready only once node_modules/electron/path.txt names an Electron that is really there.
electron=node_modules/electron/path.txt
finished=node_modules/.package-lock.json
stamp=node_modules/.computerpets-installed
electron_here() { [ -f "$electron" ] && [ -f "node_modules/electron/dist/$(cat "$electron")" ]; }
# "$1 is newer than $2", where a missing $2 counts as older. dash (Ubuntu's sh) says false for -nt when $2
# is missing, bash says true, so a missing stamp would hide a changed package.json on Linux.
newer() { [ -f "$1" ] && { [ ! -f "$2" ] || [ "$1" -nt "$2" ]; }; }
pieces() {
  if [ ! -f node_modules/electron/package.json ]; then echo missing
  elif [ ! -f "$finished" ] && [ ! -f "$stamp" ]; then echo unfinished
  elif newer package.json "$finished" && newer package.json "$stamp"; then echo changed
  elif ! electron_here; then echo unfinished
  else echo ready
  fi
}
state=$(pieces)

# 3. The pictures. The overlay's pet pictures are stored with Git LFS. A Git without LFS (common on
#    Mac and Linux) copies small text pointers instead, and every pet would be invisible. A git lfs pull
#    that stopped partway (a lost connection, a full disk) leaves some pets as pointers, and those pets
#    would be invisible too, so every pet's folder is looked at, not only the crow's. A pointer is a small
#    text file (about 130 bytes) and every real picture is over 10 KB, so only files under 1 KB are
#    opened: one find and one grep, fast enough for every start.
sprites=renderer/sprites
picture=renderer/sprites/crow/idle/1.png
pointer_pets() {
  find "$sprites" -type f -name '*.png' -size -1024c -exec grep -l '^version https://git-lfs' {} + 2>/dev/null |
    sed "s|^$sprites/||; s|/.*||" | sort -u | wc -l | tr -d ' '
}
all_pets() {
  find "$sprites" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' '
}
gone=0
pets=0
if [ -f "$picture" ]; then
  gone=$(pointer_pets)
  pets=$(all_pets)
fi
pictures() {
  if [ ! -f "$picture" ]; then echo missing
  elif [ "$gone" -eq 0 ]; then echo ready
  elif [ "$gone" -ge "$pets" ]; then echo lfs-pointers
  else echo partial
  fi
}
seen=$(pictures)
# "12 of 221 pets are still missing their pictures" (one pet: "is ... its").
if [ "$gone" -eq 1 ]; then
  still="1 of $pets pets is still missing its pictures"
else
  still="$gone of $pets pets are still missing their pictures"
fi
# Git LFS may be here already (installed after the clone, or a pull that stopped): then the words do not say to
# install it, only to fetch the pictures. Asked only when the pictures are not ready.
lfs_here() {
  if git lfs version >/dev/null 2>&1; then echo yes; else echo no; fi
}
lfs=no
[ "$seen" = ready ] || lfs=$(lfs_here)

# 4. A screen to put the pets on (Linux). Started over SSH or from a text console there is none, and Electron
#    stopped with "Missing X server or $DISPLAY" and a crash (SIGSEGV) instead of words. A Mac always has one.
screen_here() {
  if [ "$(uname -s 2>/dev/null)" != Linux ]; then echo ok
  elif [ -n "${WAYLAND_DISPLAY:-}" ]; then echo wayland
  elif [ -n "${DISPLAY:-}" ]; then echo x11
  else echo none
  fi
}
display=$(screen_here)
no_screen="There is no desktop screen here for the pets: DISPLAY and WAYLAND_DISPLAY are empty, as in a Terminal over SSH or on a text console. Open a Terminal on your desktop, go to the computerpets folder, type sh desktop.sh and press Enter."

# --check says what the start sees and changes nothing: no install, no overlay.
# The last line says what to type next, in plain words (the pictures first, then the screen: the start stops there).
if [ "${1:-}" = "--check" ]; then
  echo "ok: node $version"
  echo "pieces: $state"
  echo "pictures: $seen"
  echo "display: $display"
  if [ "$seen" = partial ]; then
    echo "next: $still: Git LFS stopped before it fetched them all. In the computerpets folder type git lfs pull. Then type sh desktop.sh and press Enter."
  elif [ "$seen" != ready ] && [ "$lfs" = yes ]; then
    echo "next: The pet pictures are not here yet. Git LFS is installed but has not fetched them. In the computerpets folder type git lfs install and then git lfs pull. Then type sh desktop.sh and press Enter."
  elif [ "$seen" != ready ]; then
    echo "next: The pet pictures are not here yet. Install Git LFS from https://git-lfs.com, then in the computerpets folder type git lfs install and then git lfs pull. Then type sh desktop.sh and press Enter."
  elif [ "$display" = none ]; then
    echo "next: $no_screen"
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

[ "$seen" != partial ] || stop_start "$still. Git LFS stopped before it fetched them all. In the computerpets folder run git lfs pull, and run sh desktop.sh again."
[ "$seen" = ready ] || [ "$lfs" = no ] || stop_start "The pet pictures did not download. Git LFS is installed here, but it has not fetched them yet. In the computerpets folder run git lfs install and then git lfs pull, and run sh desktop.sh again."
[ "$seen" = ready ] || stop_start "The pet pictures did not download. They come through Git LFS, which this Git does not have yet. Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull, and run sh desktop.sh again."

[ "$display" != none ] || stop_start "$no_screen"

if [ "$state" != ready ]; then
  echo "Getting the pieces (npm install). The first time can take a few minutes. Leave this window open."
  npm install || stop_start "npm install did not finish. Check the internet, then run sh desktop.sh again. It gets the pieces again."
  if ! electron_here; then
    echo "Getting Electron, the overlay piece (about 100 MB). Leave this window open."
    node node_modules/electron/install.js || true
  fi
  electron_here || stop_start "The overlay piece (Electron) did not download. Check the internet, delete the desktop/node_modules folder, and run sh desktop.sh again."
  date > "$stamp"
fi

# 5. Turn the pets on. npm start is electron .
exec npm start
