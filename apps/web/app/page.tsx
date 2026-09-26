import React from 'react';
import Link from 'next/link';
import { MatrixLabelLogo, ShieldAuditIcon, ChevronRightIcon, CaliperIcon, FileCodeIcon, CheckSymbolIcon } from '@/components/ui/Icons';
import AnnotationWorkbench from '@/components/AnnotationWorkbench';
import IndustrySolutions from '@/components/IndustrySolutions';
import ActiveLearningPipeline from '@/components/ActiveLearningPipeline';
import QualityArchitecture from '@/components/QualityArchitecture';
import DeveloperApiConsole from '@/components/DeveloperApiConsole';
import RoiCostCalculator from '@/components/RoiCostCalculator';
import SpecificationMatrix from '@/components/SpecificationMatrix';

export default function HomePage() {
  return (
    <div className="w-full bg-slate-50 dark:bg-[#0B0F17] min-h-screen text-slate-900 dark:text-slate-100">
      {/* 1. Hero Section */}
      <section className="pt-16 sm:pt-24 pb-20 sm:pb-24 bg-white dark:bg-[#0B0F17] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Category & Status Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-medium rounded-full border border-indigo-200/70 dark:border-indigo-800/70 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Managed Dataset QA Platform</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 text-xs font-mono rounded-full border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span>SLA Guarantee: ≥85.0% IoU</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[58px] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-6">
                Managed Computer Vision Labeling with{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Automated QA.
                </span>
              </h1>

              {/* Lead Paragraph */}
              <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-8 max-w-2xl font-normal">
                Upload image batches directly to encrypted cloud storage. Domain-specialized human annotators deliver pixel-accurate labels while automated blind honeypots audit quality in real time. Download production-ready COCO, YOLO, and Pascal VOC files with an empirical quality certificate.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
                <Link
                  href="/register"
                  className="h-12 px-7 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
                >
                  <span>Start Dataset Project</span>
                  <ChevronRightIcon size={15} />
                </Link>

                <Link
                  href="/pricing"
                  className="h-12 px-7 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center"
                >
                  Volume Rate Schedule
                </Link>
              </div>

              {/* Engineering Guarantees Strip */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckSymbolIcon size={11} />
                  </div>
                  <span>85%+ Minimum IoU SLA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <CheckSymbolIcon size={11} />
                  </div>
                  <span>COCO & YOLO TXT Native</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <CheckSymbolIcon size={11} />
                  </div>
                  <span>Zero Model Training IP</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Detection Simulator Card (5 cols) */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl glass-card p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                      <MatrixLabelLogo size={16} />
                    </div>
                    <div>
                      <span className="font-display text-sm font-bold text-slate-900 dark:text-white block leading-tight">
                        Dataset Pipeline Telemetry
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        CLUSTER-04 // REAL-TIME QA
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>OPERATIONAL</span>
                  </span>
                </div>

                {/* Simulated Camera Sensor Frame with Laser Scanning Line */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 mb-5 border border-slate-800">
                  {/* Background camera image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
                    alt="Autonomous highway camera stream"
                    className="w-full h-full object-cover opacity-85 contrast-105"
                  />

                  {/* Simulated Laser Scan Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] animate-laser-scan pointer-events-none" />

                  {/* Detected Bounding Box 1 */}
                  <div className="absolute top-[28%] left-[22%] w-[38%] h-[48%] border-2 border-indigo-400 bg-indigo-500/15 rounded-sm shadow-sm pointer-events-none">
                    <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-indigo-600 text-white font-mono text-[9px] font-semibold rounded-xs flex items-center gap-1 shadow-xs">
                      <span>commercial_van</span>
                      <span className="text-cyan-200">96.8% IoU</span>
                    </div>
                  </div>

                  {/* Detected Bounding Box 2 */}
                  <div className="absolute top-[45%] right-[16%] w-[20%] h-[38%] border-2 border-emerald-400 bg-emerald-500/15 rounded-sm shadow-sm pointer-events-none">
                    <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-emerald-600 text-white font-mono text-[9px] font-semibold rounded-xs flex items-center gap-1 shadow-xs">
                      <span>sedan</span>
                      <span className="text-emerald-100">94.2% IoU</span>
                    </div>
                  </div>

                  {/* Camera Telemetry Tag */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 backdrop-blur-sm font-mono text-[9px] text-slate-300 rounded-sm">
                    CAM_01 // 60FPS // 1920x1080
                  </div>
                </div>

                {/* Pipeline Stats */}
                <div className="grid grid-cols-3 gap-2.5 font-mono text-center mb-5">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">FLEET IOU</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">94.2%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">HONEYPOTS</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">99.4%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">SLA SPEED</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">7–14 D</span>
                  </div>
                </div>

                {/* Card Action */}
                <Link
                  href="/#demo"
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Test Inspection Workbench Below</span>
                  <ChevronRightIcon size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission-Critical Domain Verticals */}
      <IndustrySolutions />

      {/* 3. Concrete Contextual Product Demo: Annotation Inspection Workbench */}
      <AnnotationWorkbench />

      {/* 4. Active Learning & Model-Assisted Labeling (MAL) Loop */}
      <ActiveLearningPipeline />

      {/* 5. Four-Stage Quality Architecture */}
      <QualityArchitecture />

      {/* 6. Developer REST API & Python SDK Console */}
      <DeveloperApiConsole />

      {/* 8. In-House Team vs. MatrixLabel ROI Cost-Savings Calculator */}
      <RoiCostCalculator />

      {/* 9. Technical Specification Matrix */}
      <SpecificationMatrix />

      {/* 7. Production Guarantee & Compliance Section */}
      <section className="py-20 bg-slate-50 dark:bg-[#0E131F] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="glass-card p-8 sm:p-12 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-slate-200/80 dark:border-slate-800">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-3">
                <ShieldAuditIcon size={14} />
                <span>Zero Risk Quality Benchmark</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                Contractual 85%+ IoU Accuracy Guarantee
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 mb-5 font-normal">
                If any delivered dataset batch falls below your agreed quality benchmark upon independent validation, our engineering team re-labels and verifies the flagged frames within 48 hours at zero incremental cost.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 underline">
                  Terms of Service Agreement
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 underline">
                  Privacy & Data Retention
                </Link>
                <span>•</span>
                <span>GST Invoicing Available</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
              <Link
                href="/register"
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Deploy Labeling Run</span>
                <ChevronRightIcon size={14} />
              </Link>
              <Link
                href="/pricing"
                className="h-12 px-8 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all flex items-center justify-center"
              >
                Calculate Volume Rates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
