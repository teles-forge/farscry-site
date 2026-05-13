---
title: farscry extract
description: Convert a screenshot into structured VASP context.
---

Converts any screenshot into a typed VASP output with screen classification, UI tree, and affordances.

Usage

```bash
farscry extract <image>
farscry extract <image> [options]
cat <image> | farscry extract
farscry extract --from-clipboard
```

Examples

```bash
# Single image
farscry extract screenshot.png

# From stdin
cat screenshot.png | farscry extract

# From clipboard (Cmd+Shift+4 on macOS)
farscry extract --from-clipboard

# Batch (parallel processing)
farscry extract *.png
farscry extract img1.png img2.png img3.png

# JSON output
farscry extract screenshot.png --json

# Save to file
farscry extract screenshot.png -o context.vasp

# Affordances only
farscry extract screenshot.png --affordances

# One-line agent_context summary
farscry extract screenshot.png --context

# Explicit language
farscry extract screenshot.png --lang por

# Multi-language
farscry extract screenshot.png --lang eng+por
```

Options

| Flag | Default | Description |
|---|---|---|
| `--from-clipboard` | false | Read image from system clipboard |
| `--json` | false | Output JSON instead of VASP |
| `-o <file>` | stdout | Write output to file |
| `--affordances` | false | Output only interactive elements |
| `--context` | false | Output only the one-line `agent_context` summary |
| `--text-only` | false | Suppress image forwarding to workflow |
| `--lang <code>` | auto | Force language (e.g. `eng`, `por`, `eng+por`) |
| `--max-size <n>mb` | 10mb | Override 10MB input size limit |
| `-v` | false | Verbose, show processing steps |
| `--debug` | false | Full debug output to stderr |

Output format

See [VASP Overview](/docs/vasp/overview) for the full schema.

```
=== farscry visual context ===
screen_type: config
state_id: phash:<16-char-hex>
confidence: high
lang: eng
agent_context: "<one-line summary>"
---
[top-center]   heading  "Payment Settings"
[middle-right] button   "Save Changes"   enabled:true
[bottom]       error    "Value must be ≤ 10000"

affordances:
  click → "Save Changes"  at (400,300)
  type  → "Max Value"     at (200,120)
```

Supported input formats

| Format | Magic bytes |
|---|---|
| PNG | `89 50 4E 47` |
| JPEG | `FF D8 FF` |
| WebP | `52 49 46 46` |
| GIF | `47 49 46 38` |
| TIFF | `49 49 2A 00` / `4D 4D 00 2A` |

Input validation uses magic bytes. File extension is ignored..

Exit codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | Input error (file not found, wrong format, too large) |
| 2 | Processing error (OCR failed) |
| 3 | Configuration error (language not installed) |

Performance

| Platform | Warm daemon | Cold CLI |
|---|---|---|
| Apple Silicon M-series (CoreML) | **38ms** | ~350ms |
| x86 CPU (ORT) | ~222ms | ~350ms |

First run downloads OCR assets (~12MB). Subsequent runs use the local cache. Use `farscry serve --mcp` to keep OCR engines warm and hit the 38ms figure consistently.
