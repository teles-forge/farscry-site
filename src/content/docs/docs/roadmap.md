---
title: Roadmap
description: What is shipped, what is coming, and why.
---

## v0.4.0 — Current release

The recording and observability layer. Everything below is shipped and in the current binary.

| Feature | Status |
|---|---|
| `farscry extract` — screenshot to VASP structured text | Released |
| `farscry diff` — semantic delta between two screenshots | Released |
| `farscry annotate` — bounding box overlay on screenshots | Released |
| `farscry pack` — directory of screenshots → deduplicated `.vasf` | Released |
| `farscry timeline` — replay unique states from a `.vasf` session | Released |
| `farscry info` — session statistics and dedup ratio | Released |
| `farscry serve --mcp` — 38ms warm MCP daemon | Released |
| `farscry hook` — zero-friction terminal recording via shell hook | Released |
| `farscry record --daemon --global` — single daemon for all terminals | Released |
| `farscry session --list` / `--latest` — list and inspect sessions | Released |
| Zero-copy pHash — 22MB daemon RSS (macOS, ScreenCaptureKit) | Released |
| Linux pHash via X11 shared memory — 11MB VmRSS (Docker + Xvfb) | Released |
| Smart paste: `farscry setup` auto-configures Cmd+V in terminals | Released |
| npm, pip, Homebrew, crates.io distribution | Released |
| VASP 1.0-draft open RFC | Released |

---

## v0.5.0 — Next

The agent-aware layer. farscry stops being a recorder and becomes an active observer.

### `farscry augment`

Injects silent failure warnings directly into agent context via MCP — zero code changes to the agent.

If the previous action had no visual effect (StateId before == StateId after), the next `farscry_extract` call returns a structured warning alongside the VASP output. The agent knows it may be in a broken state before taking another action.

### `farscry watch session.vasf --detect`

Real-time silent failure and visual loop detection on a live or replayed session.

```bash
farscry watch session.vasf --detect
# streams structured events as patterns are detected
```

### Semantic export

Webhook, Slack, and JSONL log delivery on session failure events — structured text only, no pixels sent.

### `farscry watch-dir <path>`

File-system watch (FSEvents on macOS, inotify on Linux) for agent screenshot directories. Emits VASP output as new screenshots appear. No polling required.

### `farscry diff --json`

Structured JSON diff output for tooling integration.

```bash
farscry diff before.png after.png --json | jq .appeared
```

---

## v0.6.0 — Planned

### VASP adapters

Native Playwright and OpenAI Vision support — VASP output without running farscry's OCR pipeline.

For teams already using Claude computer-use, Playwright, or OpenAI Vision: they get `state_id`, typed elements, and affordances without changing their extraction layer.

### `farscry install-lang`

Multilingual OCR models via CDN — Portuguese, Chinese, Japanese, Russian, Korean, Arabic.

```bash
farscry install-lang por    # Portuguese
farscry install-lang jpn    # Japanese
farscry extract screen.png --lang eng+por
```

### Per-window capture when minimized

`farscry record` captures the specific terminal window even when it is minimized or behind other windows, using `SCContentFilter`.

### Screen-lock awareness in `farscry serve`

When the display sleeps, `farscry serve` maintains the last known `StateId` rather than dropping state. Agents resume correctly after wake.

---

## What is NOT on the roadmap

- Cloud inference — farscry is local-only by design
- GUI app — CLI and MCP are the interface
- Plugin ecosystem — premature until core protocol is stable

---

Changelog and full history: [github.com/teles-forge/farscry/CHANGELOG.md](https://github.com/teles-forge/farscry/blob/main/CHANGELOG.md)
