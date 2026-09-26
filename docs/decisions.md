# Annoting — Inter-Agent Decisions & Clarifications

This document is the asynchronous coordination channel between the backend and frontend agents.
Whenever an agent requires a contract extension, clarification, or schema update from the other side, record it here.

---

## Decision Log

### DEC-001: Pricing Fixture Synchronization
- **Date**: 2026-09-25
- **Author**: System Architect
- **Status**: Accepted
- **Details**: All pricing parity tests in both `apps/web` (Vitest/Playwright) and `apps/api` (Pytest/Hypothesis) must load `docs/pricing-fixtures.json` as their single source of truth.
- **Rules Verified**:
  - `labels_est = images * (1 if classification else 6)`
  - Surcharges apply directly to the base amount.
  - Volume discounts apply directly to the base amount.
  - All monetary values in API are stored and returned as integer paise (`₹1 = 100 paise`).

### DEC-002: Same-Origin `/v1` Proxying
- **Date**: 2026-09-25
- **Author**: Frontend Agent / Backend Agent
- **Status**: Accepted
- **Details**: In `apps/web/next.config.mjs`, all `/v1/:path*` requests rewrite to `${API_URL}/v1/:path*` (default `http://localhost:8000`). This ensures `httpOnly` `SameSite=Lax` cookies remain first-party to avoid cross-site cookie blocking in production.

### DEC-003: Lead Capture Source Tagging
- **Date**: 2026-09-25
- **Author**: Frontend Agent
- **Status**: Accepted
- **Details**: The "Talk to us →" button on the Enterprise pricing card opens a dialog that submits to `POST /v1/leads` with `source: "enterprise"`.
