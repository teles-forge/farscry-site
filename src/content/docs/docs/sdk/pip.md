---
title: pip SDK (Python)
description: Use farscry from Python projects.
---

The farscry pip package wraps the native binary, automatically detecting your OS and architecture.

Install

```bash
pip install farscry
```

How it works

```
pip install farscry
        ↓
postinstall detects OS + arch
        ↓
downloads binary from GitHub Releases
        ↓
models downloaded to ~/.farscry/models/ on first run
        ↓
Python wrapper calls binary via subprocess
```

API

`extract(image, **options)`

Convert a screenshot to VASP context.

```python
from farscry import extract

From file path
vasp = extract('screenshot.png')

From bytes (e.g. from a web upload)
vasp = extract(image_bytes)

With options
vasp = extract('screenshot.png', lang='por', affordances=True)

print(vasp['screen_type'])    # 'config'
print(vasp['agent_context'])  # "Payment settings - Save available"
print(vasp['affordances'])    # [...]
```

`diff(before, after)`

Semantic delta between two screenshots.

```python
from farscry import diff

delta = diff('before.png', 'after.png')

print(delta['delta']['appeared'])  # [...new elements]
print(delta['delta']['changed'])   # [...changed elements]
print(delta['delta']['removed'])   # [...removed elements]
```

`extract_batch(images, **options)`

Process multiple screenshots in parallel.

```python
from farscry import extract_batch

results = extract_batch(['img1.png', 'img2.png', 'img3.png'])

for result in results:
    print(result['file'], result['output']['screen_type'])
```

Return type

All functions return a `dict` parsed from the VASP JSON output:

```python
{
    'vasp_version': '1.0',
    'schema_version': 1,
    'state_id': 'phash:a3f7c2b1...',
    'screen_type': 'config',      # error|config|terminal|conversation|ui|unknown
    'confidence': 'high',          # high|medium|low|none
    'lang': 'eng',
    'agent_context': '...',
    'ui_tree': [...],
    'affordances': [...]
}
```

For server-side usage in support workflows, see [Support Engineer integration](/docs/integrations/support-engineer).

Supported platforms

| Platform | Binary |
|---|---|
| macOS M1/M2/M3/M4 | `farscry-aarch64-apple-darwin` |
| macOS Intel | `farscry-x86_64-apple-darwin` |
| Linux x86_64 | `farscry-x86_64-unknown-linux-gnu` |
| Windows x86_64 | `farscry-x86_64-pc-windows-msvc` |
