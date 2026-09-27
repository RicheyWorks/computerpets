import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  P2PRoom,
  defaultIceServers,
  iceServersForRoom,
  iceUrlHost,
  stunNetLine,
} from "../src/lib/multiplayer/p2p.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const p2pSrc = readFileSync(join(root, "src/lib/multiplayer/p2p.ts"), "utf8");
const indexSrc = readFileSync(join(root, "src/lib/multiplayer/index.ts"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");

const PUBLIC_STUN = /stun\.l\.google\.com|stun\.cloudflare\.com|VITE_STUN_URLS/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name.startsWith(".")) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, out);
    else if (/\.(ts|tsx|js|cjs|mjs|html|py)$/.test(name)) out.push(path);
  }
  return out;
}

test("public STUN is not a silent default", () => {
  assert.doesNotMatch(p2pSrc, PUBLIC_STUN);
  assert.doesNotMatch(indexSrc, PUBLIC_STUN);
  assert.deepEqual(defaultIceServers(), []);
  assert.deepEqual(
    iceServersForRoom(
      [{ urls: ["stun:stun.example.test:19302", "stun:other.example.test:3478"] }],
      undefined,
    ),
    [],
  );
  assert.deepEqual(
    iceServersForRoom([{ urls: "stun:stun.example.test:19302" }], "a room, with no host line"),
    [],
  );
});

test("a stun or turn host is kept only when the painted line names it", () => {
  const host = "stun.example.test";
  const other = "turn.example.test";
  const line = `${stunNetLine(host)} ${stunNetLine("not-the-other")}`;
  assert.equal(iceUrlHost("stun:user:secret@Stun.Example.Test:19302"), host);
  assert.equal(iceUrlHost("turns:turn.example.test:5349?transport=tcp"), other);
  assert.equal(iceUrlHost("https://stun.example.test/ice"), null);
  const kept = iceServersForRoom(
    [
      {
        urls: [`stun:${host}:19302`, `turn:${other}:3478`],
        username: "keeper",
        credential: "not-sent-without-the-line",
      },
    ],
    line,
  );
  assert.deepEqual(kept, [{ urls: [`stun:${host}:19302`], username: "keeper", credential: "not-sent-without-the-line" }]);
  const both = iceServersForRoom(
    [{ urls: [`stuns:${host}:5349`, `turns:${other}:5349`] }],
    `${stunNetLine(host)} ${stunNetLine(other)}`,
  );
  assert.deepEqual(both, [{ urls: [`stuns:${host}:5349`, `turns:${other}:5349`] }]);
  assert.equal(line.includes(stunNetLine("l.google.com")), false);
  assert.equal(
    stunNetLine(host),
    "This asks stun.example.test, a website that helps computers find each other, so you can play together. This computer's internet address goes to stun.example.test, like visiting any website.",
  );
  assert.doesNotMatch(stunNetLine(host), /stun request|as any client/);
  assert.equal(`${stunNetLine("stun.l.google.com")}`.includes(stunNetLine("l.google.com")), false);
});

test("opening the house does not construct a room", () => {
  const roots = [
    join(root, "src/routes"),
    join(root, "src/components"),
    join(repo, "desktop"),
    join(repo, "client"),
  ];
  const hits = [];
  for (const dir of roots) {
    for (const path of walk(dir)) {
      const src = readFileSync(path, "utf8");
      if (src.includes("new P2PRoom") || src.includes("defaultIceServers(") || PUBLIC_STUN.test(src)) {
        hits.push(path);
      }
    }
  }
  assert.deepEqual(hits, []);
  assert.match(
    p2pSrc,
    /iceServers: iceServersForRoom\(this\.opts\.iceServers \?\? defaultIceServers\(\), this\.opts\.paintedLine\)/,
  );
  assert.equal([...p2pSrc.matchAll(/new RTCPeerConnection/g)].length, 1);
  const room = new P2PRoom({ room: "house", selfId: "keeper" });
  assert.equal(room.peerList().length, 0);
  const keys = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);
  assert.equal(keys.length, 221);
});
