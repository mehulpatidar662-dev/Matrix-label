'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CaliperIcon, ShieldAuditIcon, ChevronRightIcon, CheckSymbolIcon } from './ui/Icons';
import { formatINR } from '@/lib/pricing';

export default function RoiCostCalculator() {
  const [images, setImages] = useState<number>(50000);
  const [modality, setModality] = useState<'bbox' | 'polygon'>('bbox');

  // Calculation parameters
  // BBox: avg 6 boxes per frame = images * 6 labels. Rate ₹5.00
  // Polygon: avg 6 polygons per frame = images * 6 labels. Rate ₹12.00
  const labels = images * 6;
  const unitRate = modality === 'bbox' ? 5.0 : 12.0;

  // Volume rebate:
  // ≥250k: 20%, ≥100k: 15%, ≥50k: 10%, ≥25k: 6%
  let rebatePct = 0;
  if (labels >= 250000) rebatePct = 0.2;
  else if (labels >= 100000) rebatePct = 0.15;
  else if (labels >= 50000) rebatePct = 0.1;
  else if (labels >= 25000) rebatePct = 0.06;

  const matrixBase = labels * unitRate;
  const matrixRebate = matrixBase * rebatePct;
  const matrixTotal = matrixBase - matrixRebate;

  // In-House team cost model:
  // An in-house labeler annotates ~120 frames/day (approx 2,400 frames/month)
  // Annual output per FTE labeler ≈ 28,800 frames
  // FTEs needed:
  const ftesNeeded = Math.max(1, Math.ceil(images / 24000));
  // Average annual FTE cost in India (salary + taxes + workstation): ₹4,80,000 / FTE
  const fteSalaries = ftesNeeded * 480000;
  // SaaS labeling tool licenses: ₹18,000 / seat / year
  const toolingLicenses = ftesNeeded * 18000;
  // QA Lead & Engineering management overhead (reviewing, honeypot scripts): ~₹2,50,000
  const managementOverhead = 250000;
  const inHouseTotal = fteSalaries + toolingLicenses + managementOverhead;

  const netSavings = Math.max(0, inHouseTotal - matrixTotal);
  const savingsPct = inHouseTotal > 0 ? Math.round((netSavings / inHouseTotal) * 100) : 0;

  const handleExportCsv = () => {
    const csvRows = [
      ['MatrixLabel Economic ROI Analysis', '2026'],
      ['Modality', modality === 'bbox' ? '2D Bounding Box' : 'Polygon Segmentation'],
      ['Annual Volume (Frames)', images.toString()],
      ['Estimated Labels', labels.toString()],
      ['FTE Labelers Needed In-House', ftesNeeded.toString()],
      ['In-House Salaries (Annual INR)', fteSalaries.toString()],
      ['Tooling SaaS Licenses (Annual INR)', toolingLicenses.toString()],
      ['QA Management Overhead (Annual INR)', managementOverhead.toString()],
      ['In-House Total Cost (INR)', inHouseTotal.toString()],
      ['MatrixLabel Base Cost (INR)', matrixBase.toString()],
      ['Volume Rebate Applied', `${(rebatePct * 100).toFixed(0)}%`],
      ['MatrixLabel Managed Cost (INR)', matrixTotal.toString()],
      ['Net Annual Projected Savings (INR)', netSavings.toString()],
      ['Projected Cost Reduction %', `${savingsPct}%`],
    ];

    const csvContent = csvRows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `matrixlabel_roi_financial_case_${modality}_${images}_frames.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="roi" className="relative w-full bg-white dark:bg-[#0B0F17] py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="pb-8 mb-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4 shadow-sm">
            <CaliperIcon size={14} />
            <span>Economic Feasibility Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            In-House Team vs. MatrixLabel Managed Unit Economics
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Compare the true cost of hiring, training, and managing internal annotators against MatrixLabel&apos;s verified on-demand unit pricing.
          </p>
        </div>

        {/* Calculator Frame */}
        <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
          {/* Controls Column (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800">
            {/* Modality Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                01. Annotation Modality
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModality('bbox')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    modality === 'bbox'
                      ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    2D Bounding Box
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    Base: ₹5.00 / label
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setModality('polygon')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    modality === 'polygon'
                      ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    Polygon Segmentation
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    Base: ₹12.00 / label
                  </div>
                </button>
              </div>
            </div>

            {/* Volume Slider & Presets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  02. Annual Dataset Volume
                </label>
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
                  {images.toLocaleString('en-IN')} frames
                </span>
              </div>

              <input
                type="range"
                min={10000}
                max={250000}
                step={5000}
                value={images}
                onChange={(e) => setImages(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[10000, 50000, 100000, 250000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setImages(preset)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition-all ${
                      images === preset
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {(preset / 1000).toFixed(0)}k frames
                  </button>
                ))}
              </div>
            </div>

            {/* In-House Overhead Details */}
            <div className="p-5 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Internal In-House Labor Assumptions
              </span>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>FTE Labelers Needed:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{ftesNeeded} Full-Time Personnel</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Labeling SaaS Licenses:</span>
                <span className="font-medium">{formatINR(toolingLicenses)}/yr</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>QA Management Overhead:</span>
                <span className="font-medium">{formatINR(managementOverhead)}/yr</span>
              </div>
            </div>
          </div>

          {/* Results Comparison Column (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-10 bg-white dark:bg-slate-900/90 flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Annual Cost Comparison
                </span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Estimated Financial Run
                </h4>
              </div>

              {/* Side-by-Side Metric Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                    IN-HOUSE TEAM
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {formatINR(inHouseTotal)}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Salary + licenses + QA time
                  </span>
                </div>

                <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                    RECOMMENDED
                  </div>
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase block mb-1">
                    MATRIXLABEL
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {formatINR(matrixTotal)}
                  </div>
                  <span className="text-[11px] text-indigo-600/70 dark:text-indigo-400/70 block mt-1">
                    With automated honeypots
                  </span>
                </div>
              </div>

              {/* Savings Highlight Banner */}
              <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl space-y-2 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    Net Projected Savings:
                  </span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatINR(netSavings)} ({savingsPct}%)
                  </span>
                </div>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                  Eliminate hiring lag, zero turnover risk, and gain guaranteed 85%+ IoU threshold SLA protection.
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono text-slate-500">
                Volume Rebate Applied: <strong className="text-slate-800 dark:text-slate-200">{(rebatePct * 100).toFixed(0)}%</strong>
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  title="Export complete financial calculations as CSV"
                >
                  <CaliperIcon size={13} className="text-indigo-500" />
                  <span>Download Business Case (CSV)</span>
                </button>

                <Link
                  href="/register"
                  className="h-11 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <span>Deploy Run</span>
                  <ChevronRightIcon size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
