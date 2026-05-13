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
agent_context: "Payment error - card declined, retry available"

ui_tree:
  [top-center]    error   "Payment failed - card declined"
  [middle-center] label   "ERR_402"
  [bottom-center] button  "Retry"  enabled: true
  [bottom-right]  button  "Back"   enabled: true

affordances:
  - click: "Retry" enabled: true
  - click: "Back"  enabled: true
```

`config`

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
screen_type: config
confidence: high
lang: eng
agent_context: "Payment Settings - 3 editable fields, Save available"

ui_tree:
  heading "Payment Settings"
  label "Max Value"  | input value="1500"  enabled: true
  label "Status"     | badge "Active"
  label "Period"     | select "Monthly"    enabled: true

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
agent_context: "Build failed - connection refused at net.js:1724"

ui_tree:
  [top-left] error "Error: connection refused"
  [top-left] label "at Server.listen (net.js:1724)"
  [top-left] label "at Object.<anonymous> (server.js:42)"
```

`conversation`

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
screen_type: conversation
confidence: high
lang: eng
agent_context: "Support conversation - customer reporting kiosk error 503"

ui_tree:
  [top-left]    label "How can I help you today?"
  [middle-left] label "My kiosk is not working"
  [middle-left] label "What error are you seeing?"
  [bottom-left] label "Screen goes black with code 503"
```

`ui`

Generic UI screen - used when the screen doesn't match a more specific type.

```
vasp_version: 1.0
schema_version: 1
state_id: phash:<16-char-hex>
screen_type: ui
confidence: medium
lang: eng
agent_context: "Dashboard - 3 cards, navigation visible"

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
agent_context: "Unclassified screen - raw text extracted"

ui_tree:
  [top-left] label "all extracted text without structure"
```

Fallback when classification fails. Always returns `agent_context` and `state_id`.

Confidence levels

| Level | Meaning |
|---|---|
| `high` | Strong signal - clear element patterns detected |
| `medium` | Probable classification with some uncertainty |
| `low` | Weak signal - result may be incorrect |
| `none` | Cannot classify - `unknown` type returned |
