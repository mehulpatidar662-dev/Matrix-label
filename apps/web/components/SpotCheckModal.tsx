'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAuditIcon,
  CloseIcon,
  CheckSymbolIcon,
  CaliperIcon,
  CrosshairIcon,
  ChevronRightIcon,
} from './ui/Icons';

interface SpotCheckFrame {
  id: string;
  frameIndex: number;
  fileName: string;
  annotatorA: string;
  annotatorB: string;
  consensusIou: number;
  label: string;
  coordsA: { x: number; y: number; w: number; h: number };
  coordsB: { x: number; y: number; w: number; h: number };
  status: 'passed' | 'recalibrated';
  notes: string;
}

interface SpotCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  batchName: string;
}

const SAMPLE_FRAMES: SpotCheckFrame[] = [
  {
    id: 'frm-001',
    frameIndex: 104,
    fileName: 'frame_000104_rgb.png',
    annotatorA: 'ANN-4821 (Lead)',
    annotatorB: 'ANN-5192 (Consensus)',
    consensusIou: 0.962,
    label: 'commercial_van',
    coordsA: { x: 22, y: 34, w: 34, h: 42 },
    coordsB: { x: 23, y: 35, w: 33, h: 41 },
    status: 'passed',
    notes: 'Sub-pixel alignment across rear license plate and roof rack.',
  },
  {
    id: 'frm-002',
    frameIndex: 289,
    fileName: 'frame_000289_rgb.png',
    annotatorA: 'ANN-4821 (Lead)',
    annotatorB: 'ANN-5192 (Consensus)',
    consensusIou: 0.941,
    label: 'pedestrian',
    coordsA: { x: 62, y: 46, w: 12, h: 36 },
    coordsB: { x: 61, y: 45, w: 13, h: 37 },
    status: 'passed',
    notes: 'Tight bounding perimeter enclosing pedestrian shadow boundary per spec.',
  },
  {
    id: 'frm-003',
    frameIndex: 412,
    fileName: 'frame_000412_rgb.png',
    annotatorA: 'ANN-3910 (Lead)',
    annotatorB: 'ANN-5192 (Consensus)',
    consensusIou: 0.915,
    label: 'sedan_vehicle',
    coordsA: { x: 70, y: 50, w: 24, h: 32 },
    coordsB: { x: 71, y: 51, w: 23, h: 31 },
    status: 'passed',
    notes: 'Partial headlight occlusion correctly included in target boundary.',
  },
  {
    id: 'frm-004',
    frameIndex: 650,
    fileName: 'frame_000650_rgb.png',
    annotatorA: 'ANN-3910 (Lead)',
    annotatorB: 'ANN-4821 (Consensus)',
    consensusIou: 0.978,
    label: 'cyclist',
    coordsA: { x: 40, y: 42, w: 16, h: 38 },
    coordsB: { x: 40, y: 42, w: 16, h: 38 },
    status: 'passed',
    notes: 'Near-identical coordinate match (97.8% IoU overlap).',
  },
  {
    id: 'frm-005',
    frameIndex: 820,
    fileName: 'frame_000820_rgb.png',
    annotatorA: 'ANN-4821 (Lead)',
    annotatorB: 'ANN-3910 (Consensus)',
    consensusIou: 0.954,
    label: 'traffic_sign',
    coordsA: { x: 84, y: 22, w: 9, h: 18 },
    coordsB: { x: 84, y: 22, w: 9, h: 18 },
    status: 'passed',
    notes: 'Octagonal stop sign boundary verified against blind honeypot reference.',
  },
];

export default function SpotCheckModal({
  isOpen,
  onClose,
  batchId,
  batchName,
}: SpotCheckModalProps) {
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
  const [showAnnotatorB, setShowAnnotatorB] = useState(true);
  const [approvedFrames, setApprovedFrames] = useState<Record<string, boolean>>({
    'frm-001': true,
    'frm-002': true,
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentFrame = SAMPLE_FRAMES[selectedFrameIndex];
  const isApproved = approvedFrames[currentFrame.id] ?? false;

  const toggleApproval = (frameId: string) => {
    setApprovedFrames((prev) => ({
      ...prev,
      [frameId]: !prev[frameId],
    }));
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
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 relative max-h-[92vh] flex flex-col shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close Modal"
        >
          <CloseIcon size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 dark:border-slate-800 mb-6 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <CaliperIcon size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Randomized 5% Spot Check Audit
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {batchName} ({batchId})
            </h3>
          </div>
        </div>

        {/* Body Layout: Left Selector, Right Viewer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto pr-1">
          {/* Left: Frame Selector List (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Audit Sample Queue (5 Frames)
            </div>

            {SAMPLE_FRAMES.map((frame, index) => {
              const frameApproved = approvedFrames[frame.id] ?? false;
              const isSelected = selectedFrameIndex === index;

              return (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrameIndex(index)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500/20'
                      : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      Frame #{frame.frameIndex}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {frame.label}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {(frame.consensusIou * 100).toFixed(1)}% IoU
                    </div>
                    <div className="text-[11px] flex items-center justify-end gap-1 mt-0.5">
                      {frameApproved ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                          <CheckSymbolIcon size={11} />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Inspection Visual Canvas & Metrics (8 cols) */}
          <div className="md:col-span-8 space-y-4">
            {/* Visual Canvas Simulator */}
            <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg">
              {/* Synthetic Camera Grid Background */}
              <div className="absolute inset-0 bg-[#0A0D14] flex items-center justify-center">
                <span className="font-mono text-xs text-slate-600 uppercase tracking-widest">
                  [CAMERA FEED RGB 1920x1080 - {currentFrame.fileName}]
                </span>
              </div>

              {/* SVG Overlays for Annotator A and Annotator B */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Annotator A (Primary Lead) - Indigo / Solid */}
                <rect
                  x={`${currentFrame.coordsA.x}%`}
                  y={`${currentFrame.coordsA.y}%`}
                  width={`${currentFrame.coordsA.w}%`}
                  height={`${currentFrame.coordsA.h}%`}
                  fill="rgba(99, 102, 241, 0.18)"
                  stroke="#6366F1"
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x={`${currentFrame.coordsA.x}%`}
                  y={`${currentFrame.coordsA.y - 2}%`}
                  fill="#818CF8"
                  fontSize="11"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  ANN-A: {currentFrame.label}
                </text>

                {/* Annotator B (Consensus Double-Check) - Cyan / Dashed */}
                {showAnnotatorB && (
                  <>
                    <rect
                      x={`${currentFrame.coordsB.x}%`}
                      y={`${currentFrame.coordsB.y}%`}
                      width={`${currentFrame.coordsB.w}%`}
                      height={`${currentFrame.coordsB.h}%`}
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      rx="4"
                    />
                    <text
                      x={`${currentFrame.coordsB.x}%`}
                      y={`${currentFrame.coordsB.y + currentFrame.coordsB.h + 5}%`}
                      fill="#22D3EE"
                      fontSize="11"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      ANN-B: Consensus Verification
                    </text>
                  </>
                )}
              </svg>

              {/* Top Banner Tag */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-slate-900/90 backdrop-blur-md text-[11px] text-white rounded-full border border-slate-700/80 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Consensus Overlap: <strong>{(currentFrame.consensusIou * 100).toFixed(1)}% IoU</strong></span>
              </div>
            </div>

            {/* Inspection Controls & Metrics */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl text-xs space-y-3.5">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200/70 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    LEAD ANNOTATOR
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {currentFrame.annotatorA}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    CONSENSUS AUDITOR
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {currentFrame.annotatorB}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                  AUDIT NOTES
                </span>
                <p className="text-slate-700 dark:text-slate-300">{currentFrame.notes}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setShowAnnotatorB(!showAnnotatorB)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  {showAnnotatorB ? 'Hide Auditor Layer' : 'Show Auditor Layer'}
                </button>

                <button
                  onClick={() => toggleApproval(currentFrame.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm ${
                    isApproved
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <CheckSymbolIcon size={14} />
                  <span>{isApproved ? 'Approved by Client' : 'Mark as Approved'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <span>
            {Object.values(approvedFrames).filter(Boolean).length} of 5 frames approved
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:bg-black dark:hover:bg-white transition-all shadow-sm"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
}
