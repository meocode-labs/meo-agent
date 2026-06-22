<!-- Use this template when introducing a new feature or significant enhancement. -->

# ✨ Feature

---

## Problem Statement

<!-- ❗ REQUIRED: describe the user need before describing the solution. -->

**Who is affected?**

> _e.g., "Developers using the CLI to download large files"_

**What is the pain point today?**

> _Current behavior, workaround users apply, cost of the problem._

**Evidence / demand:**

> _Link to issues, discussions, analytics, or user reports._

Refs #

---

## Proposed Solution

**One-sentence pitch:**

> _e.g., "Add `--retry` and `--timeout` flags to `meo-agent` for flaky networks."_

**User-facing behavior:**

> _What will the user see / do? Include CLI examples._

```bash
meo-agent --retry=3 --timeout=30s https://example.com/file.zip
```

**API / Interface:**

```js
// example signature
function download(url, options = {}) { ... }
```

---

## Design

**Approach:**

> _Paragraph explaining the chosen approach and why._

**Alternatives considered:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| _chosen_ | | | ✅ |
| _alt 1_ | | | ❌ |
| _alt 2_ | | | ❌ |

**Architecture impact:**

> _New modules, dependencies, files added, public API changes._

- New dependencies: _list with justification_
- New public exports: _list_
- Schema / config changes: _list_

---

## Implementation Notes

**Key files:**

- `lib/foo.js` — _purpose_
- `lib/foo.test.js` — _purpose_

**Notable decisions / trade-offs:**

> _Anything reviewers should know before reading the diff._

---

## Testing Strategy

- [ ] Unit tests cover the happy path
- [ ] Unit tests cover error / edge cases
- [ ] Integration test for the CLI command
- [ ] Manual test plan documented below

**Manual verification:**

1. _..._
2. _..._
3. _Expected output:_ _..._

---

## Documentation

- [ ] README updated with usage example
- [ ] `--help` output updated (if CLI)
- [ ] CHANGELOG entry under `Unreleased`
- [ ] Migration guide (if breaking)
- [ ] Example added to `examples/` (if applicable)

---

## Rollout

| Item | Plan |
|------|------|
| Behind a feature flag? | ⬜ Yes ⬜ No |
| Gradual rollout? | ⬜ Yes ⬜ No |
| Telemetry / metrics to watch? | _..._ |
| Rollback plan? | _..._ |

---

## Checklist

- [ ] Feature works as described above
- [ ] All Definition-of-Done items from `pull_request_template.md` satisfied
- [ ] Backward compatible — or breaking change documented
- [ ] At least one peer reviewer assigned
