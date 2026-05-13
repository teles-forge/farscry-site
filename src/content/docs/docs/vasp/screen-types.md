---
title: Screen Types
description: VASP screen type schemas - error, config, terminal, conversation, ui, unknown.
---

farscry classifies every screenshot into one of six screen types. Branch on `screen_type` to apply type-specific logic without parsing the full output.

Screen type overview

| Type | Description | Example |
|---|---|---|
| `error` | Error message displayed in UI | Red screen with error code |
| `config` | Configuration form with fields and values | Settings page with inputs |
| `terminal` | Command line output, stacktrace, logs | bash terminal, CI output |
| `conversation` | Chat between support and customer | WhatsApp, Slack, Teams |
| `ui` | Generic app screen with buttons and labels | Dashboard, menu, form |
| `unknown` | Fallback - raw text extracted | Anything unclassified |

`error`

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
screen_type: error
confidence: high
lang: eng
workflow_context: "Payment error - card declined, retry available"
error_message: "Payment failed - card declined"
error_code: "ERR_402"
component: "Checkout"
suggested_action: "Retry with a different card"
affordances:
  - click: "Retry" enabled: true
  - click: "Back"  enabled: true
```

**Extra fields:**

| Field | Description |
|---|---|
| `error_message` | The full error message text |
| `error_code` | Error code if present |
| `component` | UI component where the error occurred |
| `suggested_action` | farscry's suggested next action |

`config`

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
screen_type: config
confidence: high
lang: eng
workflow_context: "Payment Settings - 3 editable fields, Save available"
section: "Payment Settings"
ui_tree:
  label "Max Value"  | input value="1500"  editable: true
  label "Status"     | badge "Active"      state: success
  label "Period"     | select "Monthly"    editable: true
affordances:
  - type:  input "Max Value"   current: "1500"
  - click: select "Period"     options: [Monthly, Annual]
  - click: "Save Changes"      enabled: true
```

`terminal`

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
screen_type: terminal
confidence: high
lang: eng
workflow_context: "Build failed - connection refused at net.js:1724"
shell: bash
exit_code: 1
content: |
  Error: connection refused
  at Server.listen (net.js:1724)
  at Object.<anonymous> (server.js:42)
```

**Extra fields:**

| Field | Description |
|---|---|
| `shell` | Detected shell type (bash, zsh, powershell, etc.) |
| `exit_code` | Exit code if visible in the terminal |
| `content` | Raw terminal content |

`conversation`

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
screen_type: conversation
confidence: high
lang: eng
workflow_context: "Support conversation - customer reporting kiosk error 503"
platform: whatsapp
messages:
  support  | "How can I help you today?"
  customer | "My kiosk is not working"
  support  | "What error are you seeing?"
  customer | "Screen goes black with code 503"
```

**Extra fields:**

| Field | Description |
|---|---|
| `platform` | Detected platform (whatsapp, slack, teams, etc.) |
| `messages` | Structured message list with speaker labels |

`ui`

Generic UI screen - used when the screen doesn't match a more specific type.

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
screen_type: ui
confidence: medium
lang: eng
workflow_context: "Dashboard - 3 cards, navigation visible"

ui_tree:
  nav     [Home, Orders, Settings]
  heading "Dashboard"
  card    "Total Orders"  value: "1,204"
  card    "Revenue"       value: "$48,200"
  button  "Export"        enabled: true
```

`unknown` (fallback)

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
screen_type: unknown
confidence: none
lang: eng
workflow_context: "Unclassified screen - raw text extracted"
raw_text: "all extracted text without structure"
```

Fallback when classification fails. Always returns `raw_text` and `state_id`.

Confidence levels

| Level | Meaning |
|---|---|
| `high` | Strong signal - clear element patterns detected |
| `medium` | Probable classification with some uncertainty |
| `low` | Weak signal - result may be incorrect |
| `none` | Cannot classify - `unknown` type returned |
