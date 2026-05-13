---
title: Tools Reference
description: farscry_extract and farscry_diff - MCP tool schemas and parameters.
---

The farscry MCP server exposes two tools. Workflows call them directly; no CLI piping required.

`farscry_extract`

Converts a screenshot to VASP structured context.

```json
{
  "name": "farscry_extract",
  "description": "Converts a screenshot into VASP structured context for automation tools",
  "parameters": {
    "image_path": {
      "type": "string",
      "description": "Absolute path to image file"
    },
    "lang": {
      "type": "string",
      "default": "eng",
      "description": "Language code - e.g. eng, por, eng+por"
    },
    "affordances": {
      "type": "boolean",
      "default": true,
      "description": "Include affordance list in output"
    }
  }
}
```

**Returns:** Full VASP output - `screen_type`, `workflow_context`, `ui_tree`, `affordances`, `state_id`.

`farscry_diff`

Returns the semantic delta between two screenshots.

```json
{
  "name": "farscry_diff",
  "description": "Returns semantic delta between two screenshots - appeared, changed, removed",
  "parameters": {
    "before": {
      "type": "string",
      "description": "Absolute path to before image"
    },
    "after": {
      "type": "string",
      "description": "Absolute path to after image"
    }
  }
}
```

**Returns:** VASP diff output - `delta.appeared`, `delta.changed`, `delta.removed`, `delta.unchanged`.

Workflow usage

With the MCP server running, workflows call the tools directly:

```
Workflow calls farscry_extract(image_path="/tmp/before.png")
-> receives full VASP context

Workflow takes action

Workflow calls farscry_diff(before="/tmp/before.png", after="/tmp/after.png")
-> receives typed delta of what changed
```

No piping, no subprocesses - the workflow uses the tools the same way it uses any MCP tool.
