---
title: Action Verification
description: Use farscry with MCP workflows to verify UI actions without remote screenshot processing calls.
---

When a workflow takes a UI action, `farscry diff` returns what changed in under 200ms - locally, $0, no cloud round-trip.

The core pattern

```bash
1. Capture before state
farscry before.png -o before.vasp

2. Workflow takes action (click, type, navigate)

3. Verify what changed
farscry diff before.png after.png
```

MCP server setup

The recommended integration uses farscry as an MCP server so your workflow can call `farscry_extract` and `farscry_diff` directly.

Installation

```bash
npm install -g farscry
or: pip install farscry
```

Configure MCP settings

Add via CLI or edit `~/.config/workflow/config.json` directly:

```bash
workflow mcp add farscry --command "farscry serve --mcp"
```

Or manually:

```json title="~/.config/workflow/config.json"
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
[workflow sends a new screenshot to remote processing: $0.003, ~1800ms]
[workflow receives a full-screen description]
[workflow extracts what changed manually]
```

With farscry

```
[a workflow takes action on UI]
[farscry diff before.png after.png: $0, ~180ms, local]

delta:
  appeared:
    - button: "Retry" at (300, 420) enabled: true
  changed:
    - button: "Submit" -> "Processing..." disabled: true
  removed:
    - spinner at (450, 200)
```


Example: verifying a payment flow

```bash
Step 1 - Extract initial state
farscry payment_form.png --affordances
affordances:
- type:  input "Card Number"   current: ""
- click: "Submit Payment"      enabled: true

Step 2 - Capture before submit
cp payment_form.png before.png

Step 3 - Workflow fills form and clicks Submit

Step 4 - Verify
farscry diff before.png after_submit.png
delta:
appeared:
- spinner at (300, 200)
- text: "Processing payment..."
changed:
- button: "Submit Payment" -> disabled: true

Step 5 - Wait and verify completion
farscry diff after_submit.png after_complete.png
delta:
appeared:
- badge: "Payment successful" state: success
removed:
- spinner
```

Performance comparison

| Approach | Latency | Cost | Offline |
|---|---|---|---|
| farscry diff | ~180ms | $0 | Yes |
| remote screenshot processing | ~1800ms | $0.003/img | No |

Over a 20-step automation session with 10 screenshot verifications: farscry saves ~16 seconds and ~$0.03 per run.

Loop detection

farscry's `state_id` (perceptual hash) enables loop detection in automation workflows:

```bash
farscry screen.png --context
state_id: phash:a3f7c2b1...

If same state_id appears twice -> workflow is in a loop
```

farscry supports this to detect when an action had no effect and bail out early.
