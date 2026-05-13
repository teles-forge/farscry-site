---
title: Diff Output
description: Semantic delta schema for farscry diff. What appeared, changed, removed, unchanged.
---

`farscry diff` produces a **semantic delta** - a typed description of exactly what changed between two screenshots. Workflows verify their actions without re-sending images to remote screenshot processing.

Full diff output schema

```
vasp_version: 1.0
diff_from: phash:8f4a2c3d...
diff_to:   phash:3d9b1e7a...

delta:
  appeared:
    - error_banner: "Payment failed - card declined"
    - button: "Retry" at (300, 420) enabled: true
  changed:
    - button: "Submit" text: "Submit" -> "Processing..." enabled: true -> false
    - input: "Amount" value: "150" -> "0"
  removed:
    - spinner at (450, 200)
  unchanged:
    - label: "Max Value"
    - input: "Email"
```

Delta sections

| Section | Description |
|---|---|
| `appeared` | Elements present in `after` but not in `before` |
| `changed` | Elements present in both, with different state (text, value, enabled) |
| `removed` | Elements present in `before` but not in `after` |
| `unchanged` | Elements identical in both screenshots |

Changed element format

Changed elements show the before -> after transition:

```
changed:
  - button: "Submit" text: "Submit" -> "Processing..." enabled: true -> false
  - input: "Amount" value: "150" -> "0"
  - badge: "Status" state: success -> error
```

`--workflow` flag (compact output)

For workflow consumption, use `--workflow` to get a condensed version:

```bash
farscry diff before.png after.png --workflow
```

```
delta: appeared=[error_banner:"Payment failed"] changed=[button:"Submit"->disabled] removed=[spinner]
```

One line. Workflow parses immediately.

Full navigation detection

When `overlap_ratio < 0.20` (less than 20% elements match between screenshots), farscry detects a full page navigation and returns the new state directly instead of a diff:

```
vasp_version: 1.0
navigation: full
diff_from: phash:8f4a2c3d...
new_state:
  state_id: phash:9a2b3c4d...
  screen_type: config
  workflow_context: "New page - Account Settings loaded"
  ...
```

Scroll-aware matching

farscry uses a two-pass scroll correction to handle screenshots taken at different scroll positions:

1. **Pass 1** - rough text-only match (threshold 0.7), compute median scroll offset (dx, dy)
2. **Pass 2** - shift `before` elements by (dx, dy), then run full bipartite match

Screenshots taken at different scroll positions are handled correctly.

JSON output

```bash
farscry diff before.png after.png --json
```

```json
{
  "vasp_version": "1.0",
  "diff_from": "phash:8f4a2c3d...",
  "diff_to": "phash:3d9b1e7a...",
  "delta": {
    "appeared": [
      { "type": "error_banner", "text": "Payment failed - card declined" },
      { "type": "button", "label": "Retry", "position": {"x": 300, "y": 420}, "enabled": true }
    ],
    "changed": [
      {
        "type": "button", "label": "Submit",
        "before": {"text": "Submit", "enabled": true},
        "after": {"text": "Processing...", "enabled": false}
      }
    ],
    "removed": [
      { "type": "spinner", "position": {"x": 450, "y": 200} }
    ],
    "unchanged": [
      { "type": "label", "text": "Max Value" },
      { "type": "input", "label": "Email" }
    ]
  }
}
```

Using diff in automation loops

```bash
Workflow takes action
click_button "Save Changes"

Verify the action worked
farscry diff before_save.png after_save.png

Expected: changed=[badge:"Status" success->saved], appeared=[toast:"Settings saved"]
If: appeared=[error_banner:"..."] -> action failed, workflow retries
```
