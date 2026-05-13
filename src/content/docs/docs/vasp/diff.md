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
context_similarity: 0.847
context_changed: true
agent_context: "Payment form - error appeared"

appeared:
  error    "Payment failed - card declined"
  button   "Retry"

changed:
  button   "Submit" -> "Processing..."
  input    "Amount" value: "150" -> "0"

removed:
  label    "spinner"

unchanged: [4 elements]

Token savings: ~312 tokens saved vs re-sending both images
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
  button   "Submit" -> "Processing..."
  input    "Amount" value: "150" -> "0"
  badge    "Status" -> "error"
```

JSON output

```bash
farscry diff before.png after.png --json
```

```json
{
  "vasp_version": "1.0",
  "diff_from": "phash:8f4a2c3d...",
  "diff_to": "phash:3d9b1e7a...",
  "context_similarity": 0.847,
  "context_changed": true,
  "agent_context": "Payment form - error appeared",
  "entries": [
    { "Appeared": { "text": "Payment failed - card declined", "element_type": "Error", "cx": 300, "cy": 48, "w": 400, "h": 20, "enabled": null, "value": null } },
    { "Changed": {
      "before": { "text": "Submit", "element_type": "Button", "cx": 300, "cy": 420, "w": 120, "h": 36, "enabled": true, "value": null },
      "after":  { "text": "Processing...", "element_type": "Button", "cx": 300, "cy": 420, "w": 120, "h": 36, "enabled": false, "value": null }
    }},
    { "Removed": { "text": "", "element_type": "Unknown", "cx": 450, "cy": 200, "w": 24, "h": 24, "enabled": null, "value": null } }
  ],
  "tokens_saved": 312
}
```

Full navigation detection

When `overlap_ratio < 0.20` (less than 20% elements match between screenshots), farscry detects a full page navigation and returns the new state directly instead of a diff:

```
vasp_version: 1.0
diff_from: phash:8f4a2c3d...
diff_to:   phash:9a2b3c4d...
agent_context: "New page - Account Settings loaded"

appeared:  [all elements on new page]
removed:   [all elements from previous page]
unchanged: [0 elements]
```

Scroll-aware matching

farscry uses a two-pass scroll correction to handle screenshots taken at different scroll positions:

1. **Pass 1** - rough text-only match (threshold 0.7), compute median scroll offset (dx, dy)
2. **Pass 2** - shift `before` elements by (dx, dy), then run full bipartite match

Screenshots taken at different scroll positions are handled correctly.

Using diff in automation loops

```bash
Workflow takes action
click_button "Save Changes"

Verify the action worked
farscry diff before_save.png after_save.png

Expected: changed=[badge:"Status" success->saved], appeared=[toast:"Settings saved"]
If: appeared=[error:"..."] -> action failed, workflow retries
```
