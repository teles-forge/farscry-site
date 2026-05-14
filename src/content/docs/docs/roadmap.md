---
title: Roadmap
description: What is shipped, what is coming, and why.
---

## v0.1.0 - Released

The foundation. Local OCR pipeline, typed VASP output, MCP server, smart paste.

| Feature | Status |
|---|---|
| `farscry extract` - screenshot to VASP text | Released |
| `farscry diff` - semantic delta between two screenshots | Released |
| `farscry serve --mcp` - 38ms warm daemon | Released |
| `farscry setup` - agent config + smart paste | Released |
| npm, pip, Homebrew, crates.io distribution | Released |
| VASP 1.0-draft open RFC | Released |

---

## v0.2.0 - In planning

Four targeted features. Each ships independently.

### Multi-language OCR

`farscry install-lang por` currently returns an error. v0.2.0 makes it work.

PP-OCRv5 has per-language ONNX recognition models. v0.2.0 downloads,
verifies, and loads them on demand.

```bash
farscry install-lang por    # Portuguese
farscry install-lang deu    # German
farscry install-lang jpn    # Japanese

farscry extract screen.png --lang por
farscry extract screen.png --lang eng+por
```

### `farscry annotate`

Takes a screenshot and returns the same image with bounding boxes drawn
over detected elements, labels, and element types.

```bash
farscry annotate screen.png -o annotated.png
```

Each element type gets a distinct color. Affordances (clickable, typeable)
are highlighted differently from labels and headings. The output image is
shareable and self-documenting.

This is primarily a debugging and demo tool. When you can see the boxes,
you can verify the coordinates are correct before sending them to your agent.

### Windows clipboard

`farscry extract --from-clipboard` is not implemented on Windows.
v0.2.0 completes the platform story.

### VASP adapters

Tools that convert other formats to VASP without requiring farscry's OCR pipeline.

For teams already using Claude computer-use, Playwright, or OpenAI vision:
they get VASP output without changing their extraction pipeline.

```bash
farscry convert --from claude-computer-use --input result.json
farscry convert --from playwright-a11y    --input snapshot.json
farscry convert --from openai-vision      --input response.json
```

This is the protocol adoption path. Other tools join VASP without rewriting
their extraction layer.

---

## v0.3.0 - Planned

### `farscry watch`

Monitors a screen region continuously. Emits a VASP diff each time something
changes. No polling required from the agent.

```bash
farscry watch --region 0,0,1920,1080
# streams VASP diffs to stdout as UI state changes
```

### Loop detection in daemon

The daemon tracks `state_id` history. If the same state appears twice,
`context_changed: false` is emitted and the agent is notified it may be
in a loop.

Useful for automation that gets stuck repeating the same action without effect.

### SDK native clients

The npm and pip SDKs currently wrap the CLI binary via subprocess.
v0.3.0 turns them into proper async clients that connect directly to the
daemon socket.

Lower latency. No subprocess overhead. Persistent connection.

---

## v1.0.0 - Future

- VASP validator: verifies any VASP output against the spec schema
- VASP stream: Server-Sent Events endpoint for real-time state monitoring
- Third-party implementations: guide + badge + registry for VASP-compatible tools

---

## What is NOT on the roadmap

- Cloud inference (farscry is local-only by design)
- GUI app (CLI and MCP are the interface)
- Plugin ecosystem (premature until core protocol is stable)

---

Full spike documentation for v0.2.0 features:
[github.com/teles-forge/farscry/blob/main/docs/projects/roadmap-v0.2.0.md](https://github.com/teles-forge/farscry/blob/main/docs/projects/roadmap-v0.2.0.md)
