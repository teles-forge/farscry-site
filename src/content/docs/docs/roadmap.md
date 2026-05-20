---
title: Roadmap
description: What is shipped, what is coming, and why.
---

## v0.4.0: Current release

The recording and observability layer. Everything below is shipped and in the current binary.

| Feature | Status |
|---|---|
| `farscry extract`: screenshot to VASP structured text | Released |
| `farscry diff`: semantic delta between two screenshots | Released |
| `farscry annotate`: bounding box overlay on screenshots | Released |
| `farscry pack`: directory of screenshots to deduplicated `.vasf` | Released |
| `farscry timeline`: replay unique states from a `.vasf` session | Released |
| `farscry info`: session statistics and dedup ratio | Released |
| `farscry serve --mcp`: 38ms warm MCP daemon | Released |
| `farscry hook`: zero-friction terminal recording via shell hook | Released |
| `farscry record --daemon --global`: single daemon for all terminals | Released |
| `farscry session --list` / `--latest`: list and inspect sessions | Released |
| Zero-copy pHash, 22MB daemon RSS (macOS, ScreenCaptureKit) | Released |
| Linux pHash via X11 shared memory, 11MB VmRSS (Docker + Xvfb) | Released |
| Smart paste: `farscry setup` auto-configures Cmd+V in terminals | Released |
| npm, pip, Homebrew, crates.io distribution | Released |
| VASP 1.0-draft open RFC | Released |

---

## v0.5.0: Current release

The agent-aware layer. farscry now detects silent failures inline and tells the agent immediately.

### `farscry augment`: shipped

Silent failure detection inline in every MCP response. Zero code changes to the agent. Zero retraining.

```
1. farscry_mark_action()      ← register state before action
2. computer_use_action(...)   ← click, type, keypress
3. farscry_extract(screenshot)

Response when action had no effect:
  ⚠ SILENT_FAILURE DETECTED
    action had no visual effect
    state_id_before: phash:8f4a2c9d
    state_id_after:  phash:8f4a2c9d
    recommendation: try a different approach
```

### `farscry_mark_action` MCP tool: shipped

Explicit action marker. Call before any computer-use action to register the current state.

### `farscry analyze`: shipped

Measure AER (Action Effect Rate) and VLR (Visual Loop Rate) across session recordings.

```bash
farscry analyze sessions/*.vasf --failed sessions/failed/*.vasf
```

### `farscry mark-action` CLI: shipped

Write an action marker to the active MCP session from the terminal. Used automatically by `farscry hook`.

### `farscry diff --json`: shipped

Structured JSON diff output for tooling integration.

```bash
farscry diff before.png after.png --json | jq .appeared
```

---

## v0.6.0: Planned

### VASP adapters

Native Playwright and OpenAI Vision support. VASP output without running farscry's OCR pipeline.

For teams already using Claude computer-use, Playwright, or OpenAI Vision: they get `state_id`, typed elements, and affordances without changing their extraction layer.

### `farscry install-lang`

Multilingual OCR models via CDN: Portuguese, Chinese, Japanese, Russian, Korean, Arabic.

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

- Cloud inference: farscry is local-only by design
- GUI app: CLI and MCP are the interface
- Plugin ecosystem: premature until core protocol is stable

---

Changelog and full history: [github.com/teles-forge/farscry/CHANGELOG.md](https://github.com/teles-forge/farscry/blob/main/CHANGELOG.md)
