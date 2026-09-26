# Block 2 · Backend Prompt (FastAPI + Celery + PostgreSQL)

```markdown
You are a senior backend engineer working in Google Antigravity. Build the complete Annoting backend in apps/api. Read AGENTS.md first — it defines the shared API contract, pricing rules, conventions and definition of done; follow it exactly. The requirements below are complete, so don't interview me. First produce an Implementation Plan artifact (milestones M1–M6, each with its verification steps). Then implement one milestone at a time: run tests, ruff and mypy, commit (git init if needed, Conventional Commits), then continue. Never edit apps/web. Finish with a Walkthrough artifact: how to run, test results, an API tour, and any deviations.

## Stack (fixed)
Python 3.12 · FastAPI · Pydantic v2 · SQLAlchemy 2.0 + psycopg 3 + Alembic · PostgreSQL 16 · Redis 7 · Celery (workers + beat) · S3-compatible storage via boto3 (MinIO in docker-compose) · argon2-cffi · Authlib (Google OIDC) · numpy, scipy, shapely, pycocotools, Pillow · ReportLab · structlog · pytest, httpx, hypothesis · ruff, mypy, uv.
Layout: apps/api/app/{core,db,models,schemas,routers,services,workers,qa,exporters}.
Also: Dockerfiles for api and worker, a Makefile (dev, test, lint, migrate, seed, openapi, e2e) and docs/deploy.md (vendor-neutral).
Where a third party can't be reached (Google, SMTP, Razorpay), build the real integration behind an interface plus a dev fake — no stubbed logic in production paths.

## M1 — Foundation + every endpoint the website calls (build first; the web agent depends on it)
- Scaffold, docker-compose (postgres, redis, minio, api, worker), .env.example, Alembic baseline, structlog with request IDs, CORS for WEB_ORIGIN, security headers, Redis rate limits (auth 5/min/IP, public 60/min/IP), the error envelope from AGENTS.md, /health and /ready.
- Auth: register (role client only), login, logout, refresh with rotation and reuse detection, me, forgot/reset password (single-use 1-hour tokens; console email backend in dev, SMTP in prod), Google sign-in (link by verified email, otherwise create a client), argon2id, an RBAC dependency, audit_log entries for auth events.
- POST /v1/quotes/estimate exactly per the pricing rules (app/services/pricing.py, data-driven rate table). Tests load docs/pricing-fixtures.json (create it from AGENTS.md if missing).
- GET /v1/public/stats — real aggregates cached 60 s in Redis; when DEMO_MODE=true or the DB is empty return {labels_delivered: 10000000, avg_delivered_iou: 0.91, spot_check_pct: 5, first_sample_turnaround_hours: 48}.
- POST /v1/leads (store it and email the team); GET /v1/status (probe db, redis, storage, worker; cached 10 s).
- Generate apps/api/openapi.json (make openapi) and write docs/API.md with curl examples.
Done when: tests are green, the curl examples work against docker-compose, and register → login → me → estimate → stats works in Swagger UI (verify in the browser and attach screenshots).

## M2 — Projects, uploads, taxonomy
- Tables: projects (annotation_type, turnaround, status draft→uploading→quoted→accepted→in_progress→completed|cancelled, quality_target 0.85, spot_check_pct 5), label_classes (name, hex color, attributes such as "occluded", keypoint skeleton), images (storage key, width, height, sha256, status).
- Endpoints: CRUD /v1/projects; PUT /v1/projects/{id}/labels (bulk replace; unique names, valid colors); POST /v1/projects/{id}/uploads (presigned S3 multipart for a ZIP, or per-image PUTs — files go straight to storage, never through the API) plus /uploads/complete; POST /v1/projects/{id}/sources/s3 (bucket + prefix + read-only credentials, encrypted at rest).
- Ingestion worker: streamed unzip with zip-slip and zip-bomb limits, magic-byte sniffing (jpg/png/webp/bmp/tiff), Pillow decompression-bomb guard, ≤ 50 MB per image, sha256 de-duplication, 512 px thumbnails, progress events.
- Firm quote: POST /v1/projects/{id}/quote (pricing service with labels_est from a pluggable ObjectCounter; default images × 6; admin override) and POST /v1/projects/{id}/quote/accept (idempotent). Final price is confirmed after upload from actual object counts.

## M3 — Task engine, honeypots, QA
- On accept, split images into tasks of 50 (configurable) and inject honeypots — at least 10% of each task, minimum 2 — drawn from a curated gold_frames library for that annotation type (seed 20 per type). Ground truth lives in a separate table and honeypot files are copied under neutral keys so nothing distinguishes them.
- Annotators: certified_types, accuracy_ema (α = 0.2), open workload; certification through a qualification task (≥ 0.8 mean IoU on gold frames).
- Skill-matched routing: only annotators certified for the task type; score = 0.7 × accuracy_ema + 0.3 × (1 − normalised open workload); highest wins; 30-minute lease via GET /v1/annotator/tasks/next (Celery beat re-queues expired leases); never give one annotator the same image twice.
- Endpoints: GET /v1/tasks/{id} (assignee only), PUT /v1/tasks/{id}/annotations (autosave, versioned), POST /v1/tasks/{id}/submit.
- QA engine (app/qa, pure functions): bbox IoU; polygon IoU (shapely, make_valid); mask IoU (RLE); keypoint OKS with per-keypoint sigmas; classification exact match / multi-label F1. Per-class Hungarian matching with a configurable match threshold (IoU ≥ 0.5). Per honeypot: mean IoU over ground-truth objects (missed = 0), precision, recall, F1. Task score = mean of its honeypots. Score ≥ project.quality_target → approved; otherwise revision (max 2 rounds, then reassign). Update annotator accuracy_ema and per-class accuracy. Scoring is an idempotent Celery task triggered on submit. Property tests (hypothesis): IoU is symmetric, stays within [0, 1], and identical shapes score 1.
- Human spot-check: after auto-approval, sample spot_check_pct (5%) of each batch for a reviewer — GET /v1/reviewer/queue, POST /v1/reviews/{task_id} {verdict: approve | fix | reject, issues[]}; reviewer edits are versioned.
- Silent honeypots: annotator-facing schemas are separate and never carry honeypot fields; add a test that scans every annotator-facing payload for them.

## M4 — Progress, previews, flags
- GET /v1/projects/{id}/progress → {images_total, images_completed, pct, velocity_per_day (7-day average), aggregate_iou, per_class: [{class_id, name, accuracy}], eta}, updated incrementally on every task decision; GET /v1/projects/{id}/events (SSE over Redis pub/sub, 15 s heartbeat, cookie auth).
- GET /v1/projects/{id}/preview?n=10 → 10 random labeled images with overlay geometry and short-lived signed URLs; POST /v1/projects/{id}/images/{image_id}/flags {reason} creates a reviewer revision task. Feed the real first-sample turnaround into /v1/public/stats.

## M5 — Exports + quality report
- Generated automatically at 100% approved and on demand, each with golden-file tests:
  - COCO JSON: info, licenses, images, annotations (bbox [x,y,w,h], area, iscrowd, segmentation as polygons or RLE, keypoints + num_keypoints), categories with keypoints/skeleton.
  - YOLO TXT zip: one file per image (class xc yc w h, normalised; polygons: class x1 y1 …; pose: class xc yc w h kx ky v …), classes.txt + data.yaml, seeded 80/20 split.
  - Pascal VOC XML zip: folder, filename, size, segmented, object{name, pose, truncated, occluded, difficult, bndbox}; map the "occluded" attribute.
  - Classification: CSV + folder-per-class listing.
  - Quality report PDF (ReportLab): summary, aggregate IoU, precision/recall/F1, per-class accuracy table, IoU histogram, throughput chart, honeypot counts, spot-check pass rate, methodology.
- GET /v1/projects/{id}/deliverables → files with 15-minute presigned links; every download is audited.

## M6 — Billing, privacy, admin, hardening
- Invoices on completion ("we invoice on delivery"): INV-YYYY-NNNN, GSTIN capture, GST via GST_RATE, PDF, status issued | paid | void. A PaymentProvider interface with a Razorpay implementation (orders + webhook signature verification) behind PAYMENTS_ENABLED=false.
- GDPR: DELETE /v1/me and POST /v1/projects/{id}/purge hard-delete rows and S3 objects in a worker job, write an audit entry and send a confirmation; account data export.
- Admin: invite annotators and reviewers, manage gold_frames, override quotes, browse the audit log, platform metrics. RBAC on every route plus ownership checks (clients see only their projects, annotators only their assigned tasks).
- Hardening: Idempotency-Key on create and payment POSTs, cursor pagination, request-size limits, OpenAPI examples, Celery beat jobs (lease expiry, abandoned uploads, purge), and make seed (demo client, 5 annotators including one deliberately poor, 2 reviewers, an admin, a finished 200-image demo project with synthetic images).

## Verification
- Coverage ≥ 85% on app/qa, app/exporters and app/services/pricing; ruff and mypy clean.
- make e2e: register client → create project → upload demo ZIP → firm quote → accept → simulated annotators finish (the poor one fails honeypots and is re-queued) → progress reaches 100% → exports validate (COCO schema, VOC XML parse, YOLO parse) → PDF generated.
- Use the browser for Swagger at http://localhost:8000/docs and capture the main flow as a recording in the Walkthrough.
```
