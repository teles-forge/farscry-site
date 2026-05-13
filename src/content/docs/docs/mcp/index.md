---
title: MCP Server
description: Run farscry as an MCP server. OCR engines stay warm, workflows call farscry_extract and farscry_diff directly.
---

farscry ships a built-in MCP server. Run it once - OCR engines load at startup and stay warm in memory, eliminating cold-start overhead on every call.

```bash
farscry serve --mcp
Listening on unix socket (default)

farscry serve --mcp --port 3333
Listening on localhost:3333
```

Why daemon mode

| Mode | OCR load | Per-call overhead |
|---|---|---|
| CLI (first run) | ~60ms | included |
| CLI (cached OCR assets) | ~20ms | included |
| `serve --mcp` | once at startup | eliminated |

The daemon keeps PP-OCRv5 OCR engines warm in memory. Every subsequent `farscry_extract` or `farscry_diff` call consistently hits 150-180ms on Apple Silicon or ~120ms on x86.

Security

The MCP server binds to a Unix socket by default, accessible only to the local user. With `--port`, it binds to `localhost` only - never `0.0.0.0`. No image data leaves the machine. All processing is local; no API key required.
