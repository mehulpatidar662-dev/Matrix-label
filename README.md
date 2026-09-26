# MatrixLabel

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![SLA Guarantee](https://img.shields.io/badge/SLA_Guarantee-≥85.0%25_IoU-emerald?style=flat)]()
[![Compliance](https://img.shields.io/badge/Compliance-SOC2_Type_II_Aligned-indigo?style=flat)]()

**MatrixLabel** is an enterprise-grade, managed computer vision dataset labeling and quality assurance platform. Designed for production machine learning teams, it pairs human-in-the-loop domain specialists with automated blind honeypot validation to guarantee sub-pixel ground-truth accuracy.

---

## 🌟 Key Features

### 1. In-Browser Real-Time Annotation Workbench
* **Interactive Modalities**:
  * **Bounding Box (`B`)**: Click-and-drag bounding box creation with crosshair coordinates, 4-corner interactive resize handles (`tl`, `tr`, `bl`, `br`), and translate/move capabilities.
  * **Polygon Instance Segmentation (`P`)**: Multi-vertex vector path tracing with live guide lines, vertex anchor numbering, and auto-closure on initial vertex click.
  * **Keypoint Skeleton (`K`)**: Multi-point anatomical and robotic joint tracking with visibility flags.
  * **Promptable Detection (`M`)**: Interactive one-click segmentation that analyzes pixels and extracts target boundaries on demand.
* **Pixel-Level Image Ingestion & Analysis**:
  * Offscreen HTML5 canvas pixel processor utilizing Sobel gradient kernels and edge-energy pooling.
  * Automatic classification of **Marked** (verified/human-drawn) vs. **Unmarked** (natural foreground candidates) targets.
  * Direct canvas drag-and-drop file ingestion supporting JPEG, PNG, and WebP.
* **Canvas Controls**:
  * Zoom levels (1.0x to 2.0x) with pixel-accurate coordinate calculations.
  * Hardware-accelerated viewport filters: Brightness, Contrast, and Grayscale toggles.
  * 15-step Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`) transaction stack.

### 2. Automated Quality Assurance & Consensus Engine
* **Blind Honeypot Injection**: Injects pre-annotated gold standard frames at a calibrated 4% ratio to evaluate annotator drift in real time.
* **Automated Drift Alarm**: Automatically flags frames falling below the contractual ≥85.0% IoU SLA threshold.
* **Cryptographic Quality Certificates**: Generates SHA-256 signed calibration certificates attesting to dataset fidelity, pass rate, and annotator consensus.
* **Randomized 5% Spot Check Audit**: Dual-annotator consensus viewer to inspect sub-pixel alignment across edge cases.

### 3. Production Multi-Format Dataset Exports
Instant in-browser manifest compilation and download:
* **COCO JSON v1.0**: Formatted with categories, image metadata, normalized bounding boxes, and polygon segmentations.
* **YOLO Normal TXT**: Normalized coordinates `[class_id] [x_center] [y_center] [width] [height]` for direct training.
* **Pascal VOC XML**: Standard XML schema with `<annotation>`, `<size>`, and `<bndbox>` tags.
* **Tabular CSV Ledger**: Tabular audit manifest with bounding coordinates, annotator IDs, and individual IoU scores.

### 4. Client Portal & Enterprise Console
* **Batch Production Ledger**: Monitor dataset progression, active batch states (`In Progress`, `Delivered`), and fleet accuracy.
* **Cloud Storage Ingress**: Generates AWS IAM zero-retention policies and presigned token exchange configurations for Amazon S3, Google Cloud Storage (GCS), and Azure Blob Storage.
* **Automated Webhook Sync**: Live webhook testing console with SHA-256 HMAC payload signatures and event dispatcher (`batch.qa_passed`, `batch.delivered`, `qa.drift_alert`).

### 5. Transparent Volume Pricing Ledger
* Deterministic per-label unit economics with automatic volume rebates across all 5 modalities (Classification, Bounding Box, Keypoint, Polygon, Semantic Mask).
* Net 30 payment terms and 18% statutory GST tax itemization.

---

## 🚀 Quick Start

### Prerequisites
* **Node.js** (v18.17.0 or higher recommended)
* **npm** (v9.0.0 or higher)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/mehulpatidar662-dev/Matrix-label.git
cd Matrix-label/apps/web
npm install
```

### 2. Running in Development
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Building for Production
Create an optimized production build:
```bash
npm run build
npm run start
```

---

## ⌨️ Workbench Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `B` | Activate **Bounding Box** tool |
| `P` | Activate **Polygon Segmentation** tool |
| `K` | Activate **Keypoint Skeleton** tool |
| `M` | Activate **Mark & Auto-Detect** prompt tool |
| `Ctrl + Z` / `Cmd + Z` | **Undo** last target modification |
| `Ctrl + Y` / `Cmd + Shift + Z` | **Redo** undone modification |
| `1` / `2` / `3` | Switch preset dataset sample scenes |
| `+` / `-` | Zoom canvas in / out |
| `Delete` / `Backspace` | Delete currently selected annotation target |
| `Escape` | Cancel active drawing or deselect handle |
| `V` | Switch to **Visual Inspection** canvas tab |
| `Q` | Switch to **QA Telemetry** report tab |
| `L` | Switch to **Export Manifest** payload tab |

---

## 📂 Project Architecture

```
Matrix-label/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── dashboard/page.tsx     # Client Console, Batches & Storage Ingress
│       │   ├── login/page.tsx         # Workspace Sign-In & 1-Click Evaluation
│       │   ├── register/page.tsx      # Project Registration & Onboarding
│       │   ├── pricing/page.tsx       # Volume Pricing & SLA Ledger
│       │   ├── privacy/page.tsx       # Privacy & Data Retention Protocol
│       │   ├── terms/page.tsx         # Master Services Agreement
│       │   ├── layout.tsx             # Root layout & default Light Mode script
│       │   ├── globals.css            # Custom design tokens, glassmorphism & utility classes
│       │   └── page.tsx               # Architectural Landing & Interactive Hero
│       ├── components/
│       │   ├── AnnotationWorkbench.tsx # Full-featured CV Annotation & Canvas Engine
│       │   ├── ActiveLearningPipeline.tsx # MAL Loop & Telemetry Monitor
│       │   ├── DeployBatchModal.tsx   # Production Batch Deployment Modal
│       │   ├── DeveloperApiConsole.tsx # REST API & Python SDK Explorer
│       │   ├── IndustrySolutions.tsx  # Vertical domains (Autonomous, Surgical, Agri)
│       │   ├── Navbar.tsx             # Floating frosted glass navigation header
│       │   ├── PricingLedger.tsx      # Interactive Unit Calculator & Tiers
│       │   ├── QualityArchitecture.tsx # 4-Stage Automated Verification Blueprint
│       │   ├── QualityCertificateModal.tsx # Cryptographic QA Certificate
│       │   ├── RoiCostCalculator.tsx  # In-House vs. Managed ROI Calculator
│       │   ├── SpecificationMatrix.tsx # Modality SLA Specifications
│       │   ├── SpotCheckModal.tsx     # 5% Consensus Verification Inspector
│       │   ├── ThemeProvider.tsx      # Light/Dark context provider (Default: Light)
│       │   ├── ThemeToggle.tsx        # High-contrast Sun/Moon theme switcher
│       │   └── ui/                    # Reusable SVG Icons, Skeletons & primitives
│       ├── lib/
│       │   ├── api.ts                 # API fetch wrapper & Mock Adapter
│       │   ├── pricing.ts             # Deterministic quotation calculator
│       │   └── sampleData.ts          # Default targets, classes & telemetry
│       ├── tailwind.config.ts         # Custom palette, animations & keyframes
│       ├── tsconfig.json              # Strict TypeScript configuration
│       └── package.json
├── docker-compose.yml                 # Container orchestration blueprint
├── docs/                              # API specifications & architectural decisions
├── .gitignore                         # Build and dependency exclusion rules
└── README.md                          # Repository documentation
```

---

## 🔒 Security & Privacy

* **Zero Model Training on Client IP**: Annotations and customer image batches are strictly quarantined and never utilized for foundation model training.
* **Ephemeral Ingress**: Images are streamed directly via presigned STS tokens with KMS envelope encryption.
* **Compliance Alignment**: Engineered to support enterprise compliance benchmarks including SOC2 Type II, EU GDPR, and India DPDP regulations.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
