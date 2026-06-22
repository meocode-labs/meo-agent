<!--
Use this template for thorough code reviews on complex PRs.
Replace it with the default template for simple fixes.
-->

# 🔍 Code Review Checklist

**Reviewer:**
**Review date:**
**Decision:** ⬜ Approve  ⬜ Request Changes  ⬜ Comment

---

## 1. Context & Scope

- [ ] PR description is clear and matches the actual diff
- [ ] Linked issue / ticket is correctly referenced
- [ ] Scope is appropriate — no unrelated drive-by changes
- [ ] Commit history is clean (logical, atomic commits)

---

## 2. Correctness

- [ ] Logic implements the stated requirement
- [ ] Edge cases handled (empty input, null/undefined, boundary values)
- [ ] Error paths produce sensible behavior — no swallowed exceptions
- [ ] No race conditions / async pitfalls (unhandled promises, missing `await`)
- [ ] Backward compatibility preserved (or breaking change documented)
- [ ] Feature flags / kill switches present where appropriate

---

## 3. Design & Architecture

- [ ] Solution fits the existing architecture — no over-engineering
- [ ] New abstractions are justified (not premature)
- [ ] API surface is minimal, consistent, and predictable
- [ ] Naming is clear and intent-revealing
- [ ] No tight coupling introduced between unrelated modules
- [ ] Configuration / secrets handled via the project's conventions

---

## 4. Code Quality

- [ ] Readable — reads top-to-bottom without surprises
- [ ] No duplicated logic (DRY where it adds value)
- [ ] Functions are small and single-purpose
- [ ] Magic numbers / strings extracted to named constants
- [ ] Comments explain **why**, not **what**
- [ ] No dead code, commented-out code, or `TODO` without a tracking issue

---

## 5. Tests

- [ ] New code paths are covered by tests
- [ ] Tests assert behavior, not implementation details
- [ ] Test names describe the scenario clearly
- [ ] Failure messages are helpful for debugging
- [ ] Coverage did not regress

**Test run:**

```bash
npm test
# Result: ⬜ Pass  ⬜ Fail
```

---

## 6. Security

- [ ] No secrets, tokens, or credentials in code or logs
- [ ] Input is validated and sanitized at trust boundaries
- [ ] No injection risks (SQL, shell, path traversal, XSS)
- [ ] Auth / authorization checks present where required
- [ ] Dependencies added are vetted (no known vulnerabilities)

---

## 7. Performance

- [ ] No obvious O(n²) or worse on hot paths
- [ ] No unnecessary re-renders / re-allocations in hot loops
- [ ] Large payloads paginated / streamed
- [ ] No memory leaks (unclosed handles, growing arrays)

---

## 8. Observability

- [ ] Errors logged with sufficient context
- [ ] Meaningful log levels used (`debug` / `info` / `warn` / `error`)
- [ ] No `console.log` left in production code paths
- [ ] Metrics / traces added for new critical paths (if applicable)

---

## 9. Documentation

- [ ] README updated (if user-facing behavior changed)
- [ ] CHANGELOG entry added under `Unreleased`
- [ ] Public API documented (JSDoc / inline comments)
- [ ] Breaking changes called out in the PR description

---

## 10. CI / Tooling

- [ ] CI pipeline is green
- [ ] Lint passes (`npm run lint`)
- [ ] Type check passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build` if applicable)

---

## Findings

### 🔴 Critical (must fix before merge)

| File:Line | Issue | Suggested fix |
|-----------|-------|---------------|
| | | |

### 🟡 Suggestions (non-blocking)

| File:Line | Suggestion |
|-----------|------------|
| | |

### 💬 Questions / Discussions

- _..._

---

## Final Verdict

> _Summary in 1–2 sentences._

✅ **Approve** — ready to merge
🟡 **Approve with comments** — merge after author acknowledges notes
🔴 **Request changes** — must address before re-review
