---
title: farscry diff
description: Semantic delta between two screenshots. What appeared, changed, removed.
---

Given two screenshots, farscry diff returns a semantic delta - what appeared, what changed, what was removed - without re-sending images to remote screenshot processing.

Usage

```bash
farscry diff <before> <after>
farscry diff <before> <after> --json
```

Examples

```bash
Standard diff
farscry diff before.png after.png

JSON output
farscry diff before.png after.png --json
```

Output

```
=== farscry diff ===
state_id:   phash:3d9b1e7a...
delta_from: phash:8f4a2c3d...
context_similarity: 0.847
context_changed: true
---

appeared:  error    "Payment failed - card declined"
appeared:  button   "Retry"
changed:   button   "Submit" -> "Processing..."
changed:   input    "Amount" value: "150" -> "0"
removed:   label    "spinner"
unchanged: [4 elements]

Token savings: ~312 tokens saved vs re-sending both images
```

How the diff algorithm works

farscry uses a **position-aware bipartite greedy matching** algorithm with two-pass median scroll correction. Validated in spike: 3/3 tests pass, zero false positives.

Two-pass scroll correction

```
Pass 1 - rough text-only match (sim >= 0.70)
         compute median dy = scroll offset from matched pairs
Pass 2 - shift before-elements by (0, dy)
         run full bipartite match on scroll-corrected positions
```

Match scoring

```
match_score(a, b):
  score = 0.4 x text_similarity(a.text, b.text)   // Levenshtein normalized:
        + 0.4 x pos_proximity(a, b, scroll_dy)     //   1 - dist/max_len
        + 0.2 x type_match(a, b)                   // Gaussian σ=80px

```

Classification thresholds

| Score | Classification |
|---|---|
| > 0.95 (after matching) | unchanged |
| 0.60 - 0.95 (after matching, text differs) | changed |
| unmatched in before | removed |
| unmatched in after | appeared |

Match threshold: score > 0.60 -> matched pair.

Full navigation detection

```
overlap_ratio = matched / max(|before|, |after|)
if overlap_ratio < 0.20 -> full page navigation
```

When full navigation is detected, farscry skips the diff and returns the new state directly. Complexity: O(nxm), n,m <= 50 elements per screen.

For token cost and latency comparison, see [Token efficiency](/docs/vasp/overview#token-efficiency).

Options

| Flag | Description |
|---|---|
| `--json` | JSON output |
| `-v` | Verbose |
| `--debug` | Full debug |

Exit codes

Same as [extract](/docs/cli/extract#exit-codes).
