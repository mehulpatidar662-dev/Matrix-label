import React from 'react';
import Link from 'next/link';
import { ShieldAuditIcon, FileCodeIcon, CaliperIcon, MatrixLabelLogo } from './ui/Icons';

export default function AuthSidePanel() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-l border-slate-800 p-12 lg:p-16 flex-col justify-between text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-[420px] my-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-6">
          <MatrixLabelLogo size={14} />
          <span>MatrixLabel Enterprise</span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-5">
          Verified Ground Truth for Production Vision Models.
        </h2>

        <p className="text-sm leading-relaxed text-slate-300 mb-8">
          Upload image batches, monitor live honeypot validation metrics, and download delivery-ready COCO, YOLO, and Pascal VOC packages with guaranteed 85%+ IoU thresholds.
        </p>

        {/* Technical specifications ledger */}
        <div className="space-y-4 border-t border-slate-800/80 pt-6 text-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <ShieldAuditIcon size={16} />
            </div>
            <div>
              <span className="font-bold text-white block text-sm">85%+ Minimum IoU Guarantee</span>
              <span className="text-slate-400">Continuous automated calibration against blind honeypot frames.</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <FileCodeIcon size={16} />
            </div>
            <div>
              <span className="font-bold text-white block text-sm">Multi-Schema Export Engine</span>
              <span className="text-slate-400">Strict schema linting for COCO JSON and normalized YOLO TXT.</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <CaliperIcon size={16} />
            </div>
            <div>
              <span className="font-bold text-white block text-sm">Client Data IP Ringfencing</span>
              <span className="text-slate-400">Strict zero AI foundation model training on client datasets.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-400 relative z-10">
        <Link
          href="/"
          className="hover:text-white transition-colors inline-flex items-center gap-1.5"
        >
          <span>← Back to Overview</span>
        </Link>
      </div>
    </div>
  );
}
