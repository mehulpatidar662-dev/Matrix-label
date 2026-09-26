# MatrixLabel — shared workspace rules (all agents)

MatrixLabel is a managed image-annotation platform, India-first (₹, GST). Clients upload datasets, skill-matched annotators label them, an automated QA engine scores every job with hidden ground-truth "honeypot" images plus a 5% human spot-check, and clients download COCO / YOLO / Pascal VOC files and a quality-report PDF.

## Layout
- `apps/web` — Next.js 14 (App Router) + TypeScript + Tailwind, http://localhost:3000
- `apps/api` — FastAPI (Python 3.12), http://localhost:8000, committed OpenAPI at `apps/api/openapi.json`
- `docs/` — API.md, pricing-fixtures.json, decisions.md. Root docker-compose.yml runs postgres, redis, minio, api, worker.
- Each agent edits only its own app folder plus `docs/`. If you need something from the other side, write it in `docs/decisions.md`.

## Conventions
- The browser only calls same-origin `/v1/*`; Next.js rewrites proxy it to `API_URL`. This keeps auth cookies first-party in production. Google OAuth redirect URI: `{WEB_ORIGIN}/v1/auth/google/callback`.
- JSON only, base path `/v1`. Errors: `{"error": {"code": "snake_case", "message": "...", "details": {}}}`. Common codes: `validation_error` (422, details per field), `email_taken` (409), `invalid_credentials` (401), `rate_limited` (429). Money = integer paise (INR), never floats. Timestamps = ISO-8601 UTC. IDs = UUID strings.
- Sessions = httpOnly SameSite=Lax cookies (access 15 min, refresh 30 days, rotated; Secure when `COOKIE_SECURE=true`). Reject unsafe requests whose Origin is not `WEB_ORIGIN`.
- Env vars (document every one in `.env.example`, never commit secrets): `DATABASE_URL`, `REDIS_URL`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `WEB_ORIGIN`, `API_URL`, `COOKIE_SECURE`, `GST_RATE=0.18`, `DEMO_MODE`, `PAYMENTS_ENABLED=false`, `NEXT_PUBLIC_USE_MOCKS`.
- Security: argon2id passwords, validate all input, never log PII or tokens, annotators must never be able to tell which images are honeypots.
- Terminal safety: work only inside this workspace; no destructive commands (`rm -rf` outside build/cache folders, `docker system prune`, dropping any database except the compose dev DB).

## API contract v1 — Phase 1 (what the website calls)
- `user = {id, name, email, role: "client" | "annotator" | "reviewer" | "admin"}`
- `POST /v1/auth/register {name, email, password (min 8)}` → 201 `{user}` + cookies. Self-serve signup always creates role "client".
- `POST /v1/auth/login {email, password}` → 200 `{user}` + cookies | 401 invalid_credentials
- `POST /v1/auth/logout` → 204
- `POST /v1/auth/refresh` → 204
- `GET /v1/auth/me` → 200 `{user}` | 401
- `GET /v1/auth/google/start` → 302 to Google
- `GET /v1/auth/google/callback` → 302 to `/dashboard`
- `POST /v1/auth/forgot-password {email}` → 202 always
- `POST /v1/auth/reset-password {token, password}` → 204
- `POST /v1/quotes/estimate {annotation_type: classification | bbox | keypoint | polygon | segmentation, images: int, turnaround: standard | priority | rush}` → 200 `{currency: "INR", labels_est, rate_paise, base_paise, discount_pct, discount_paise, surcharge_pct, surcharge_paise, total_paise}`
- `GET /v1/public/stats` → 200 `{labels_delivered, avg_delivered_iou, spot_check_pct, first_sample_turnaround_hours, updated_at}`
- `POST /v1/leads {name, email, company?, message?, source: "enterprise" | "contact"}` → 202
- `GET /v1/status` → 200 `{status: "operational" | "degraded" | "outage", components: {api, db, redis, storage, worker}}`

## Pricing rules — single source of truth (API and web fallback must match)
- `labels_est = images × (1 for classification, otherwise 6)`.
- Rate per label: classification ₹1.50, bbox ₹5.00, keypoint ₹8.00, polygon ₹12.00, segmentation ₹18.00.
- `base = labels_est × rate`.
- Discount on base by labels_est: ≥ 25,000 → 6%, ≥ 50,000 → 10%, ≥ 100,000 → 15%, ≥ 250,000 → 20%.
- Surcharge on base: standard 0% (14 days), priority +20% (7 days), rush +45% (3 days).
- `total = base − discount + surcharge`.
- GST is added at invoicing, never in the estimate. Round half-up to whole paise.
- Parity fixtures (`docs/pricing-fixtures.json`; both test suites load it):
  - bbox / 5,000 images / standard → 30,000 labels, ₹1,50,000 − ₹9,000 = ₹1,41,000
  - classification / 20,000 / standard → ₹30,000
  - polygon / 10,000 / priority → ₹7,92,000
  - keypoint / 5,000 / rush → ₹3,33,600
  - segmentation / 50,000 / rush → ₹67,50,000.

## Definition of done
Lint, typecheck and tests pass; the app runs from a clean clone with documented commands; behaviour is verified in the browser; a final Walkthrough artifact covers what was built, how to run it, screenshots or recordings, and any deviations from the prompt.
