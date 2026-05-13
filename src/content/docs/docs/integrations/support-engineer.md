---
title: Support Engineer Integration
description: Automatically enrich support tickets with VASP context when customers attach screenshots.
---

When a customer attaches a screenshot to a support ticket, farscry extracts VASP context and injects it into the message before the automation tool reads it.

The flow

```
Customer attaches PNG to support ticket
        ↓
ChatInput.tsx -> POST to Spring Boot backend
        ↓
Backend calls farscry binary via ProcessBuilder
        ↓
farscry returns VASP output via stdout
        ↓
Backend builds: original_message + "\n\n[VISUAL CONTEXT]\n" + vasp
        ↓
POST /sessions/{id}/messages { message: enriched }
POST /sessions/{id}/attachments (original image, unless --text-only)
        ↓
Workflow receives: typed VASP context + original image
        ↓
Support workflow resolves ticket immediately
```

Spring Boot integration

```java
public String enrichWithVasp(String imagePath, String originalMessage) {
    ProcessBuilder pb = new ProcessBuilder(
        "farscry", "extract", imagePath, "--affordances"
    );
    pb.redirectErrorStream(false);

    try {
        Process process = pb.start();
        String vasp = new String(process.getInputStream().readAllBytes());
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            log.warn("farscry failed for {}, continuing without VASP", imagePath);
            return originalMessage;  // graceful degradation
        }

        return originalMessage + "\n\n[VISUAL CONTEXT]\n" + vasp;
    } catch (Exception e) {
        log.warn("farscry unavailable, continuing without VASP", e);
        return originalMessage;
    }
}
```

What the workflow receives

**Without farscry:**

```
Customer message: "My payment isn't working, see screenshot"
[raw image attached - workflow guesses at content]
```

**With farscry:**

```
Customer message: "My payment isn't working, see screenshot"

[VISUAL CONTEXT]
vasp_version: 1.0
screen_type: error
confidence: high
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


Graceful degradation

farscry failure **never blocks the customer**. If the binary fails for any reason, the message is sent without VASP context. No error surfaces to the end user.

```java
public String enrichWithVasp(String imagePath, String originalMessage) {
    try {
        ProcessBuilder pb = new ProcessBuilder(
            "farscry", "extract", imagePath, "--affordances"
        );
        pb.redirectErrorStream(false);
        Process process = pb.start();
        String vasp = new String(process.getInputStream().readAllBytes());
        int exitCode = process.waitFor();
        if (exitCode != 0) return originalMessage;
        return originalMessage + "\n\n[VISUAL CONTEXT]\n" + vasp;
    } catch (Exception e) {
        log.warn("farscry unavailable", e);
        return originalMessage;
    }
}
```

Conversation screenshots

farscry's `conversation` screen type handles chat screenshots:

```
screen_type: conversation
agent_context: "Support conversation - customer reporting kiosk error 503"

ui_tree:
  [top-left]    label "How can I help you today?"
  [middle-left] label "My kiosk is not working"
  [middle-left] label "What error are you seeing?"
  [bottom-left] label "Screen goes black with code 503"
```


Python backend integration

```python
import subprocess

def enrich_with_vasp(image_path: str, message: str) -> str:
    result = subprocess.run(
        ['farscry', 'extract', image_path, '--affordances'],
        capture_output=True,
        text=True,
        timeout=5
    )
    if result.returncode != 0:
        return message  # graceful degradation

    return message + '\n\n[VISUAL CONTEXT]\n' + result.stdout
```

Installation on server

```bash
On your backend server
curl -fsSL https://farscry.dev/install | sh

Verify
farscry --version

Models download on first run (~12MB)
farscry install-lang eng
```

farscry is a single self-contained binary with no runtime dependencies. Add it to your Docker image:

```dockerfile
RUN curl -fsSL https://farscry.dev/install | sh
RUN farscry install-lang eng  # pre-warm models
```
