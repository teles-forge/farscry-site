---
title: VASP Overview
description: Visual Application State Protocol - the open standard for visual UI state in automation workflows.
---

**VASP** defines a common format for visual UI state: screen type, element tree, affordances, and diffs. farscry is the reference implementation.

The analogy

```
MCP  = how workflows connect to tools
VASP = how workflows understand visual state
```

Like MCP standardized tool connectivity for workflows, VASP standardizes visual state representation. Every automation framework that works with screenshots needs visual state. VASP gives the ecosystem a single target.

Why a protocol, not just a tool

> Tools get forked. Standards get adopted.

Without a standard, each workflow team builds its own visual parser. VASP is the target - any tool can output it, any workflow can consume it. farscry is the first implementation. Other screenshot services can expose a VASP-formatted endpoint.

VASP repositories

| Repository | Description |
|---|---|
| [`vasp-protocol/spec`](https://github.com/vasp-protocol/spec) | RFC-style specification document |
| [`teles-forge/farscry`](https://github.com/teles-forge/farscry) | Reference implementation |
| `vasp-protocol/adapters` | remote screenshot processing -> VASP converters |

VASP/1.0 core fields

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>          # stable hash of visual content
screen_type: error|config|terminal|conversation|ui|unknown
confidence: high|medium|low|none
lang: eng|por|rus|chi_sim|...
delta_from: phash:<prior_state_id>|null # null if first observation
agent_context: <one-line summary>           # what the workflow needs to know, now
```

The visual state fingerprint (`state_id`)

A content-addressed identifier based on perceptual hashing of the input image.

**Algorithm (reproducible across all platforms):**

```
state_id = pHash(grayscale(resize(image, 32x32)))
```

Steps:
1. Resize to 32x32 pixels using **nearest-neighbor interpolation**
2. Convert to grayscale (`luma: 0.299R + 0.587G + 0.114B`)
3. Apply DCT over 8x8 blocks
4. Compute 64-bit pHash from low-frequency DCT components (mean threshold)
5. Encode as: `phash:<16-char-hex>`

**Why pHash on input image (not SHA256 of OCR output):**

- ONNX Runtime floating point is non-deterministic between x86 AVX2, AVX-512, ARM NEON
- pHash uses integer-dominant operations: hash bits derive from sign comparisons of DCT coefficients relative to their mean - robust to sub-LSB floating-point variance
- Stable to 1-5px rendering jitter and subpixel antialiasing noise
- Sensitive to real layout changes (new field, new error, different form state)
- Enables: loop detection, deduplication, session state tracking across machines

Full output schema

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
delta_from: null
screen_type: config
confidence: high
lang: eng
agent_context: "Payment settings form - Save Changes button available"

ui_tree:
  heading  "Payment Settings"             (20, 20)
  section  "Limits"
    label  "Max Value"                    (20, 120)
    input  value="1500"                   (200, 120)  editable: true
    label  "Status"                       (20, 160)
    badge  "Active"                       (200, 160)  state: success
  button   "Save Changes"                 (400, 300)  enabled: true
  button   "Cancel"                       (500, 300)  enabled: true
  error    "Value must be <= 10000"        (20, 350)

affordances:
  - click: "Save Changes"   at (400, 300)  enabled: true
  - click: "Cancel"         at (500, 300)  enabled: true
  - type:  input "Max Value" at (200, 120)  current: "1500"
```

Token efficiency

VASP structured text uses ~9x fewer tokens than sending the image directly. Measured with real screenshots:

| Input | Tokens added | Notes |
|---|---|---|
| 800x400 PNG via image | +432 tokens | small screenshot |
| 1920x1080 PNG via image | +1,564 tokens | matches cloud provider's published formula |
| VASP text output | ~175 tokens | typical UI screenshot |

**Ratio: ~9x fewer tokens for a 1080p screenshot.** For a 10-step automation loop re-examining the same screen, the difference is 15,640 tokens vs 1,750 tokens.

The diff case is more pronounced: after an workflow action, `farscry diff` produces ~100 tokens describing what changed, versus re-sending 1,564 image tokens to describe everything.

```
Raw vision automation loop (10 steps):   ~15,640 image tokens
farscry VASP automation loop (10 steps): ~1,750 text tokens
Diff-only loop:                      ~100 tokens per verification
```

These are real measurements from local benchmark runs, not estimates.

Screen types

See [Screen Types](/docs/vasp/screen-types) for schemas for `error`, `config`, `terminal`, `conversation`, `ui`, and `unknown`.

Affordances

See [Affordances](/docs/vasp/affordances) for the full affordance schema.

Diff output

See [Diff Output](/docs/vasp/diff) for the delta schema produced by `farscry diff`.
