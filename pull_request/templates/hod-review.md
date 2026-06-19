# HOD Code Review

**Repository:** {{REPO}}
**PR URL:** https://github.com/ivosights/{{REPO}}/pull/{{PR_NUMBER}}
**Branch:** `{{BRANCH}}`
**Reviewed By:** Head of Department (HOD)
**Review Date:** {{DATE}}

---

## Executive Summary

{{SUMMARY}}

> _HOD verdict & qualitative analysis to be completed by reviewer (opencode `/generate-pr hod` or manual)._

---

## Scope of Changes

| Metric | Value |
|--------|-------|
| Files Modified | {{FILES_COUNT}} files |
| Lines Added | +{{LINES_ADDED}} |
| Lines Removed | -{{LINES_REMOVED}} |
| New Files | {{NEW_FILES}} |
| Commits | {{COMMITS_COUNT}} |

### Files Breakdown
- **Backend (PHP):** {{BACKEND_COUNT}} files
- **Frontend (JS/TS):** {{FRONTEND_COUNT}} files
- **Blade Templates:** {{BLADE_COUNT}} files

---

## 🟥 Critical Issues (Must Fix)

<!-- REVIEW:CRITICAL -->
_List blocking issues here (security, broken logic, debug code, undefined vars)._

---

## 🟧 High Priority Issues

<!-- REVIEW:HIGH -->
_List high-priority concerns (breaking changes, missing tests, interface changes)._

---

## 🟨 Medium / Minor Issues

<!-- REVIEW:MEDIUM -->
_List code-quality, duplication, and style concerns._

---

## Required Actions Before Approval

| Priority | Action | Owner |
|----------|--------|-------|
| 🔴 CRITICAL | _..._ | _..._ |
| 🟧 HIGH | _..._ | _..._ |
| 🟨 MEDIUM | _..._ | _..._ |

---

## Risk Assessment

| Area | Risk Level | Notes |
|------|-----------|-------|
| **Security** | _TBD_ | _..._ |
| **Performance** | _TBD_ | _..._ |
| **Data Integrity** | _TBD_ | _..._ |
| **Backward Compat** | _TBD_ | _..._ |
| **Testing** | _TBD_ | _..._ |

---

## Final Verdict

### ⬜ TBD — APPROVE / REQUEST CHANGES

**Reason:** _..._

**Recommended Next Steps:**
1. _..._
2. _..._
3. _..._

---

## Files Changed Summary

```
{{DIFF_STAT}}
```

### Commits
```
{{COMMITS}}
```
