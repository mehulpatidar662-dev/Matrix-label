# Block 4 · Frontend Dashboards & Annotation Canvas Prompt

```markdown
You are a senior front-end engineer and product designer working in Google Antigravity. Build the Annoting Dashboards, Project Management, and interactive Annotation Canvas in apps/web. Read AGENTS.md first (shared API contract, pricing rules, conventions, definition of done) and the backend M1–M6 specs; follow them exactly. The requirements below are complete — don't interview me. First produce an Implementation Plan artifact, then build in this order: Role Router & Layouts → Client Project & Upload Flow → Interactive Annotation Canvas → Reviewer Queue → Live SSE Wiring → Tests. Check each view in the browser as you go and finish with a Walkthrough artifact.

## Stack & Architecture
- Next.js 14 (App Router) + TypeScript + Tailwind CSS, lucide-react icons, HTML5 Canvas / SVG overlay engine. No heavyweight external canvas libraries.
- Routes under `/dashboard`:
  - `/dashboard`: Role-based redirector based on `GET /v1/auth/me` (`client` → `/dashboard/client`, `annotator` → `/dashboard/annotator`, `reviewer` → `/dashboard/reviewer`, `admin` → `/dashboard/admin`).
  - Client: `/dashboard/client` (projects list), `/dashboard/client/projects/new` (project creation + upload), `/dashboard/client/projects/[id]` (project overview, taxonomy builder, live SSE progress, deliverables download, invoice history).
  - Annotator: `/dashboard/annotator` (workload stats, accuracy EMA, "Start Next Task" button), `/dashboard/annotator/canvas/[taskId]` (full-screen annotation workspace).
  - Reviewer: `/dashboard/reviewer` (5% spot-check queue & client flag queue), `/dashboard/reviewer/inspect/[taskId]` (audit canvas with verdict controls).
- Navigation: Shared dashboard topbar with user profile, active role pill, and Logout (`POST /v1/auth/logout` → `/`).

## Design System Integration
- Follow the design system from AGENTS.md: warm greige `#F4F3EF`, cards `#FAF9F7`, hairlines `#E5E4E0`, dark ink `#181814`, accent red `#D4443C`, annotation lime `#C8FC00` (always black text), dark surface `#191817`.
- Full keyboard accessibility: shortcuts on canvas (V for select, B for bbox, P for polygon, K for keypoint, Esc to cancel, Enter to close polygon, Delete to remove object, Space+Drag to pan).

## 1. Client Portal & Project Management
- **Project List (`/dashboard/client`)**:
  - Cards showing project name, annotation type badge, status pill (`draft`, `uploading`, `quoted`, `accepted`, `in_progress`, `completed`), progress bar, and created date.
  - "New Project" button leading to the wizard.
- **Creation & Upload Wizard (`/dashboard/client/projects/new`)**:
  - Step 1: Basic info (Name, Annotation Type single-select, Turnaround option).
  - Step 2: Upload dataset — Drag-and-drop ZIP/folder with client-side ZIP validation and progress bar calling `POST /v1/projects/{id}/uploads` (presigned S3 multipart). S3 direct connector option (Bucket name + prefix + credentials).
  - Step 3: Taxonomy Builder (`PUT /v1/projects/{id}/labels`) — Drag-and-drop class builder. Each class has a name input, color picker (preset palette + hex), and attribute toggles (e.g., "occluded", "truncated"). For keypoints: define landmark nodes and skeleton connection edges.
  - Step 4: Firm Quote Review & Acceptance (`POST /v1/projects/{id}/quote` & `POST /v1/projects/{id}/quote/accept`). Shows actual uploaded image count, estimated object count, base cost, volume discount, turnaround surcharge, and total in ₹ and paise.
- **Project Detail & Telemetry (`/dashboard/client/projects/[id]`)**:
  - Real-time Progress Bar & Velocity: Connects to SSE endpoint `GET /v1/projects/{id}/events`. Shows live % completed, velocity per day, aggregate IoU, ETA countdown, and per-class accuracy breakdown table.
  - Sample Previews (`GET /v1/projects/{id}/preview?n=10`): Interactive modal carousel displaying 10 random annotated images with toggleable lime overlay boxes. "Flag image" button with reason prompt (`POST /v1/projects/{id}/images/{id}/flags`).
  - Deliverables Center: Download links for COCO JSON, YOLO TXT zip, Pascal VOC XML zip, and the ReportLab Quality Report PDF (`GET /v1/projects/{id}/deliverables`).
  - Invoices Tab: Table showing Invoice ID (`INV-YYYY-NNNN`), issue date, GST breakdown (18%), total in ₹, and PDF download button.

## 2. Annotator Workspace & Canvas (`/dashboard/annotator/canvas/[taskId]`)
- **Task Acquisition**:
  - "Get Next Task" leases a 50-image batch (`GET /v1/annotator/tasks/next`) with a 30-minute countdown lease timer in the header.
- **Canvas Viewport**:
  - Full-window fluid workspace with high-DPI canvas rendering.
  - Smooth pan and zoom (10% to 1000%) with mousewheel and minimap navigator.
  - Toolbar (Left): Select/Transform (V), Bounding Box (B), Polygon (P), Keypoint Skeleton (K), Zoom/Fit to Screen (Z).
  - Class Taxonomy Palette (Right): Radio chips for each project label class with keyboard digits (1–9). Attribute drawer for selected annotation (e.g. [x] occluded).
  - Canvas Overlays:
    - Bbox: Crisp 2px lime `#C8FC00` borders with 8 resize handles and lime class tag.
    - Polygon: Click to drop vertices, lime stroke, rubber-band cursor line, double-click or click start-vertex to close. Vertex dragging and insertion.
    - Keypoint: Sequential node placement matching the class skeleton with connecting lime lines and numbered joint circles.
  - Autosave: Automatically synchronizes annotations every 10s or after 3 edits (`PUT /v1/tasks/{id}/annotations`).
  - **CRITICAL**: The annotator UI must NEVER display any badge, score, or marker indicating an image is a honeypot ground-truth frame.
  - Task Submission: "Submit Batch" button (`POST /v1/tasks/{id}/submit`) with validation check that all images have at least one annotation.

## 3. Reviewer Queue & Audit Portal (`/dashboard/reviewer`)
- **Queue Overview**:
  - Table of pending 5% human spot-checks and client-flagged images. Displays project name, batch ID, annotator ID, and submission timestamp.
- **Inspection View (`/dashboard/reviewer/inspect/[taskId]`)**:
  - Dual comparison view: Toggle between raw image, annotator labels, and ground-truth honeypot comparison.
  - Verification Actions:
    - "Approve Batch" (scores valid).
    - "Fix & Approve" (allows reviewer to directly tweak vertices/boxes on canvas, saved as a versioned reviewer revision).
    - "Reject Batch" (prompts for issue checkboxes like "imprecise boundaries", "missed objects", "wrong class label" and re-queues for annotator revision).

## 4. Mock Engine & Offline Development
- When `NEXT_PUBLIC_USE_MOCKS=true`, simulate the entire backend in memory (`lib/mocks/`):
  - In-memory mock database of projects, tasks, annotations, and invoices.
  - Mock SSE event emitter sending progress updates every 5 seconds.
  - Preloaded sample datasets with real Unsplash images and mock COCO export downloads.

## Verification
- Unit & Component tests with Vitest for Canvas math:
  - Coordinate conversions (Screen px ↔ Image percentage coordinates).
  - Bounding box clamp and collision detection.
  - Polygon area and self-intersection validation.
- Playwright E2E:
  - Client creates project → uploads mock ZIP → reviews quote → accepts.
  - Annotator leases task → draws bounding box → submits batch.
  - Reviewer inspects batch → approves.
  - Client sees progress reach 100% and downloads deliverables.
- Responsive audit at 1440px and 390px (mobile shows warning to open Canvas on desktop).
```
