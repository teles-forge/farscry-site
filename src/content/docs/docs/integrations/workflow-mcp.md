---
title: MCP Workflow Integration
description: Use farscry with MCP-compatible workflows to provide structured visual context.
---

farscry works in two modes: directly through a CLI pipe, or as a local MCP server that an MCP-compatible workflow can call when it needs screenshot context.

Quick start - CLI pipe

```bash
farscry screenshot.png | your-runner "fix this"
```

The workflow receives typed VASP context instead of a raw image.

MCP server (recommended)

With the MCP server, the workflow can call `farscry_extract` or `farscry_diff` without manual piping.

Setup

Create or update `.workflow/mcp.json` in your project:

```json title=".workflow/mcp.json"
{
  "mcpServers": {
    "farscry": {
      "command": "farscry",
      "args": ["serve", "--mcp"]
    }
  }
}
```

The MCP host starts the farscry server when the session begins and keeps OCR engines warm for the duration.

What the workflow receives

Without farscry, the workflow receives a raw image and must interpret the full screenshot again - adding latency and cost.

With farscry MCP:

```
[VISUAL CONTEXT]
vasp_version: 1.0
state_id: phash:a3f7c2b1...
screen_type: error
confidence: high
workflow_context: "Payment error - card declined, retry available"
error_message: "Payment failed - card declined"
error_code: "ERR_402"
affordances:
  - click: "Retry" enabled: true
  - click: "Back"  enabled: true
```


Example workflows

Fix a terminal error

```bash
Take a screenshot of the terminal
farscry terminal.png
vasp_version: 1.0
screen_type: terminal
workflow_context: "Build failed - connection refused at net.js:1724"
content: |
Error: connection refused
at Server.listen (net.js:1724)

farscry terminal.png | your-runner "fix this build error"
```

Verify a UI action worked

```bash
Before clicking
farscry before.png -o before.vasp

Automation clicks "Save Changes"

After clicking
farscry diff before.png after.png | your-runner "did the save succeed?"
```

Extract form fields for automation

```bash
farscry form.png --affordances | your-runner "fill in the form with test data"
```


Tips

- Use `farscry screenshot.png --context` for a one-line summary when you don't need the full tree
- Use `farscry diff` before asking "did this work?" - it avoids another full-screen vision pass and returns an exact, typed delta
- Use `--affordances` when the workflow needs to interact with UI elements - it lists exactly what can be clicked or typed
