import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PricingLedger from '@/components/PricingLedger';
import { CaliperIcon, ShieldAuditIcon, FileCodeIcon } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Volume Rate Schedule : MatrixLabel',
  description:
    'Transparent, usage-based pricing schedule for computer vision dataset annotation. Deterministic unit rates, volume discount thresholds, and turnaround SLAs.',
};

export default function PricingPage() {
  return (
    <div className="w-full bg-slate-50 dark:bg-[#0B0F17] min-h-screen py-16 sm:py-20 relative">
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            MATRIXLABEL
          </Link>
          <span>/</span>
          <span>COMMERCIAL</span>
          <span>/</span>
          <span className="text-indigo-600 dark:text-indigo-400">VOLUME PRICING SCHEDULE</span>
        </div>

        {/* Section Title */}
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <CaliperIcon size={14} />
            <span>Deterministic Unit Economics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Volume Pricing Schedule & SLA Ledger
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Transparent per-label rates across all five computer vision modalities. Volume rebates are applied automatically at scale, with zero hidden setup charges.
          </p>
        </div>

        {/* The Pricing Ledger & Calculator */}
        <PricingLedger />

        {/* Commercial Specifications & Invoicing Terms */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 border border-indigo-200/60 dark:border-indigo-800/60">
              <ShieldAuditIcon size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Net 30 Payment Terms
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              We bill upon verified batch completion and customer acceptance. Formal GST tax invoices are issued with corporate SAC codes for input tax credits.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-200/60 dark:border-emerald-800/60">
              <CaliperIcon size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              85%+ IoU Quality Warranty
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Any frame failing the agreed IoU benchmark is re-annotated and re-verified at zero additional cost within 48 business hours.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-200/60 dark:border-blue-800/60">
              <FileCodeIcon size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Private VPC & Custom Taxonomies
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              For teams requiring air-gapped on-premise deployments or specialized multi-modal taxonomy training, dedicated statement-of-work agreements are available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
