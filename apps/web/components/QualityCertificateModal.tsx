'use client';

import React, { useEffect } from 'react';
import { ShieldAuditIcon, CloseIcon, CheckSymbolIcon, FileCodeIcon, CaliperIcon, DownloadIcon } from './ui/Icons';

interface QualityCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId?: string;
  batchTitle?: string;
  iouScore?: string;
  sampleCount?: string;
}

export default function QualityCertificateModal({
  isOpen,
  onClose,
  batchId = 'BATCH-48102',
  batchTitle = 'Autonomous Highway Night 4K',
  iouScore = '94.6%',
  sampleCount = '20,000 frames',
}: QualityCertificateModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close Modal"
        >
          <CloseIcon size={18} />
        </button>

        {/* Certificate Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <ShieldAuditIcon size={22} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Cryptographic Calibration Audit
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Certificate of Quality & Calibration
            </h3>
          </div>
        </div>

        {/* Certificate Metadata Ledger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl text-xs mb-6">
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block mb-1">BATCH IDENTIFIER</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{batchId}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block mb-1">DATASET TITLE</span>
            <span className="font-bold text-slate-900 dark:text-white">{batchTitle}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block mb-1">TOTAL DELIVERED IMAGES</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{sampleCount}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block mb-1">MEASURED MEAN IOU</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1.5">
              <span>{iouScore}</span>
              <span className="text-slate-400 text-[10px] font-normal">(SLA Gate: ≥85.0%)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block mb-1">HONEYPOT CALIBRATION RATIO</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">5.0% (1,000 blind test frames)</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block mb-1">AUDIT STATUS</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PASSED & VERIFIED</span>
            </span>
          </div>
        </div>

        {/* Cryptographic SHA-256 Hash */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px] mb-6">
          <span className="text-slate-400 block mb-1 text-[10px] uppercase font-semibold">
            MANIFEST SHA-256 INTEGRITY HASH
          </span>
          <span className="text-slate-800 dark:text-slate-200 break-all select-all font-semibold">
            e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </span>
        </div>

        {/* Sign-off Details */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500">
          <div>
            <span className="font-medium text-slate-700 dark:text-slate-300">Verified By: Senior Reviewer Node #REV-094</span>
            <span className="block text-slate-400 text-[11px] mt-0.5">
              Timestamp: 2026-09-25T14:32:00Z • SOC2 Type II Attested
            </span>
          </div>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-500/20 transition-all inline-flex items-center gap-2"
          >
            <DownloadIcon size={13} />
            <span>Export Signed Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
