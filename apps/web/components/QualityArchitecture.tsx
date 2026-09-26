import React from 'react';
import { CaliperIcon, ShieldAuditIcon, FileCodeIcon, CrosshairIcon, CheckSymbolIcon } from './ui/Icons';

export default function QualityArchitecture() {
  const stages = [
    {
      step: '01',
      title: 'Cryptographic Ingestion & Pre-Screening',
      category: 'Data Pipeline',
      description:
        'Images are validated against checksums, corrupt frames are purged, and resolutions are indexed. Optional pre-annotation PII masking sanitizes human faces and vehicle license plates.',
      metrics: ['Direct S3 ingestion via presigned URLs', 'Automated corrupt frame validation', 'Zero model training pipeline guarantee'],
      icon: CrosshairIcon,
      accent: 'from-blue-500 to-indigo-600',
      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    {
      step: '02',
      title: 'Domain-Specialized Human Labeling',
      category: 'Workforce Operations',
      description:
        'Annotators are matched by domain expertise (automotive, surgical, agricultural). Labeling occurs in air-gapped web canvas viewers with no local export or copy permissions.',
      metrics: ['Pixel-accurate polygon & bbox vertices', 'Contractual annotator NDAs', 'Domain-specific guideline onboarding'],
      icon: CaliperIcon,
      accent: 'from-indigo-500 to-purple-600',
      badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    {
      step: '03',
      title: 'Blind Honeypot Automated QA Engine',
      category: 'Quality Assurance',
      description:
        'Between 2% and 5% of all images presented to annotators are pre-annotated ground-truth honeypots. The automated QA engine compares annotator vertices with calibration data in real-time.',
      metrics: ['85%+ IoU minimum threshold enforcement', 'Real-time annotator drift detection', 'Secondary 5% human spot-check audit'],
      icon: ShieldAuditIcon,
      accent: 'from-amber-500 to-orange-600',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    {
      step: '04',
      title: 'Schema Serialization & Delivery Package',
      category: 'Delivery Packaging',
      description:
        'Approved batches are parsed and serialized into production-ready schemas (COCO JSON, YOLO TXT, Pascal VOC XML) accompanied by a cryptographic QA audit report.',
      metrics: ['Strict COCO 1.0 schema compliance', 'Normalized YOLO bounding box coordinates', 'Signed quality certificate and IoU histogram'],
      icon: FileCodeIcon,
      accent: 'from-emerald-500 to-teal-600',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
  ];

  return (
    <section id="qa" className="relative w-full bg-white dark:bg-[#0B0F17] py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="pb-8 mb-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 shadow-sm">
            <ShieldAuditIcon size={14} />
            <span>Verification Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Four-Stage Quality Architecture
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            How MatrixLabel guarantees 85%+ IoU precision: blind honeypot calibration images are invisibly blended into annotator queues to continuously audit label quality in real time.
          </p>
        </div>

        {/* Pipeline Signal Flow Indicator */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 text-xs font-medium">
          <div className="p-3.5 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">01 // S3 Ingestion</span>
            </div>
            <span className="text-blue-500 font-bold hidden sm:inline">→</span>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">02 // Fleet Labeling</span>
            </div>
            <span className="text-indigo-500 font-bold hidden sm:inline">→</span>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">03 // Honeypot Audit</span>
            </div>
            <span className="text-amber-500 font-bold hidden sm:inline">→</span>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">04 // QA Signed</span>
            </div>
            <span className="text-emerald-500 font-bold">✓</span>
          </div>
        </div>

        {/* 4-Stage Sequential Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="group relative bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-indigo-400/50 dark:hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon, Category & Stage Number */}
                  <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stage.accent} text-white flex items-center justify-center shadow-md shadow-indigo-500/10`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        {stage.category}
                      </span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${stage.badge}`}>
                      STAGE {stage.step}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {stage.description}
                  </p>
                </div>

                {/* Metrics list with clean technical bullet markers */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                  {stage.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
                        <CheckSymbolIcon size={11} />
                      </span>
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit Metrics Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold mb-1">
              <ShieldAuditIcon size={12} />
              <span>Verifiable Cryptographic Proof</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Comprehensive Audit Reports Included With Every Batch
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Every delivery includes an automated cryptographic audit report documenting honeypot pass rates, IoU distribution histograms, and reviewer spot-check notes.
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 shrink-0 relative z-10 pt-2 md:pt-0">
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-medium">AVG DELIVERED IOU</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">94.2%</span>
            </div>
            <div className="border-l border-slate-700/80 pl-6 sm:pl-8">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-medium">HONEYPOT RATIO</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300">1 in 20</span>
            </div>
            <div className="border-l border-slate-700/80 pl-6 sm:pl-8">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-medium">SPOT CHECK</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-300">5.0%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
