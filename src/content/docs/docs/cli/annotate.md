---
title: farscry annotate
description: Draw bounding boxes over every detected element. Returns the original image with colored overlays.
---

Draw bounding boxes over every detected element.
Returns the original image with colored overlays.

## Usage

```bash
farscry annotate screenshot.png
farscry annotate screenshot.png -o annotated.png
farscry annotate --from-clipboard -o /tmp/out.png
```

## Color coding

| Element type | Color | Hex |
|---|---|---|
| button, link | indigo | `#6366f1` |
| input, textarea, select | cyan | `#22d3ee` |
| error, alert | red | `#f87171` |
| heading | amber | `#fbbf24` |
| label, badge, other | gray | `#a1a1aa` |

Affordances (clickable or typeable elements) get a thicker border (3px vs 2px).

## Zero-friction alias

Add to `~/.zshrc`:

```bash
echo "alias fannot='farscry annotate --from-clipboard -o /tmp/farscry_annotated.png && open /tmp/farscry_annotated.png'" >> ~/.zshrc && source ~/.zshrc
```

Then: Shottr screenshot -> `fannot` -> annotated image opens automatically.

## Flags

| Flag | Description |
|---|---|
| `--from-clipboard` | Read image from clipboard instead of file |
| `-o, --output FILE` | Output path (default: `{input}_annotated.png`) |

## Use cases

**Verify element detection before automation:**
Run `farscry annotate` on a screenshot before wiring your agent. Confirm every button and input has a bounding box.

**Debug agent failures:**
When your agent clicks the wrong element, annotate the screenshot to see what farscry detected vs what the agent targeted.

**Share with your team:**
Annotated screenshots are immediately readable by non-technical stakeholders. No code required to understand what farscry sees.
