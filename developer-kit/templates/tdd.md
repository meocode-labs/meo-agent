# {{USECASE_TITLE}} - Test-Driven Development

**Use Case ID:** UC-{{USECASE_NUMBER}}
**Created:** {{DATE}}
**Related:** [`requirements.md`](./requirements.md) · [`tasks.md`](./tasks.md)

## 1. TDD Strategy

> {{BRIEF_DESCRIPTION}}

We follow the **Red → Green → Refactor** cycle:

1. 🔴 **Red** — write a failing test that captures the desired behavior
2. 🟢 **Green** — write the minimum code to make the test pass
3. 🔵 **Refactor** — clean up while keeping tests green

## 2. Test Pyramid

| Layer | Coverage Target | Tooling |
|-------|-----------------|---------|
| Unit | ≥ 80% | PHPUnit / Jest |
| Integration | All API endpoints | PHPUnit Feature / Supertest |
| E2E | Critical user journeys | Cypress / Playwright |

## 3. Test Matrix

| ID | Requirement | Test Type | Description | Status |
|----|-------------|-----------|-------------|--------|
| TC-001 | FR-1 | Unit | | ⬜ |
| TC-002 | FR-1 | Integration | | ⬜ |
| TC-003 | FR-2 | Unit | | ⬜ |
| TC-004 | FR-2 | E2E | | ⬜ |

## 4. Test Cases

### TC-001: {{TC_001_TITLE}}
**Type:** Unit | Integration | E2E
**Maps to:** FR-1

**Given:** ...
**When:** ...
**Then:** ...

**Steps:**
1. ...
2. ...

**Expected result:** ...

---

### TC-002: {{TC_002_TITLE}}
**Type:** Unit | Integration | E2E
**Maps to:** FR-2

**Given:** ...
**When:** ...
**Then:** ...

**Steps:**
1. ...
2. ...

**Expected result:** ...

---

## 5. Edge Cases & Negative Tests

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC-001 | Empty input | |
| EC-002 | Invalid input | |
| EC-003 | Unauthorized access | 401 |
| EC-004 | Forbidden access | 403 |
| EC-005 | Resource not found | 404 |
| EC-006 | Rate limit exceeded | 429 |
| EC-007 | Downstream service down | Graceful degradation |

## 6. Performance & Load Tests

| Scenario | Target | Tool |
|----------|--------|------|
| Normal load (X RPS) | p95 < 200ms | k6 / JMeter |
| Peak load (Y RPS) | p95 < 500ms | k6 / JMeter |
| Soak (1h sustained) | No memory leak | k6 |

## 7. Security Tests

- [ ] SQL injection
- [ ] XSS (reflected & stored)
- [ ] CSRF
- [ ] Authentication bypass
- [ ] Authorization escalation
- [ ] Sensitive data exposure
- [ ] Rate limiting
- [ ] Input validation

## 8. CI/CD Integration

| Stage | Test Command | Gate |
|-------|--------------|------|
| Pre-commit | `phpunit --filter=Unit` | Local |
| PR | `phpunit` | Required |
| Main | `phpunit` + e2e | Required |
| Release | full suite + perf | Required |

## 9. Test Data Strategy

- **Fixtures:** ...
- **Factories:** ...
- **Mocks:** ...
- **Test DB reset:** per-suite / per-test

## 10. Coverage Requirements

| Layer | Minimum | Target |
|-------|---------|--------|
| Statements | 80% | 90% |
| Branches | 75% | 85% |
| Functions | 80% | 90% |
| Lines | 80% | 90% |

## 11. Change Log

| Date | Author | Change |
|------|--------|--------|
| {{DATE}} | {{AUTHOR}} | Initial TDD plan |
