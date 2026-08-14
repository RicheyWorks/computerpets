#!/bin/sh
set -eu
cd "$(dirname "$0")/desktop"
if [ ! -d node_modules ]; then
  npm install
fi
npm start
