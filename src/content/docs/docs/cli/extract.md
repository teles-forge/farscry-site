---
title: farscry extract
description: Convert a screenshot into structured VASP context.
---

The default command. Converts any screenshot into a typed VASP output with screen classification, UI tree, and affordances.

Usage

```bash
farscry <image>
farscry <image> [options]
cat <image> | farscry
```

Examples

```bash
Single image
farscry screenshot.png

From stdin
cat screenshot.png | farscry

Batch - parallel processing via rayon
farscry *.png
farscry img1.png img2.png img3.png

JSON output
farscry screenshot.png --json

Save to file
farscry screenshot.png -o context.vasp

Affordances only
farscry screenshot.png --affordances

One-line workflow context
farscry screenshot.png --context

Explicit language
farscry screenshot.png --lang por

Multi-language
farscry screenshot.png --lang eng+por
```

Options

| Flag | Default | Description |
|---|---|---|
| `--json` | false | Output JSON instead of VASP |
| `-o <file>` | stdout | Write output to file |
| `--affordances` | false | Output only interactive elements |
| `--context` | false | Output only the one-line `workflow_context` |
| `--text-only` | false | Suppress image forwarding to workflow |
| `--lang <code>` | auto | Force language (e.g. `eng`, `por`, `eng+por`) |
| `--max-size <n>mb` | 10mb | Override 10MB input size limit |
| `-v` | false | Verbose - show processing steps |
| `--debug` | false | Full debug output to stderr |

Output format

See [VASP Overview](/docs/vasp/overview) for the full schema.

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
delta_from: null
screen_type: error|config|terminal|conversation|ui|unknown
confidence: high|medium|low|none
lang: eng
workflow_context: "<one-line summary>"

ui_tree:
  ...

affordances:
  ...
```

Supported input formats

| Format | Magic bytes |
|---|---|
| PNG | `89 50 4E 47` |
| JPEG | `FF D8 FF` |
| WebP | `52 49 46 46` |
| GIF | `47 49 46 38` |

Input validation uses magic bytes - file extension is ignored.

Exit codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | Input error (file not found, wrong format, too large) |
| 2 | Processing error (OCR failed) |
| 3 | Configuration error (language not installed) |

Performance

| Platform | Target latency |
|---|---|
| Apple Silicon M2+ (CoreML) | 180ms |
| x86 CPU (ORT optimizations) | ~120ms |

First run downloads OCR assets (~12MB). Subsequent runs use the local cache. Use `farscry serve --mcp` to keep OCR engines warm and eliminate cold-start overhead.
