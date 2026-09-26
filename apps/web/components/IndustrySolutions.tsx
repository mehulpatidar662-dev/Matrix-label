'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CarIcon,
  ActivityIcon,
  CpuIcon,
  GlobeIcon,
  ShieldAuditIcon,
  ChevronRightIcon,
  CheckSymbolIcon,
  CaliperIcon,
  FileCodeIcon,
} from './ui/Icons';

interface IndustryVertical {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  tagline: string;
  iouThreshold: string;
  turnaroundSla: string;
  sensors: string[];
  taxonomies: string[];
  compliance: string[];
  description: string;
  sampleImage: string;
  annotationsCount: string;
  schemaBadge: string;
}

const VERTICALS: IndustryVertical[] = [
  {
    id: 'automotive',
    name: 'Autonomous Mobility & ADAS',
    shortName: 'Autonomous ADAS',
    icon: CarIcon,
    tagline: 'High-density perception for Level 2+ to Level 4 autonomous fleets',
    iouThreshold: '≥92.0% IoU Guaranteed',
    turnaroundSla: '7-Day Fast Track',
    sensors: ['Automotive HDR Cameras (60 FPS)', 'LIDAR Point Clouds (LiDAR 3D)', 'Fisheye Surround View 360°'],
    taxonomies: ['Pedestrian Truncations', 'Vulnerable Road Users (VRU)', 'Traffic Sign Matrix', 'Vehicle Sub-types', 'Lane Boundaries'],
    compliance: ['ASIL-D Pipeline Safety', 'ISO 26262 Aligned', 'Automated License Plate & Face PII Redaction'],
    description:
      'Train robust perception models that perform under adverse rain, night glare, and highway construction zones. Every batch is calibrated with blind edge-case honeypots to eliminate false negatives.',
    sampleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    annotationsCount: '20,000 frames/run',
    schemaBadge: 'nuScenes & COCO 1.0 JSON',
  },
  {
    id: 'medical',
    name: 'Surgical Robotics & Healthcare AI',
    shortName: 'Surgical & Medical',
    icon: ActivityIcon,
    tagline: 'Sub-pixel polygon contours and surgical tool tracking for clinical systems',
    iouThreshold: '≥95.0% Sub-pixel IoU',
    turnaroundSla: '10-Day Verified',
    sensors: ['Laparoscopic 4K Endoscopy', 'Microscopic Pathology', 'Ultrasound & Fluoroscopy Video'],
    taxonomies: ['Organ Tissue Perimeters', 'Surgical Tool Shaft & Jaws', 'Vessel Hemorrhage Boundaries', 'Needle Trajectory Keypoints'],
    compliance: ['HIPAA Compliant Ingestion', 'FDA SaMD Quality Audit Trail', 'Air-Gapped US/EU Data Residencies'],
    description:
      'Engineered specifically for medical device manufacturers and surgical robotics teams. Annotations are verified by domain specialists with dual-annotator consensus to guarantee sub-millimeter precision.',
    sampleImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    annotationsCount: '15,000 frames/run',
    schemaBadge: 'COCO Instance & DICOM JSON',
  },
  {
    id: 'industrial',
    name: 'Semiconductor & Industrial Robotics',
    shortName: 'Industrial & Defect',
    icon: CpuIcon,
    tagline: 'Micro-defect segmentation and assembly validation for high-speed manufacturing',
    iouThreshold: '≥94.0% Mean IoU',
    turnaroundSla: '5-Day Priority',
    sensors: ['High-Speed 20MP Line Scan', 'Automated Optical Inspection (AOI)', 'Thermal IR Sensors'],
    taxonomies: ['PCB Solder Bridging', 'Die Surface Micro-cracks', 'Component Misalignment', 'Foreign Object Debris (FOD)'],
    compliance: ['IPC-A-610 Workmanship Auditing', 'Non-Disclosure Ringfencing', 'Zero Cloud Retention On Completion'],
    description:
      'Eliminate escape defects in high-volume electronics and precision manufacturing. Automated linting verifies that pixel defect masks align precisely with micron-level tolerance specifications.',
    sampleImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    annotationsCount: '50,000 frames/run',
    schemaBadge: 'Pixel Mask PNG & YOLOv8 Seg',
  },
  {
    id: 'geospatial',
    name: 'Geospatial & Aerial Defense Intelligence',
    shortName: 'Geospatial & Drone',
    icon: GlobeIcon,
    tagline: 'Multispectral satellite and drone canopy segmentation at planetary scale',
    iouThreshold: '≥91.5% Boundary IoU',
    turnaroundSla: '14-Day Standard',
    sensors: ['Sentinel-2 / WorldView Satellite', 'RTK Multispectral Drones', 'FLIR High-Resolution Thermal'],
    taxonomies: ['Building Footprint Polygons', 'Crop Canopy Vegetative Stress', 'Vessel & Aircraft Detection', 'Road Network Graphs'],
    compliance: ['ITAR / EAR Compliant Personnel', 'Encrypted GeoTIFF Pipeline', 'Deterministic Coordinate Projections'],
    description:
      'High-throughput vectorization for agricultural monitoring, disaster management, and infrastructure inspection. Automated bounding polygon checks eliminate topology errors and overlapping vertices.',
    sampleImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    annotationsCount: '10,000 frames/run',
    schemaBadge: 'GeoJSON & COCO Keypoints',
  },
];

export default function IndustrySolutions() {
  const [activeVerticalId, setActiveVerticalId] = useState('automotive');
  const activeVertical = VERTICALS.find((v) => v.id === activeVerticalId) || VERTICALS[0];
  const Icon = activeVertical.icon;

  return (
    <section id="solutions" className="relative w-full bg-white dark:bg-[#0B0F17] py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="pb-8 mb-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 shadow-xs">
            <ShieldAuditIcon size={14} />
            <span>Mission-Critical Domain Specialization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Domain-Engineered Annotation Verticals
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Generic labeling fails when precision determines life-or-death decisions. MatrixLabel deploys pre-configured domain taxonomies, specialized annotators, and tailored quality gates.
          </p>
        </div>

        {/* Vertical Switcher Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-8">
          {VERTICALS.map((v) => {
            const VIcon = v.icon;
            const isSelected = v.id === activeVerticalId;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVerticalId(v.id)}
                className={`py-3 px-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/70 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <VIcon size={16} />
                <span className="truncate">{v.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Vertical Detail Showcase Card */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {activeVertical.iouThreshold}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  SLA: {activeVertical.turnaroundSla}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                  {activeVertical.schemaBadge}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeVertical.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {activeVertical.description}
              </p>
            </div>

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Sensors */}
              <div className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Supported Sensor Inputs
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  {activeVertical.sensors.map((s, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Taxonomies */}
              <div className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Pre-Configured Taxonomies
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  {activeVertical.taxonomies.map((t, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Compliance Guarantee Strip */}
            <div className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 font-bold uppercase text-[11px] mr-1">Regulatory Gateways:</span>
              {activeVertical.compliance.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <CheckSymbolIcon size={13} />
                  <span>{c}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/register"
                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
              >
                <span>Deploy {activeVertical.shortName} Run</span>
                <ChevronRightIcon size={14} />
              </Link>
              <Link
                href="/pricing"
                className="h-11 px-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition-all inline-flex items-center"
              >
                View Volume Rate Schedule
              </Link>
            </div>
          </div>

          {/* Right Visual Simulated Sensor Feed (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeVertical.sampleImage}
                alt={activeVertical.name}
                className="w-full aspect-[4/3] object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />

              {/* Sensor HUD Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-4 sm:p-5 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-wider border border-white/10">
                    FEED // {activeVertical.id.toUpperCase()}_CHANNEL_01
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/90 text-white font-mono text-[10px] font-bold">
                    QA ACTIVE
                  </span>
                </div>

                <div className="space-y-1 text-white font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Mean Verified IoU</span>
                    <span className="text-emerald-400 font-bold">{activeVertical.iouThreshold.replace(' Guaranteed', '')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Target Volume</span>
                    <span>{activeVertical.annotationsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
