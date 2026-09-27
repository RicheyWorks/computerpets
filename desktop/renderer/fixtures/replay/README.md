# Recorded feed replays

These files let the app harness replay the live desk feeds offline. The harness hands each file to the
real read, parse, and paint code through a fake fetch, then checks the words a keeper would see.
Nothing here is fetched during test-all.

Recorded on 2026-09-27 (PT) on the maintainer's Windows machine, then trimmed by hand:

| File | Recorded from | Trimmed to |
| --- | --- | --- |
| `forecast-seattle.json` | Open-Meteo forecast for 47.6, -122.3 (the URL `forecastUrl` builds) | Unchanged |
| `news-popular.rss` | Google News top stories RSS (`popularRssUrl`) | Channel title plus 3 items (title, link, date, source) |
| `news-topic-red-pandas.rss` | Google News RSS search for "red pandas" (`topicRssUrl`) | Channel title plus 3 items (title, link, date, source) |
| `news-featured.json` | Wikipedia featured feed for 2026/09/27 (`newsUrl`) | 2 "In the news" stories. Each keeps its story markup and a short first link |
| `gecko-simple-price.json` | CoinGecko simple price for the default coin list (`geckoManyUrl`) | The Solana entry is removed on purpose, so the replay proves a coin without a price shows "…" and no invented number |
| `yahoo-aapl.json` | Yahoo Finance chart for AAPL (`yahooUrl`) | The `meta` block only |
| `nft-cryptopunks.json` | CoinGecko NFT collection for cryptopunks (`nftUrl`) | Name, symbol, and floor price only |
| `gpu-win-nvidia.txt` | `desktop/gpu-probe.ps1` output on an RTX 4090 | The NVIDIA row, the non-zero engine rows, and the memory rows. Process ids are renumbered |

Built by hand, not recorded:

| File | Built from |
| --- | --- |
| `gpu-win-pdh.txt` | `gpu-win-nvidia.txt` with the NVIDIA block replaced by `NVIDIA_ABSENT`, to replay the Windows counter path. Read like Task Manager it is 4.2% (the video decode engine) |
| `gpu-win-two-adapters.txt` | The Windows counter format that `desktop/gpu-probe.ps1` prints, with synthetic numbers: two adapters (LUIDs `0x0000a001` and `0x0000b002`) that both report `phys_0`. The first is a small integrated adapter (512 MiB limit, 3D at 61.5%). The second is an 8 GiB card (12.5% 3D, 2 GiB used). Counters are grouped per LUID and the card with the most VRAM is shown: 12.5% and 2 GiB/8 GiB, with nothing mixed in from the other adapter |
| `gpu-linux-amdgpu.txt` | The `AMDGPU` block format that `desktop/gpu-probe.sh` prints. Synthetic numbers |
| `gpu-mac-ioaccelerator.txt` | The `NVIDIA` block format that `desktop/gpu-probe-mac.sh` prints, with `[N/A]` where a Mac has no reading. Synthetic numbers |
| `gpu-linux-absent.txt` | A probe that found no GPU. The line must read unread |

No file holds an API key, a token, a cookie, a user name, or a machine id. The feeds used here need no key.
Headlines, prices, and weather are a snapshot from that day and will not match today's feeds.