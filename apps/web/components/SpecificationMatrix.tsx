import React from 'react';
import Link from 'next/link';
import { CaliperIcon, FileCodeIcon, ShieldAuditIcon, ChevronRightIcon } from './ui/Icons';

export default function SpecificationMatrix() {

  const specs = [
    {
      task: 'Classification & Tagging',
      geometry: 'Image-level Multi-label',
      metric: 'Precision / Recall ≥98%',
      rate: '₹1.50 / label',
      formats: 'COCO / CSV / JSON',
      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    {
      task: '2D Bounding Box',
      geometry: '4-coordinate rectangle [x, y, w, h]',
      metric: 'IoU ≥85% (Target ≥92%)',
      rate: '₹5.00 / label',
      formats: 'COCO / YOLO / Pascal VOC',
      badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    {
      task: 'Keypoint Skeletons',
      geometry: 'Ordered joint vertices [x, y, v]',
      metric: 'Object Keypoint Sim (OKS) ≥0.90',
      rate: '₹8.00 / label',
      formats: 'COCO Keypoints / JSON',
      badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    {
      task: 'Polygon Instance Mesh',
      geometry: 'Sub-pixel polygon contours',
      metric: 'Boundary IoU ≥85%',
      rate: '₹12.00 / label',
      formats: 'COCO Poly / YOLOv8 Seg',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    {
      task: 'Semantic Pixel Segmentation',
      geometry: 'Per-pixel class mask (PNG bitmap)',
      metric: 'Mean IoU (mIoU) ≥88%',
      rate: '₹18.00 / label',
      formats: 'Binary Mask PNG / Cityscapes',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
  ];

  return (
    <section id="specs" className="relative w-full bg-slate-50 dark:bg-[#0E131F] py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
              <CaliperIcon size={14} />
              <span>Technical Data Matrix</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Annotation Specifications & Delivery Matrix
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              Strictly standardized geometries with verified benchmark quality gates. Ready for PyTorch, TensorFlow, and Ultralytics training.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/pricing"
              className="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs transition-all inline-flex items-center"
            >
              Volume Rates
            </Link>
            <Link
              href="/register"
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-2"
            >
              <span>Deploy Run</span>
              <ChevronRightIcon size={13} />
            </Link>
          </div>
        </div>

        {/* Specification Table */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Modality Task</th>
                  <th className="py-4 px-6">Geometry & Representation</th>
                  <th className="py-4 px-6">Benchmark Quality Gate</th>
                  <th className="py-4 px-6">Base Rate (INR)</th>
                  <th className="py-4 px-6">Native Export Formats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                {specs.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      <span className={`inline-block px-2.5 py-1 rounded-lg border font-semibold text-xs ${row.badge}`}>
                        {row.task}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono">{row.geometry}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {row.metric}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {row.rate}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300">
                      {row.formats}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Infrastructure & Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-200/60 dark:border-blue-800/60">
              <FileCodeIcon size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Direct Cloud Ingestion
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
              Direct-to-S3 bucket streaming using expiring presigned URLs. No client dataset images touch unencrypted intermediary disk.
            </p>
            <span className="text-[11px] font-mono text-slate-400 block">
              Supports: S3, GCS, Azure Blob, MinIO
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 border border-indigo-200/60 dark:border-indigo-800/60">
              <CaliperIcon size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Strict Schema Compliance
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
              Automated linting validates every exported file against the exact COCO 1.0 JSON and YOLO normalization schemas before release.
            </p>
            <span className="text-[11px] font-mono text-slate-400 block">
              Zero broken bbox coordinates guarantee
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-200/60 dark:border-emerald-800/60">
              <ShieldAuditIcon size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Zero Model Training IP
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
              Contractual and cryptographic assurance that your raw dataset imagery is never repurposed or used to train any external AI models.
            </p>
            <span className="text-[11px] font-mono text-slate-400 block">
              Binding DPA & NDA protection
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
