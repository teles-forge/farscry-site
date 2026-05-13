---
title: npm SDK (TypeScript)
description: Use farscry from Node.js and TypeScript projects.
---

The farscry npm package wraps the native binary, automatically detecting your OS and architecture.

Install

```bash
npm install farscry
or globally
npm install -g farscry
```

How it works

```
npm install farscry
        ↓
postinstall detects OS + arch
        ↓
downloads binary from GitHub Releases
        ↓
models downloaded to ~/.farscry/models/ on first run
        ↓
JS wrapper calls binary via child_process
```

API

`extract(image, options?)`

Convert a screenshot to VASP context.

```typescript
import { extract } from 'farscry'


const vasp = await extract('screenshot.png')


const vasp = await extract(imageBuffer)


const vasp = await extract('screenshot.png', {
  lang: 'eng+por',
  textOnly: true,
  affordances: true,
})

console.log(vasp.screen_type)     // 'config'
console.log(vasp.workflow_context)   // "Payment settings - Save available"
console.log(vasp.affordances)     // [...interactive elements]
```

`diff(before, after)`

Semantic delta between two screenshots.

```typescript
import { diff } from 'farscry'

const delta = await diff('before.png', 'after.png')

console.log(delta.appeared)  // [...new elements]
console.log(delta.changed)   // [...changed elements]
console.log(delta.removed)   // [...removed elements]
```

`extractBatch(images, options?)`

Process multiple screenshots in parallel.

```typescript
import { extractBatch } from 'farscry'

const results = await extractBatch(['img1.png', 'img2.png', 'img3.png'])

for (const result of results) {
  console.log(result.file, result.output.screen_type)
}
```

Options

```typescript
interface ExtractOptions {
  lang?: string        // 'eng' | 'por' | 'eng+por' | ...
  textOnly?: boolean   // suppress image in output
  affordances?: boolean // include affordances in output
  json?: boolean       // return raw JSON string
}
```

TypeScript types

```typescript
interface VaspOutput {
  vasp_version: string
  schema_version: number
  state_id: string
  screen_type: 'error' | 'config' | 'terminal' | 'conversation' | 'ui' | 'unknown'
  confidence: 'high' | 'medium' | 'low' | 'none'
  lang: string
  workflow_context: string
  ui_tree?: UiElement[]
  affordances?: Affordance[]

  error_message?: string
  error_code?: string
  raw_text?: string
}

interface Affordance {
  action: 'click' | 'type' | 'select'
  label: string
  position: { x: number; y: number }
  enabled: boolean
  current_value?: string
}

interface VaspDelta {
  vasp_version: string
  diff_from: string
  diff_to: string
  delta: {
    appeared: UiElement[]
    changed: ChangedElement[]
    removed: UiElement[]
    unchanged: UiElement[]
  }
}
```

Supported platforms

| Platform | Binary |
|---|---|
| macOS M1/M2/M3/M4 | `farscry-aarch64-apple-darwin` |
| macOS Intel | `farscry-x86_64-apple-darwin` |
| Linux x86_64 | `farscry-x86_64-unknown-linux-gnu` |
| Windows x86_64 | `farscry-x86_64-pc-windows-msvc` |
