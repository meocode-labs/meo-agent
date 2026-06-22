<!-- Use this template when fixing a bug. Keep it focused on root cause and regression prevention. -->

# 🐛 Bug Fix

---

## Bug Report

**What happened?**

> _Concise description of the observed (incorrect) behavior._

**Expected behavior**

> _What should have happened instead._

**Steps to reproduce**

1. _..._
2. _..._
3. _..._

**Environment**

| Item | Value |
|------|-------|
| Version / Commit | |
| OS | |
| Node.js | |
| Install method | _npm / binary / source_ |

**Screenshots / Logs**

```

```

---

## Root Cause Analysis

<!-- ❗ REQUIRED: explain WHY the bug existed, not just WHAT you changed. -->

**Where:** _file:line_

**Why it happened:**

> _..._

**Why it wasn't caught earlier:**

> _e.g., missing test, edge case not covered, regression from PR #_

---

## Fix

**Approach:**

> _One-paragraph summary of the solution._

**Files changed:**

- `path/to/file.ext` — _what changed and why_

**Trade-offs considered:**

- ✅ _chosen approach_ — _reason_
- ❌ _alternative_ — _why rejected_

---

## Regression Prevention

<!-- ❗ REQUIRED: how do we know this won't come back? -->

- [ ] Unit test added that fails on the old code
- [ ] Integration test added (if applicable)
- [ ] Existing tests updated to cover the edge case
- [ ] Documentation updated to reflect correct behavior

**New test cases:**

| Test | Asserts |
|------|---------|
| _name_ | _what it proves_ |

---

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Side effects in other code paths | ⬜ Low ⬜ Med ⬜ High | _..._ |
| Performance impact | ⬜ Low ⬜ Med ⬜ High | _..._ |
| Backward compatibility | ⬜ Low ⬜ Med ⬜ High | _..._ |

---

## Checklist

- [ ] Fix verified locally on the exact reproduction steps above
- [ ] Added/updated test that fails without the fix
- [ ] No new lint / type errors
- [ ] CHANGELOG updated
- [ ] Linked the original issue (`Closes #`)
