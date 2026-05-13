---
title: Configuration
description: Configure MCP-compatible workflows to use farscry.
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

Auto-detect config location

Run `farscry setup` to detect your agent and get the config snippet:

```bash
farscry setup
```

farscry checks for Claude Code, Cursor, Windsurf, and Zed automatically, then prints the exact snippet to paste. It never modifies your config files.

Manual configuration

Add the following to your agent's MCP config:

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

Config file locations by agent

| Agent | Config file |
|---|---|
| Claude Code | `~/.claude/mcp.json` |
| Cursor | `~/.cursor/mcp.json` |
| Windsurf | `~/.windsurf/mcp.json` |
| Zed | `~/.config/zed/settings.json` |

The MCP host starts the server when the session begins. The key `"farscry"` is the tool namespace used when calling `farscry_extract` and `farscry_diff`.

Any MCP-compatible workflow

farscry exposes a standard MCP server. Any workflow that supports MCP can connect:

```bash
Unix socket (default) - use in stdio transport configs
farscry serve --mcp

TCP - use when workflow requires a port
farscry serve --mcp --port 3333
```

Verify connection

Once configured, verify the server is visible to the workflow:

```bash
Start the server manually to check it runs
farscry serve --mcp --port 3333

In a second terminal - test with curl (JSON-RPC 2.0)
curl -s http://localhost:3333 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | jq .result.tools[].name
"farscry_extract"
"farscry_diff"
```
