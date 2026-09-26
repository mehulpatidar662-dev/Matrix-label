import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAuditIcon, ChevronRightIcon } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Privacy Policy : MatrixLabel Platform',
  description:
    'Comprehensive privacy policy covering customer image dataset encryption, zero AI model training guarantees, biometric PII sanitization, and 30-day retention lifecycles.',
};

export default function PrivacyPage() {
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
          <span className="text-emerald-600 dark:text-emerald-400">PRIVACY POLICY</span>
        </div>

        {/* Title */}
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
            <ShieldAuditIcon size={14} />
            <span>Data Protection & Privacy Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Effective Date: September 25, 2026 • Privacy Edition • Data Controller & Data Processor Compliance
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          {/* Section 1 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">01.</span>
              Data Protection Principles & Role Definitions
            </h2>
            <p className="mb-4">
              MatrixLabel acts as a Data Processor regarding image batches and visual payloads uploaded by our customers for annotation. The customer acts as the Data Controller.
            </p>
            <p>
              We process visual assets strictly upon authenticated instructions from your workspace. We adhere to international data privacy standards including the Digital Personal Data Protection Act (DPDP India), European Union General Data Protection Regulation (GDPR), and California Consumer Privacy Act (CCPA).
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">02.</span>
              The Zero-Training Commitment
            </h2>
            <p className="mb-4">
              Unlike consumer AI web applications, MatrixLabel maintains a strict firewall between client image assets and model development:
            </p>
            <ul className="space-y-3 font-mono text-xs text-slate-800 dark:text-slate-200 pl-4 border-l-2 border-emerald-500 mb-4">
              <li>• No Generative AI Training: Your images are never ingested into foundation models, diffusion architectures, or LLM pre-training pipelines.</li>
              <li>• No Cross-Client Data Leakage: Workspace data is logically separated with row-level encryption and tenant isolation keys.</li>
              <li>• Dedicated Annotation Scopes: Annotators only access segmented job tasks assigned to their specific credentials.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">03.</span>
              Biometric Data & PII Masking
            </h2>
            <p className="mb-4">
              If customer datasets contain human faces, vehicle license plates, or identifying personal information, customers may enable our automated pre-annotation PII redaction pipeline.
            </p>
            <p>
              When PII masking is enabled, sensitive pixels are cryptographically blurred or replaced with synthetic noise at ingestion before human annotators view the frames.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">04.</span>
              Storage, Retention & Cryptographic Deletion
            </h2>
            <p className="mb-4">
              All visual assets are stored on dedicated cloud object storage encrypted with AES-256 at rest and TLS 1.3 in transit. Direct upload presigned URLs expire within 3,600 seconds.
            </p>
            <p className="mb-4">
              <strong>Retention Lifecycle:</strong>
            </p>
            <ul className="space-y-2 font-mono text-xs text-slate-800 dark:text-slate-200 pl-4 border-l-2 border-emerald-500 mb-4">
              <li>- Active Run: Stored during active annotation and automated QA validation.</li>
              <li>- Delivery Hold: Retained for thirty (30) days following batch completion to allow customer inspection and acceptance testing.</li>
              <li>- Irreversible Purge: Following the thirty-day delivery window or upon customer API deletion request, all raw image objects and intermediary work files are cryptographically shredded from disk.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">05.</span>
              Account Information & Tracking Technologies
            </h2>
            <p className="mb-4">
              We collect minimal account data: customer contact name, business email, and billing address for tax compliance. We do not use third-party advertising trackers or sell customer contact information.
            </p>
            <p>
              Session security cookies utilize SameSite=Lax and HttpOnly flags to protect authenticated tokens against cross-site scripting vulnerabilities.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-baseline gap-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">06.</span>
              Contact Our Data Protection Officer (DPO)
            </h2>
            <p className="mb-4">
              For questions regarding dataset audits, Data Processing Agreements (DPA), or exercise of statutory privacy rights under GDPR/DPDP, reach out to our privacy compliance desk:
            </p>
            <div className="font-mono text-xs bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200">
              Data Protection Officer: compliance@matrixlabel.ai<br />
              Enterprise DPA Desk: legal@matrixlabel.ai<br />
              Postal: MatrixLabel Systems India Pvt. Ltd., Tech Corridor, Bengaluru 560103
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/terms"
            className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Proceed to Terms of Service</span>
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
