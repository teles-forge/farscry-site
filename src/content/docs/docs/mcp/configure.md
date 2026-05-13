---
title: Configuration
description: Configure your MCP-compatible agent to use farscry.
---

## Auto-detect (recommended)

Run `farscry setup` — it detects Claude Code, Cursor, Windsurf, and Zed and shows the exact config to paste:

```bash
farscry setup
```

## Manual config

Add to your agent's MCP config file:

```json title="Claude Code — ~/.claude/mcp.json"
{
  "mcpServers": {
    "farscry": {
      "command": "farscry",
      "args": ["serve", "--mcp"]
    }
  }
}
```

```json title="Cursor — ~/.cursor/mcp.json"
{
  "mcpServers": {
    "farscry": {
      "command": "farscry",
      "args": ["serve", "--mcp"]
    }
  }
}
```

```json title="Windsurf — ~/.windsurf/mcp.json"
{
  "mcpServers": {
    "farscry": {
      "command": "farscry",
      "args": ["serve", "--mcp"]
    }
  }
}
```

```json title="Zed — ~/.config/zed/settings.json"
{
  "context_servers": {
    "farscry": {
      "command": {
        "path": "farscry",
        "args": ["serve", "--mcp"]
      }
    }
  }
}
```

The MCP host starts the server when the session begins. The key `"farscry"` is the tool namespace used when calling `farscry_extract` and `farscry_diff`.

## Any MCP-compatible agent

farscry exposes a standard MCP server. Any agent that supports MCP can connect:

```bash
# Unix socket (default)
farscry serve --mcp

# TCP — use when the agent requires a port
farscry serve --mcp --port 3333
```

## Verify the connection

Once configured, verify the server is reachable:

```bash
# Start the server manually
farscry serve --mcp --port 3333

# In a second terminal — test with curl (JSON-RPC 2.0)
curl -s http://localhost:3333 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | jq .result.tools[].name
# "farscry_extract"
# "farscry_diff"
```
