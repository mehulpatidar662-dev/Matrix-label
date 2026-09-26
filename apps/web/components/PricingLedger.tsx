'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AnnotationType,
  TurnaroundSpeed,
  calculateQuote,
  formatINR,
} from '@/lib/pricing';
import { CaliperIcon, ShieldAuditIcon, ChevronRightIcon, FileCodeIcon, CheckSymbolIcon } from './ui/Icons';

const ANNOTATION_TYPES: Array<{ id: AnnotationType; label: string; rate: string }> = [
  { id: 'classification', label: 'Classification', rate: '₹1.50' },
  { id: 'bbox', label: 'Bounding Box', rate: '₹5.00' },
  { id: 'keypoint', label: 'Keypoint Skeleton', rate: '₹8.00' },
  { id: 'polygon', label: 'Polygon Instance', rate: '₹12.00' },
  { id: 'segmentation', label: 'Semantic Mask', rate: '₹18.00' },
];

const TURNAROUND_OPTIONS: Array<{ id: TurnaroundSpeed; label: string; days: string; modifier: string }> = [
  { id: 'standard', label: 'Standard', days: '14 Days', modifier: '0% Surcharge' },
  { id: 'priority', label: 'Priority', days: '7 Days', modifier: '+20% Surcharge' },
  { id: 'rush', label: 'Rush', days: '3 Days', modifier: '+45% Surcharge' },
];

const VOLUME_TIERS = [
  { bracket: '1 - 24,999 labels', discount: '0% (Base Rate)', bboxRate: '₹5.00', polyRate: '₹12.00', qaLevel: 'Standard Automated Honeypots (2%)', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  { bracket: '25,000 - 49,999 labels', discount: '6% Volume Rebate', bboxRate: '₹4.70', polyRate: '₹11.28', qaLevel: 'Honeypots + 5% Human Spot-Check', badge: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' },
  { bracket: '50,000 - 99,999 labels', discount: '10% Volume Rebate', bboxRate: '₹4.50', polyRate: '₹10.80', qaLevel: 'Dual-Pass Cross Verification', badge: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300' },
  { bracket: '100,000 - 249,999 labels', discount: '15% Volume Rebate', bboxRate: '₹4.25', polyRate: '₹10.20', qaLevel: 'Dedicated Domain Workforce Pod', badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' },
  { bracket: '250,000+ labels', discount: '20% Enterprise Rebate', bboxRate: '₹4.00', polyRate: '₹9.60', qaLevel: 'Private Air-Gapped Dedicated Node', badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' },
];

export default function PricingLedger() {
  const [annotationType, setAnnotationType] = useState<AnnotationType>('bbox');
  const [images, setImages] = useState<number>(5000);
  const [turnaround, setTurnaround] = useState<TurnaroundSpeed>('standard');

  const quote = calculateQuote(annotationType, images, turnaround);
  const gstAmount = Math.round(quote.totalCost * 0.18);
  const totalWithGst = quote.totalCost + gstAmount;

  return (
    <div className="w-full space-y-12">
      {/* 1. Volume Discount Tiers Schedule Table */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wider">
              <ShieldAuditIcon size={14} />
              <span>Deterministic Schedule</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Volume Discount Thresholds
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            AUTOMATICALLY APPLIED BASED ON TOTAL JOB LABELS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Cumulative Labels</th>
                <th className="py-3.5 px-4">Volume Rebate</th>
                <th className="py-3.5 px-4">Effective BBox Rate</th>
                <th className="py-3.5 px-4">Effective Polygon Rate</th>
                <th className="py-3.5 px-4">Quality Assurance Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              {VOLUME_TIERS.map((tier, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-mono">
                    {tier.bracket}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${tier.badge}`}>
                      {tier.discount}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{tier.bboxRate}</td>
                  <td className="py-3.5 px-4 font-mono">{tier.polyRate}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">{tier.qaLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Interactive Unit Cost Calculator Ledger */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="h-14 px-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Interactive Unit Cost Calculator
          </span>
          <span className="text-slate-500 font-medium">
            CURRENCY: INR (₹) • GST ITEMIZATION: 18%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
            {/* Annotation Type Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 mb-3">
                01. Select Annotation Modality
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {ANNOTATION_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAnnotationType(type.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      annotationType === type.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold mb-0.5">{type.label}</div>
                    <div className="text-[11px] opacity-75 font-mono">{type.rate} / label</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Slider & Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300">
                  02. Dataset Image Count
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400">FRAMES:</span>
                  <input
                    type="number"
                    min={100}
                    max={250000}
                    step={100}
                    value={images}
                    onChange={(e) => setImages(Math.max(1, Number(e.target.value) || 0))}
                    className="w-28 px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-right font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={images}
                onChange={(e) => setImages(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>500 frames</span>
                <span>10,000 frames</span>
                <span>50,000 frames</span>
              </div>
            </div>

            {/* Turnaround Speed */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 mb-3">
                03. Turnaround SLA
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TURNAROUND_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTurnaround(opt.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      turnaround === opt.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold mb-0.5">{opt.label}</div>
                    <div className="text-[11px] opacity-75">{opt.days} ({opt.modifier})</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ledger Calculation Summary Column (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-slate-200/80 dark:border-slate-700 mb-5">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Deterministic Line-Item Ledger
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Cost Breakdown
                </h4>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Total Estimated Labels</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {quote.labels.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Base Cost ({quote.labels.toLocaleString('en-IN')} × {formatINR(quote.baseRate)})</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {formatINR(quote.baseCost)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">
                    Volume Rebate ({quote.discountLabel})
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    - {formatINR(quote.discountAmount)}
                  </span>
                </div>
                {quote.turnaroundAmount > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500">
                      Turnaround Surcharge ({quote.turnaround === 'priority' ? '+20%' : '+45%'})
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      + {formatINR(quote.turnaroundAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60 font-bold">
                  <span className="text-slate-900 dark:text-white">Net Subtotal (excl. GST)</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {formatINR(quote.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Statutory GST (18%)</span>
                  <span className="font-mono text-slate-500">
                    {formatINR(gstAmount)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold">
                  <span className="text-slate-900 dark:text-white">Total Invoice Value</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 text-base">
                    {formatINR(totalWithGst)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-700">
              <Link
                href="/register"
                className="w-full h-11 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
              >
                <span>Initiate Batch Order</span>
                <ChevronRightIcon size={14} />
              </Link>
              <div className="text-[11px] text-center text-slate-400">
                Invoicing on delivery completion. Payment terms: Net 30 days.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
