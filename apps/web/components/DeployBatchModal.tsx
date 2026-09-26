'use client';

import React, { useState, useEffect } from 'react';
import {
  CloseIcon,
  ShieldAuditIcon,
  CaliperIcon,
  ChevronRightIcon,
  UploadCloudIcon,
  CheckSymbolIcon,
} from './ui/Icons';
import { formatINR } from '@/lib/pricing';

export interface NewBatchPayload {
  id: string;
  name: string;
  modality: 'Bounding Box' | 'Polygon Seg' | 'Keypoint';
  frames: number;
  completedFrames: number;
  progressPct: number;
  iouScore: number;
  slaDeadline: string;
  status: 'In Progress' | 'Delivered' | 'QA Verification';
  cocoUrl: string;
  yoloUrl: string;
}

interface DeployBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (batch: NewBatchPayload) => void;
}

export default function DeployBatchModal({
  isOpen,
  onClose,
  onDeploy,
}: DeployBatchModalProps) {
  const [name, setName] = useState('Autonomous-Highway-Rain-Batch-005');
  const [modality, setModality] = useState<'Bounding Box' | 'Polygon Seg' | 'Keypoint'>('Bounding Box');
  const [frames, setFrames] = useState<number>(25000);
  const [targetIou, setTargetIou] = useState<number>(90);
  const [turnaround, setTurnaround] = useState<'standard' | 'fast-track'>('standard');
  const [s3Path, setS3Path] = useState('s3://prod-cv-ingest-apse1/fleet-v5/raw-frames/');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Rate calculation
  const labelsPerFrame = modality === 'Bounding Box' ? 6 : modality === 'Polygon Seg' ? 4 : 8;
  const totalLabels = frames * labelsPerFrame;
  const baseRate = modality === 'Bounding Box' ? 5.0 : modality === 'Polygon Seg' ? 12.0 : 8.0;

  // Rebate
  let rebatePct = 0;
  if (totalLabels >= 250000) rebatePct = 0.2;
  else if (totalLabels >= 100000) rebatePct = 0.15;
  else if (totalLabels >= 50000) rebatePct = 0.1;
  else if (totalLabels >= 25000) rebatePct = 0.06;

  const subtotal = totalLabels * baseRate;
  const discount = subtotal * rebatePct;
  const turnaroundMultiplier = turnaround === 'fast-track' ? 1.25 : 1.0;
  const totalEstimate = (subtotal - discount) * turnaroundMultiplier;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newBatch: NewBatchPayload = {
        id: `BATCH-${Math.floor(10000 + Math.random() * 90000)}`,
        name,
        modality,
        frames,
        completedFrames: 0,
        progressPct: 4,
        iouScore: Number(targetIou.toFixed(1)),
        slaDeadline: turnaround === 'fast-track' ? '2026-10-02' : '2026-10-09',
        status: 'In Progress',
        cocoUrl: '#',
        yoloUrl: '#',
      };
      onDeploy(newBatch);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 relative max-h-[92vh] flex flex-col shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close Modal"
        >
          <CloseIcon size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 dark:border-slate-800 mb-6 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <UploadCloudIcon size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Direct Ingestion Dispatch
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Deploy Managed Labeling Batch
            </h3>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 text-xs">
          {/* Batch Name */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 uppercase text-[11px] tracking-wider">
              Dataset Batch Identifier
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>

          {/* Modality Selector */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 uppercase text-[11px] tracking-wider">
              Annotation Modality
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Bounding Box', 'Polygon Seg', 'Keypoint'] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setModality(m)}
                  className={`h-10 border rounded-xl font-semibold transition-all ${
                    modality === m
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Volume Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-slate-700 dark:text-slate-300 font-semibold uppercase text-[11px] tracking-wider">Dataset Volume</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {frames.toLocaleString()} frames (~{totalLabels.toLocaleString()} labels)
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={150000}
              step={1000}
              value={frames}
              onChange={(e) => setFrames(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* S3 Storage Prefix */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 uppercase text-[11px] tracking-wider">
              Presigned Cloud Storage Path
            </label>
            <input
              type="text"
              value={s3Path}
              onChange={(e) => setS3Path(e.target.value)}
              required
              className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-indigo-500"
            />
          </div>

          {/* Target IoU & Turnaround */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 uppercase text-[11px] tracking-wider">
                IoU Calibration Benchmark
              </label>
              <select
                value={targetIou}
                onChange={(e) => setTargetIou(Number(e.target.value))}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
              >
                <option value={85}>85.0% Minimum (Standard SLA)</option>
                <option value={90}>90.0% High Fidelity</option>
                <option value={95}>95.0% Extreme Ground Truth</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 uppercase text-[11px] tracking-wider">
                Turnaround SLA Tier
              </label>
              <select
                value={turnaround}
                onChange={(e) => setTurnaround(e.target.value as any)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
              >
                <option value="standard">Standard (14 Business Days)</option>
                <option value="fast-track">Fast-Track (7 Business Days)</option>
              </select>
            </div>
          </div>

          {/* Unit Economics Summary Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-slate-500">
              <span>ESTIMATED UNIT RATE:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                ₹{baseRate.toFixed(2)} / label
              </span>
            </div>
            {rebatePct > 0 && (
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                <span>VOLUME REBATE ({(rebatePct * 100).toFixed(0)}%):</span>
                <span>-{formatINR(discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700 flex justify-between items-center font-bold">
              <span className="text-slate-900 dark:text-white">TOTAL ESTIMATED RUN:</span>
              <span className="text-base text-indigo-600 dark:text-indigo-400">
                {formatINR(totalEstimate)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold transition-all inline-flex items-center gap-2 shadow-md shadow-indigo-500/20"
            >
              <UploadCloudIcon size={14} />
              <span>{isSubmitting ? 'Dispatching Run...' : 'Dispatch Labeling Run'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
