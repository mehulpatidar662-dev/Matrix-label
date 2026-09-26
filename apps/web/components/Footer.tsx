import React from 'react';
import Link from 'next/link';
import { MatrixLabelLogo, ShieldAuditIcon } from './ui/Icons';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] pt-16 pb-12 transition-colors duration-150">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100 dark:border-slate-800">
          {/* Col 1: Identity */}
          <div className="md:col-span-5 pr-0 md:pr-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <MatrixLabelLogo size={20} />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                MatrixLabel
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm mb-5">
              Enterprise computer vision dataset annotation and verification. Automated honeypot validation with guaranteed 85%+ IoU thresholds for production machine learning teams.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 shadow-sm">
              <ShieldAuditIcon size={14} className="text-emerald-500" />
              <span>SOC2 Type II Aligned • DPDP & GDPR Compliant</span>
            </div>
          </div>

          {/* Col 2: Engineering & Tooling */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/#solutions" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Industry Solutions
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Inspection Workbench
                </Link>
              </li>
              <li>
                <Link href="/#active-learning" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Active Learning Loop
                </Link>
              </li>
              <li>
                <Link href="/#qa" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Honeypot QA Protocol
                </Link>
              </li>
              <li>
                <Link href="/#api" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Developer API & SDK
                </Link>
              </li>
              <li>
                <Link href="/#roi" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ROI Feasibility Model
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Volume Rate Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Export Formats */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Export Schemas
            </h4>
            <ul className="space-y-2.5 text-xs font-mono text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>COCO JSON v1.0</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>YOLO Normal TXT</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Pascal VOC XML</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Semantic Masks (PNG)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Compliance & Legal */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Terms of Service (TOS)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li className="text-xs text-slate-400 dark:text-slate-500">
                Zero Model Training IP
              </li>
              <li className="text-xs text-slate-400 dark:text-slate-500">
                30-Day Purge SLA
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 MatrixLabel Systems India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Verification Cluster Operational • SLA 99.98%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
