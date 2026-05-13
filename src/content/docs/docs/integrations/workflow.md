---
title: Action Verification
description: Use farscry with MCP workflows to verify UI actions without remote screenshot processing calls.
---

When a workflow takes a UI action, `farscry diff` returns what changed locally, $0, no cloud round-trip.

The core pattern

```bash
farscry before.png -o before.vasp

farscry diff before.png after.png
```

MCP server setup

The recommended integration uses farscry as an MCP server so your workflow can call `farscry_extract` and `farscry_diff` directly.

Installation

```bash
npm install -g farscry
```

Or: `pip install farscry`

Configure MCP settings

Run `farscry setup` to auto-detect your agent and get the config snippet to paste.

Or add manually to your agent's MCP config:

```json
{
  "mcpServers": {
    "farscry": {
      "command": "farscry",
      "args": ["serve", "--mcp"]
    }
  }
}
```

The MCP host starts the server automatically. The server keeps OCR engines warm across calls.

What the workflow sees

Before farscry

```
[a workflow takes action on UI]
[workflow sends a new screenshot to remote processing: $0.0047, typically 2-5s (cloud round-trip)]
[workflow receives a full-screen description]
[workflow extracts what changed manually]
```

With farscry

```
[a workflow takes action on UI]
[farscry diff before.png after.png: $0, locally, no cloud round-trip]

appeared:
  - button "Retry" at (300,420)  enabled:true
changed:
  - button "Submit" → "Processing..."  disabled:true
removed:
  - spinner at (450,200)
```


Example: verifying a payment flow

```bash
farscry payment_form.png --affordances
affordances:
- type:  input "Card Number"   current: ""
- click: "Submit Payment"      enabled: true

cp payment_form.png before.png

farscry diff before.png after_submit.png
appeared:
  - spinner at (300,200)
  - text "Processing payment..."
changed:
  - button "Submit Payment" → disabled:true

farscry diff after_submit.png after_complete.png
appeared:
  - badge "Payment successful"  state:success
removed:
  - spinner
```

Performance comparison

| Approach | Latency | Cost | Offline |
|---|---|---|---|
| farscry diff | locally, no cloud | $0 | Yes |
| remote screenshot processing | ~2-5s (unconfirmed exact) | $0.0047/img | No |

Over a 20-step automation session with 10 screenshot verifications: farscry saves several seconds and ~$0.047 per run.

Loop detection

farscry's `state_id` (perceptual hash) enables loop detection in automation workflows:

```bash
farscry screen.png --context
Payment settings, Save available
```

For `state_id`, run `farscry screen.png` without `--context`.

If the same `state_id` appears twice, the workflow is in a loop, the action had no effect.

farscry supports this to detect when an action had no effect and bail out early.
