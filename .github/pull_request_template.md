<!--
Thanks for opening a pull request! Please fill out every section below.
Sections marked with ❗ are required — the PR cannot be reviewed until they are complete.
-->

## 📋 Summary

<!-- ❗ REQUIRED: A concise (1–3 sentence) description of the change. -->

**What does this PR do?**

> _..._

**Why is it needed?**

> Link the issue, ticket, or motivation. Use `Closes #123` or `Refs #123` to auto-link.

Closes #

---

## 🔄 Type of Change

<!-- ❗ REQUIRED: Check exactly one. -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📝 Documentation update
- [ ] ♻️ Refactor / code cleanup (no behavior change)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test addition / update
- [ ] 🔧 Build / CI / tooling

---

## 🧪 How Has This Been Tested?

<!-- ❗ REQUIRED: Describe the testing approach. -->

- [ ] Unit tests added / updated
- [ ] Integration tests added / updated
- [ ] Manual verification (steps below)
- [ ] Not applicable (explain why)

**Test configuration:**

| Item | Value |
|------|-------|
| OS | _e.g., macOS 14, Ubuntu 22.04, Windows 11_ |
| Node.js | _e.g., v18.19.0_ |
| Branch tested against | `main` |

**Manual test steps:**

1. _..._
2. _..._
3. _Expected: ..._

---

## 📸 Screenshots / Logs

<!-- Optional but encouraged for UI, CLI output, or error fixes. -->

_Before / After or relevant logs._

```

```

---

## 📂 Scope

<!-- ❗ REQUIRED: Auto-fillable from `git diff --stat main...HEAD` if possible. -->

| Metric | Value |
|--------|-------|
| Files changed | |
| Lines added | `+` |
| Lines removed | `-` |
| Commits | |

**Affected modules / packages:**

- [ ] `meo-agent` (CLI)
- [ ] `developer-kit/`
- [ ] `pull_request/`
- [ ] `lib/`
- [ ] `examples/`
- [ ] CI / workflows
- [ ] Docs only

---

## ✅ Definition of Done

<!-- ❗ REQUIRED: All boxes must be checked before requesting review. -->

- [ ] Code follows the project's style guidelines (see `CONTRIBUTING.md` / `AGENTS.md`)
- [ ] Self-reviewed my own code before opening the PR
- [ ] Comments added for non-obvious logic
- [ ] No `console.log`, debugger statements, or commented-out code left behind
- [ ] Documentation updated (README, JSDoc, CHANGELOG) if behavior changed
- [ ] Tests added/updated and passing locally (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Type check passes (`npm run typecheck`)
- [ ] No new warnings introduced
- [ ] Branch is up-to-date with `main`
- [ ] Commit history is clean (squashed / rebased; no `wip` commits)
- [ ] Backward compatible — or breaking change is documented above

---

## ⚠️ Breaking Changes

<!-- ❗ REQUIRED if you checked "Breaking change" above. -->

**What breaks?**

> _..._

**Migration path:**

> _..._

**Deprecation plan (if any):**

> _..._

---

## 🔗 Related Issues / PRs

<!-- Optional: cross-link for context. -->

- Related to #
- Depends on #
- Blocks #

---

## 📝 Release Notes

<!-- Optional: copy-paste ready text for the CHANGELOG / release. -->

```markdown
- [TYPE] Short description (#PR)
```

---

## 👀 Reviewer Focus

<!-- Optional: guide reviewers to the parts that need the most attention. -->

> _e.g., "Please review the file parser logic in `lib/parser.js:42` — that's the riskiest change."_

---

## 🧾 Checklist for Reviewer

<!-- Optional: helps reviewers track their progress. -->

- [ ] Code is readable and self-documenting
- [ ] Logic is correct and edge cases handled
- [ ] Error handling is appropriate
- [ ] Tests are sufficient and meaningful
- [ ] No security concerns (no secrets, no injection risks)
- [ ] No performance regressions
- [ ] Documentation matches the code
