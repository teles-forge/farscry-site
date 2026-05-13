---
title: Affordances
description: Every interactive element and its current state. Workflows know what they can do, not just what is visible.
---

Affordances list everything an workflow can do on the current screen - pre-computed from the `ui_tree`. No grounding step needed.

```
affordances:
  - click: "Save Changes"    at (400, 300)  enabled: true
  - click: "Cancel"          at (500, 300)  enabled: true
  - type:  input "Max Value" at (200, 120)  current: "1500"
  - click: "Delete Account"  at (450, 400)  enabled: false
```

Affordance types

| Action | Description | Example |
|---|---|---|
| `click` | Clickable element (button, link, checkbox, radio) | `click: "Save Changes"` |
| `type` | Typeable input field | `type: input "Email"` |
| `select` | Dropdown or select element | `click: select "Period" options: [Monthly, Annual]` |

Full affordance schema

```
affordances:
  - action: click
    label: "Save Changes"
    position: { x: 400, y: 300 }
    enabled: true

  - action: click
    label: "Cancel"
    position: { x: 500, y: 300 }
    enabled: true

  - action: type
    label: "Max Value"
    element_type: input
    position: { x: 200, y: 120 }
    current_value: "1500"
    enabled: true

  - action: click
    label: "Delete Account"
    position: { x: 450, y: 400 }
    enabled: false
```

Requesting affordances

```bash
Include affordances in standard output (default: true with MCP)
farscry screenshot.png --affordances

Affordances only (skip ui_tree and other fields)
farscry screenshot.png --affordances --context
```

In automation workflows

Form filling

```bash
farscry screen.png --affordances
workflow reads: type: input "Email" at (200, 180) current: ""
workflow types email, submits
farscry screen2.png --affordances
workflow reads: appeared: badge "Saved" - action confirmed
```

Action verification

```bash
farscry before.png --affordances
click: "Delete" at (300, 400) enabled: true

workflow clicks delete

farscry after.png --affordances
click: "Confirm Delete" at (300, 200) enabled: true
workflow sees confirmation dialog appeared - proceeds
```

Detecting disabled states

```bash
farscry form.png --affordances
click: "Submit" at (400, 350) enabled: false
workflow sees Submit is disabled - checks required fields first
```

Batch output with affordances

```
---
file: screen1.png
affordances:
  - click: "Save"   at (400, 300)  enabled: true
  - type:  "Email"  at (200, 180)  current: ""
---
file: screen2.png
affordances:
  - click: "Retry"  at (300, 420)  enabled: true
---
```
