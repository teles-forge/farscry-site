---
title: Configuration
description: Configure MCP-compatible workflows to use farscry.
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

Project MCP config

Add farscry to your project's MCP configuration:

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

The MCP host starts the server when the session begins. The key `"farscry"` is the tool namespace used when calling `farscry_extract` and `farscry_diff`.

CLI-managed config

Add farscry via your workflow's MCP command, or edit the config directly:

<Tabs>
  <TabItem label="CLI (recommended)">
  ```bash
  workflow mcp add farscry --command "farscry serve --mcp"
  ```
  </TabItem>
  <TabItem label="Config file">
  Add `mcpServers` to `~/.config/workflow/config.json`:
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
  </TabItem>
</Tabs>

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
