'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SparklesIcon, CheckSymbolIcon, CaliperIcon, ShieldAuditIcon, ChevronRightIcon } from './ui/Icons';
import { formatINR } from '@/lib/pricing';

export default function ActiveLearningPipeline() {
  const [pipelineStage, setPipelineStage] = useState<'ai' | 'human' | 'honeypot'>('human');

  const stageData = {
    ai: {
      name: '01. Zero-Shot Vision Model Pre-Pass',
      iouScore: 74.2,
      iouLabel: '74.2% IoU (Raw Model Proposal)',
      status: 'Preliminary AI Draft',
      boxColor: '#F59E0B', // Amber
      boxOpacity: '0.15',
      boxCoords: { x: 20, y: 30, w: 42, h: 46 }, // loose box
      details:
        'Foundation vision models (SAM 2 / Ultralytics) execute a preliminary zero-shot pass to draft initial bounding polygons. Saves 70% of initial manual drafting time.',
      speed: '0.04s / frame',
      costReduction: 'Up to 68% Cost Savings',
      humanEffort: '0% Human Effort',
    },
    human: {
      name: '02. Domain-Expert Human Micro-Refinement',
      iouScore: 94.8,
      iouLabel: '94.8% IoU (Expert Refined)',
      status: 'Human Verified',
      boxColor: '#6366F1', // Indigo
      boxOpacity: '0.22',
      boxCoords: { x: 23, y: 34, w: 36, h: 41 }, // tightened box
      details:
        'Vetted human labelers only arbitrate low-confidence vertices, occlusions, and truncation boundaries rather than drawing from scratch. Precision increases to 94%+.',
      speed: '12s / frame review',
      costReduction: '62% Faster Turnaround',
      humanEffort: 'Targeted High-Value Review',
    },
    honeypot: {
      name: '03. Blind Honeypot Ground-Truth Gate',
      iouScore: 97.4,
      iouLabel: '97.4% IoU (Cryptographically Sealed)',
      status: 'Audited & Signed',
      boxColor: '#10B981', // Emerald
      boxOpacity: '0.25',
      boxCoords: { x: 23.5, y: 34.5, w: 35.5, h: 40.5 }, // exact sub-pixel box
      details:
        'The automated QA engine cross-examines annotator performance against hidden ground-truth honeypots. If IoU falls below 85%, the batch is automatically halted and recalibrated.',
      speed: 'Real-Time Automated Audit',
      costReduction: '100% Contractual SLA Compliance',
      humanEffort: 'Zero Defect Delivery',
    },
  };

  const current = stageData[pipelineStage];

  return (
    <section id="active-learning" className="relative w-full bg-slate-50 dark:bg-[#0E131F] py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="pb-8 mb-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 shadow-xs">
            <SparklesIcon size={14} />
            <span>Hybrid Intelligence Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Model-Assisted Labeling & Active Learning Loop
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Why spend weeks on manual labeling? MatrixLabel pairs state-of-the-art vision pre-labeling with targeted human micro-refinement and automated honeypots to deliver datasets 3x faster at half the cost.
          </p>
        </div>

        {/* Interactive 3-Stage Stepper Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <button
            type="button"
            onClick={() => setPipelineStage('ai')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              pipelineStage === 'ai'
                ? 'bg-white dark:bg-slate-900 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Stage 01 // Pre-Pass
              </span>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">~74% IoU</span>
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Zero-Shot Vision Proposal
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated model drafts bounding boxes in milliseconds.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPipelineStage('human')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              pipelineStage === 'human'
                ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Stage 02 // Human Refinement
              </span>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">~95% IoU</span>
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Expert Boundary Tightening
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Human annotators fix occlusions, shadows, and sub-pixel edge alignment.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPipelineStage('honeypot')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              pipelineStage === 'honeypot'
                ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Stage 03 // Blind QA Gate
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">97.4% IoU</span>
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Honeypot Certified Delivery
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated comparison against blind ground truth ensures contractual compliance.
            </p>
          </button>
        </div>

        {/* Visual Dynamic Simulation Canvas */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Telemetry Architecture Diagram (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-7 shadow-lg space-y-5 text-white font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  TELEMETRY PIPELINE MONITOR // {pipelineStage.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${current.boxColor}25`, color: current.boxColor, border: `1px solid ${current.boxColor}50` }}>
                  {current.status}
                </span>
              </div>

              {/* Sequential Flow Nodes */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className={`p-3 rounded-xl border transition-all ${pipelineStage === 'ai' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900/60 opacity-60'}`}>
                  <div className="text-[10px] text-slate-400 mb-0.5">STEP 1</div>
                  <div className="font-bold text-amber-400">Zero-Shot MAL</div>
                  <div className="text-[11px] text-slate-300 mt-1">74.2% IoU</div>
                </div>

                <div className={`p-3 rounded-xl border transition-all ${pipelineStage === 'human' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/60 opacity-60'}`}>
                  <div className="text-[10px] text-slate-400 mb-0.5">STEP 2</div>
                  <div className="font-bold text-indigo-400">Human Micro-Refine</div>
                  <div className="text-[11px] text-slate-300 mt-1">94.8% IoU</div>
                </div>

                <div className={`p-3 rounded-xl border transition-all ${pipelineStage === 'honeypot' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/60 opacity-60'}`}>
                  <div className="text-[10px] text-slate-400 mb-0.5">STEP 3</div>
                  <div className="font-bold text-emerald-400">Honeypot Gate</div>
                  <div className="text-[11px] text-slate-300 mt-1">97.4% IoU</div>
                </div>
              </div>

              {/* IoU Accuracy Gauge Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Measured Benchmark Fidelity (IoU)</span>
                  <span className="font-bold" style={{ color: current.boxColor }}>{current.iouScore}%</span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${current.iouScore}%`, backgroundColor: current.boxColor }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>0% Raw</span>
                  <span>85% Contract SLA Benchmark</span>
                  <span>100% Sealed</span>
                </div>
              </div>

              {/* Real-Time Telemetry Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">LATENCY PER FRAME</span>
                  <span className="text-sm font-bold text-white">{current.speed}</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">CYCLE EFFICIENCY</span>
                  <span className="text-sm font-bold text-emerald-400">{current.costReduction}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Metrics & Details (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                ACTIVE LEARNING TELEMETRY
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {current.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {current.details}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Inference / Annotation Speed:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{current.speed}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Economic Efficiency:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{current.costReduction}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Human Allocation:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{current.humanEffort}</span>
              </div>
            </div>

            {/* Economic Impact Banner */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-emerald-800 dark:text-emerald-300 font-bold block">
                  Model-Assisted Unit Rate:
                </span>
                <span className="text-slate-500 text-[11px]">
                  Base rate starting at ₹5.00 / label with volume rebates
                </span>
              </div>
              <Link
                href="/pricing"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors shrink-0"
              >
                View Rates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
