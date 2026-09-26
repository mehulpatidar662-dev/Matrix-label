import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAuditIcon, ChevronRightIcon } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Terms of Service : MatrixLabel Platform',
  description:
    'Complete terms of service governing computer vision annotation contracts, honeypot QA protocols, model weight IP retention, and service level agreements.',
};

export default function TermsPage() {
  return (
    <div className="w-full bg-slate-50 dark:bg-[#0B0F17] min-h-screen py-16 sm:py-20 relative">
      <div className="relative max-w-[880px] mx-auto px-4 sm:px-6">
        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            MATRIXLABEL
          </Link>
          <span>/</span>
          <span>LEGAL</span>
          <span>/</span>
          <span className="text-indigo-600 dark:text-indigo-400">TERMS OF SERVICE</span>
        </div>

        {/* Title */}
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <ShieldAuditIcon size={14} />
            <span>Master Services Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Effective Date: September 25, 2026 • Master Services Edition • Applicable to all Enterprise & Self-Serve Workspaces
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          {/* Section 1 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">01.</span>
              Scope of Managed Annotation Services
            </h2>
            <p className="mb-4">
              MatrixLabel provides managed human-in-the-loop data labeling, quality audit engineering, and automated dataset verification services for computer vision and multimodal artificial intelligence systems. By submitting image batches, video frames, or point cloud assets through our web portal or programmatic API endpoints, you agree to be bound by this Master Services Agreement.
            </p>
            <p>
              MatrixLabel assigns pre-vetted, domain-specialized annotators to execute pixel-level annotations based exclusively on your defined taxonomy specifications (including 2D bounding boxes, polygon segmentation, keypoint skeletons, and hierarchical classification).
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">02.</span>
              Customer Data Ownership & Model Weights Protection
            </h2>
            <p className="mb-4">
              <strong>Your Intellectual Property:</strong> You retain complete, unencumbered ownership of all raw source images, metadata, sensor inputs, taxonomy guidelines, and resulting output annotation files (including COCO JSON schemas, YOLO coordinates, and Pascal VOC XML manifests).
            </p>
            <p className="mb-4">
              <strong>Zero Model Training Guarantee:</strong> MatrixLabel covenants and agrees that neither customer raw imagery nor customer ground-truth annotations shall ever be used, extracted, or repurposed to train, fine-tune, or validate any public, proprietary, or foundational model belonging to MatrixLabel or any third party.
            </p>
            <p>
              <strong>Model Weights Retention:</strong> Any machine learning weights, neural network parameters, or embedding vectors produced using the annotated datasets remain the exclusive intellectual property of the customer.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">03.</span>
              Automated QA Engine & Honeypot Ground-Truth Verification
            </h2>
            <p className="mb-4">
              All annotation runs are subject to MatrixLabel&apos;s dual-stage verification protocol:
            </p>
            <ul className="space-y-3 font-mono text-xs text-slate-800 dark:text-slate-200 pl-4 border-l-2 border-indigo-500 mb-4">
              <li>• Blind Honeypots: System injects pre-annotated calibration frames (2-5% volume) to continually monitor human annotator precision.</li>
              <li>• IoU Target Thresholds: Deliveries require a minimum 85% Intersection over Union (IoU) on geometric annotations unless custom SLAs are agreed in writing.</li>
              <li>• Spot-Check Protocol: Secondary senior reviewers manually audit 5% of randomly sampled completions before final serialization.</li>
            </ul>
            <p>
              If a batch delivery fails to satisfy the agreed IoU benchmark, MatrixLabel will remediate the flagged images at zero incremental charge within forty-eight (48) hours.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">04.</span>
              Payment, Invoicing & GST Terms
            </h2>
            <p className="mb-4">
              Pricing is calculated based on delivered unit annotations according to the published MatrixLabel Volume Schedule or custom enterprise statements of work. All monetary transactions are denominated in Indian Rupees (INR) and calculated to the exact integer paise.
            </p>
            <p className="mb-4">
              Applicable Goods and Services Tax (GST at 18%) is added during invoice generation in accordance with statutory requirements. Invoices are generated upon delivery verification and are payable within thirty (30) days from the invoice issuance date.
            </p>
            <p>
              Volume discounts and turnaround surcharges (Standard 14 days, Priority 7 days, Rush 3 days) are calculated deterministically as defined in the pricing schedule.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">05.</span>
              Confidentiality & Annotator Non-Disclosure
            </h2>
            <p className="mb-4">
              All workforce members, contractors, and validation engineers assigned to your datasets execute binding Non-Disclosure Agreements with strict prohibitions against local copying, screen capture, external export, or unauthorized disclosure.
            </p>
            <p>
              Data is served exclusively through air-gapped web canvas viewers with watermarked frame tokens and automatic session timeouts.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">06.</span>
              Limitation of Liability & Indemnification
            </h2>
            <p className="mb-4">
              Neither party shall be liable for indirect, incidental, or consequential damages resulting from platform downtime or third-party cloud infrastructure failures. Total cumulative liability under any statement of work shall not exceed the aggregate fees paid by the customer for the specific annotation run giving rise to the claim.
            </p>
            <p>
              Customer warrants that it has all necessary legal rights and consents to process and transmit the submitted imagery without violating third-party privacy or intellectual property rights.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/privacy"
            className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Proceed to Privacy Policy</span>
            <ChevronRightIcon size={12} />
          </Link>
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
