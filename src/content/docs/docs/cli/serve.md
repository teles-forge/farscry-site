---
title: farscry serve
description: Run farscry as an MCP server with OCR engines kept warm in memory.
---

Starts farscry as a long-running MCP (Model Context Protocol) server. OCR engines are loaded once and kept warm in memory, eliminating the 20-60ms cold-start overhead on every invocation.

Usage

```bash
farscry serve --mcp
farscry serve --mcp --port 3333
```

Why use the server

| Mode | Latency |
|---|---|
| CLI (cold) | 180ms + 20-60ms cold start |
| CLI (warm, OCR engines cached) | ~180ms |
| `serve --mcp` (OCR engines in RAM) | ~150ms consistently |

The MCP server mode is the recommended way to integrate farscry with MCP-compatible workflows that make repeated screenshot analysis calls.

MCP tools exposed

```json
[
  {
    "name": "farscry_extract",
    "description": "Converts any screenshot into VASP structured context for automation tools",
    "parameters": {
      "image_path": { "type": "string" },
      "lang": { "type": "string", "default": "eng" },
      "affordances": { "type": "boolean", "default": true }
    }
  },
  {
    "name": "farscry_diff",
    "description": "Returns semantic delta between two screenshots - what appeared, changed, removed",
    "parameters": {
      "before": { "type": "string" },
      "after": { "type": "string" }
    }
  }
]
```

MCP configuration

See the [MCP Server](/docs/mcp) page for full integration examples with MCP-compatible workflows.

Options

| Flag | Default | Description |
|---|---|---|
| `--mcp` | required | Enable MCP server mode |
| `--port <n>` | unix socket | TCP port (default: unix socket at `~/.farscry/mcp.sock`) |

Stopping the server

```bash
Ctrl+C or send SIGTERM
kill $(lsof -t -i:3333)
```
