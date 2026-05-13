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

Run `farscry setup` to auto-detect your agent and get the config snippet to paste:

```bash
farscry setup
```

Or add to your agent's MCP config manually:

**Claude Code** (`~/.claude/mcp.json`):

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

**Cursor** (`~/.cursor/mcp.json`), same config.

**Windsurf** (`~/.windsurf/mcp.json`), same config.

The MCP host starts the farscry server when the session begins and keeps OCR engines warm for the duration.

What the workflow receives

Without farscry, the workflow receives a raw image and must interpret the full screenshot again - adding latency and cost.

With farscry MCP:

```
vasp_version: 1.0
state_id: phash:a3f7c2b1...
screen_type: error
confidence: high
agent_context: "Payment error - card declined, retry available"
---
[bottom] error  "Payment failed - card declined"  at (20,350)
[bottom] button "Retry"  enabled:true  at (400,420)
[bottom] button "Back"   enabled:true  at (400,470)

affordances:
  click → "Retry" at (400,420)  enabled:true
  click → "Back"  at (400,470)  enabled:true
```


Example workflows

Fix a terminal error

```bash
farscry terminal.png | your-runner "fix this build error"
```

Verify a UI action worked

```bash
farscry before.png -o before.vasp

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
