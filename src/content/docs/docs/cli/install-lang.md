---
title: farscry --install-lang
description: Download additional OCR language models on demand.
---

farscry ships with English built in. Additional languages are downloaded on demand and stored in `~/.farscry/models/lang/`.

Usage

```bash
farscry --install-lang <code>
```

Examples

```bash
farscry --install-lang por    # Portuguese
farscry --install-lang rus    # Russian
farscry --install-lang chi_sim # Chinese Simplified
farscry --install-lang jpn    # Japanese
```

Priority languages for v0.1.0

| Code | Language | Model size |
|---|---|---|
| `eng` | English (built in) | ~12MB |
| `por` | Portuguese | ~10-20MB |
| `rus` | Russian | ~10-20MB |
| `chi_sim` | Chinese Simplified | ~10-20MB |

How it works

farscry uses **PP-OCRv5** language-specific ONNX recognition models - not Tesseract `.traineddata` files.

Each language pack is:
1. Downloaded from GitHub Releases via HTTPS
2. Verified with SHA256 before use
3. Stored in `~/.farscry/models/lang/<code>.onnx`

Language auto-detection

When `--lang` is not specified, farscry uses [`whatlang-rs`](https://github.com/greyblake/whatlang-rs) or `lingua-rs` for language detection. Tesseract's built-in language detection is not used (it is inaccurate for UI screenshots).

Using a language

```bash
Explicit language
farscry screenshot.png --lang por

Multi-language (mixed content)
farscry screenshot.png --lang eng+por
```

Storage location

```
~/.farscry/
  models/
    det.onnx        <- detection model (shared)
    rec_eng.onnx    <- English recognition (default)
    lang/
      por.onnx
      rus.onnx
      chi_sim.onnx
```
