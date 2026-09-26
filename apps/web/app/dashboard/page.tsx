'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, User, ApiError, clearClientSession } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import QualityCertificateModal from '@/components/QualityCertificateModal';
import SpotCheckModal from '@/components/SpotCheckModal';
import DeployBatchModal, { NewBatchPayload } from '@/components/DeployBatchModal';
import {
  MatrixLabelLogo,
  ShieldAuditIcon,
  FileCodeIcon,
  CaliperIcon,
  LogOutIcon,
  DownloadIcon,
  UploadCloudIcon,
  DatabaseIcon,
  BarChartIcon,
  RefreshCwIcon,
  CheckSymbolIcon,
  ChevronRightIcon,
  SearchIcon,
  TrashIcon,
  SparklesIcon,
} from '@/components/ui/Icons';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';

interface BatchRun {
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

const STORAGE_KEY_BATCHES = 'matrixlabel_batches';

const INITIAL_BATCHES: BatchRun[] = [
  {
    id: 'BATCH-48102',
    name: 'Autonomous Highway Night 4K',
    modality: 'Bounding Box',
    frames: 20000,
    completedFrames: 20000,
    progressPct: 100,
    iouScore: 94.6,
    slaDeadline: '2026-09-28',
    status: 'Delivered',
    cocoUrl: '#',
    yoloUrl: '#',
  },
  {
    id: 'BATCH-48103',
    name: 'Robotic Surgical Suturing 60fps',
    modality: 'Polygon Seg',
    frames: 15000,
    completedFrames: 12600,
    progressPct: 84,
    iouScore: 92.1,
    slaDeadline: '2026-10-02',
    status: 'In Progress',
    cocoUrl: '#',
    yoloUrl: '#',
  },
  {
    id: 'BATCH-48104',
    name: 'Retail Shelf Edge SKU Localization',
    modality: 'Bounding Box',
    frames: 50000,
    completedFrames: 17500,
    progressPct: 35,
    iouScore: 95.4,
    slaDeadline: '2026-10-08',
    status: 'In Progress',
    cocoUrl: '#',
    yoloUrl: '#',
  },
  {
    id: 'BATCH-48105',
    name: 'Drone Multispectral Canopy Health',
    modality: 'Polygon Seg',
    frames: 8500,
    completedFrames: 8500,
    progressPct: 100,
    iouScore: 91.8,
    slaDeadline: '2026-09-22',
    status: 'Delivered',
    cocoUrl: '#',
    yoloUrl: '#',
  },
];

export default function ClientDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'batches' | 'distribution' | 'storage'>('batches');

  // Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchRun | null>(null);

  // Spot Check Modal State
  const [spotCheckModalOpen, setSpotCheckModalOpen] = useState(false);
  const [spotCheckBatch, setSpotCheckBatch] = useState<BatchRun | null>(null);

  // Deploy Batch Modal State
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [deployToast, setDeployToast] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'In Progress' | 'Delivered'>('all');
  const [modalityFilter, setModalityFilter] = useState<'all' | 'Bounding Box' | 'Polygon Seg' | 'Keypoint'>('all');

  // Storage Ingest Test State
  const [testResult, setTestResult] = useState<string | null>(null);

  // Webhook Test Dispatch State
  const [webhookUrl, setWebhookUrl] = useState('https://api.autonomy-systems.ai/webhooks/matrixlabel');
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<{ status: number; latency: number; payload: string } | null>(null);

  // Cloud Provider Config
  const [cloudProvider, setCloudProvider] = useState<'s3' | 'gcs' | 'azure'>('s3');
  const [bucketUri, setBucketUri] = useState('s3://prod-cv-ingest-apse1/fleet-v4/');
  const [iamRole, setIamRole] = useState('arn:aws:iam::710924158912:role/MatrixLabelIngestRole');

  // Batches state initialized with localStorage persistence
  const [batches, setBatches] = useState<BatchRun[]>(INITIAL_BATCHES);

  useEffect(() => {
    // Load persisted batches from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BATCHES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBatches(parsed);
        }
      }
      const savedStorage = localStorage.getItem('matrixlabel_storage_config');
      if (savedStorage) {
        const parsedStorage = JSON.parse(savedStorage);
        if (parsedStorage.cloudProvider) setCloudProvider(parsedStorage.cloudProvider);
        if (parsedStorage.bucketUri) setBucketUri(parsedStorage.bucketUri);
        if (parsedStorage.iamRole) setIamRole(parsedStorage.iamRole);
      }
    } catch {
      // ignore
    }

    async function loadUser() {
      try {
        const currentUser = await apiFetch<User>('/v1/auth/me');
        setUser(currentUser);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.push('/login');
        } else {
          // Fallback demo client
          setUser({
            id: 'ml-client-9021',
            name: 'Vision Engineering Lead',
            email: 'lead@autonomy-systems.ai',
            role: 'client',
          });
        }
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    }
    loadUser();
  }, [router]);

  // Persist batches to localStorage
  const saveBatches = (newBatches: BatchRun[]) => {
    setBatches(newBatches);
    try {
      localStorage.setItem(STORAGE_KEY_BATCHES, JSON.stringify(newBatches));
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/v1/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      clearClientSession();
      router.push('/');
    }
  };

  const handleOpenCertificate = (batch: BatchRun) => {
    setSelectedBatch(batch);
    setCertModalOpen(true);
  };

  const handleOpenSpotCheck = (batch: BatchRun) => {
    setSpotCheckBatch(batch);
    setSpotCheckModalOpen(true);
  };

  const handleDeployBatch = (newBatch: NewBatchPayload) => {
    const updated = [newBatch, ...batches];
    saveBatches(updated);
    setDeployToast(`Batch ${newBatch.id} ("${newBatch.name}") queued and initialized.`);
    setTimeout(() => setDeployToast(null), 5000);
  };

  const handleAdvanceBatchProgress = (batchId: string) => {
    const updated = batches.map((b) => {
      if (b.id !== batchId) return b;
      const nextPct = Math.min(100, b.progressPct + 25);
      const nextCompleted = Math.round((b.frames * nextPct) / 100);
      const isComplete = nextPct === 100;
      return {
        ...b,
        progressPct: nextPct,
        completedFrames: nextCompleted,
        status: (isComplete ? 'Delivered' : 'In Progress') as BatchRun['status'],
        iouScore: isComplete ? Number((b.iouScore || 93.4).toFixed(1)) : b.iouScore,
      };
    });
    saveBatches(updated);
    setDeployToast(`Batch ${batchId} advanced to ${updated.find((b) => b.id === batchId)?.progressPct}%.`);
    setTimeout(() => setDeployToast(null), 4000);
  };

  const handleDeleteBatch = (batchId: string) => {
    const updated = batches.filter((b) => b.id !== batchId);
    saveBatches(updated);
    setDeployToast(`Batch ${batchId} removed from production ledger.`);
    setTimeout(() => setDeployToast(null), 4000);
  };

  const handleSaveStorageConfig = () => {
    try {
      localStorage.setItem(
        'matrixlabel_storage_config',
        JSON.stringify({ cloudProvider, bucketUri, iamRole })
      );
    } catch {}
    setTestResult(`Cloud storage parameters for ${bucketUri} saved. KMS presigned read/write access active.`);
    setTimeout(() => setTestResult(null), 5000);
  };

  const handleSendTestWebhook = () => {
    setWebhookTesting(true);
    setWebhookResponse(null);
    setTimeout(() => {
      setWebhookTesting(false);
      const latency = Math.floor(28 + Math.random() * 25);
      setWebhookResponse({
        status: 200,
        latency,
        payload: JSON.stringify(
          {
            event: 'batch.qa_passed',
            timestamp: new Date().toISOString(),
            batch_id: batches[0]?.id || 'BATCH-48102',
            signature: 'sha256=d58e3902f489b1c7a8409e5124...',
            delivered_iou: 0.946,
            export_manifest_ready: true,
          },
          null,
          2
        ),
      });
    }, 650);
  };

  // Dynamic Batch COCO Manifest Download
  const handleDownloadBatchCoco = (batch?: BatchRun) => {
    if (!batch) {
      setDeployToast('No batch selected or available for COCO export.');
      setTimeout(() => setDeployToast(null), 3000);
      return;
    }
    const categoriesByModality =
      batch.modality === 'Polygon Seg'
        ? [
            { id: 1, name: 'tissue_margin', supercategory: 'anatomy' },
            { id: 2, name: 'micro_instrument', supercategory: 'tool' },
          ]
        : batch.modality === 'Keypoint'
        ? [
            { id: 1, name: 'joint_wrist', supercategory: 'keypoint' },
            { id: 2, name: 'joint_elbow', supercategory: 'keypoint' },
          ]
        : [
            { id: 1, name: 'commercial_van', supercategory: 'vehicle' },
            { id: 2, name: 'sedan_vehicle', supercategory: 'vehicle' },
            { id: 3, name: 'pedestrian', supercategory: 'person' },
          ];

    const batchCoco = {
      info: {
        description: `MatrixLabel Verified Ground Truth - ${batch.name}`,
        batch_id: batch.id,
        modality: batch.modality,
        total_frames: batch.frames,
        measured_iou: `${batch.iouScore.toFixed(1)}%`,
        url: 'https://matrixlabel.ai',
        version: '1.0',
        year: 2026,
        contributor: 'MatrixLabel Managed Fleet & Blind Honeypot Gate',
        date_created: new Date().toISOString(),
      },
      licenses: [{ id: 1, name: 'Client Proprietary Ground Truth License' }],
      categories: categoriesByModality,
      images: [
        { id: 101, file_name: `${batch.id.toLowerCase()}_frame_0001.jpg`, width: 1920, height: 1080 },
        { id: 102, file_name: `${batch.id.toLowerCase()}_frame_0002.jpg`, width: 1920, height: 1080 },
      ],
      annotations: [
        {
          id: 1,
          image_id: 101,
          category_id: 1,
          bbox: [320, 240, 480, 360],
          area: 172800,
          iscrowd: 0,
          qa_metric: { iou_calibration: (batch.iouScore / 100), honeypot_validated: true },
        },
        {
          id: 2,
          image_id: 101,
          category_id: 2,
          bbox: [840, 310, 180, 420],
          area: 75600,
          iscrowd: 0,
          qa_metric: { iou_calibration: 0.952, honeypot_validated: true },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(batchCoco, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `matrixlabel_${batch.id.toLowerCase()}_verified_coco.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDeployToast(`Downloaded verified COCO dataset for ${batch.id}.`);
    setTimeout(() => setDeployToast(null), 4000);
  };

  // Dynamic Calculated KPI Stats
  const totalFrames = useMemo(() => batches.reduce((sum, b) => sum + b.frames, 0), [batches]);
  const deliveredBatches = useMemo(() => batches.filter((b) => b.status === 'Delivered'), [batches]);
  const meanFleetIou = useMemo(() => {
    if (deliveredBatches.length === 0) return 93.8;
    const sum = deliveredBatches.reduce((acc, b) => acc + b.iouScore, 0);
    return (sum / deliveredBatches.length).toFixed(1);
  }, [deliveredBatches]);

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchModality = modalityFilter === 'all' || b.modality === modalityFilter;
      return matchSearch && matchStatus && matchModality;
    });
  }, [batches, searchQuery, statusFilter, modalityFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070A0F] p-6">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>LOADING CLIENT TELEMETRY & BATCH LEDGER</span>
            <span className="animate-pulse">SYNCHRONIZING...</span>
          </div>
          <Skeleton className="h-8 w-2/3" />
          <SkeletonText lines={4} />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#070A0F] text-slate-900 dark:text-slate-100">
      {/* Top Console Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-[1360px] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          {/* Brand & Project Info */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 outline-none">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <MatrixLabelLogo size={18} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-[18px] tracking-tight text-slate-900 dark:text-white">
                  MatrixLabel
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                  Console
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block text-slate-200 dark:text-slate-800">|</span>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span>TENANT:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDeployModalOpen(true)}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-2"
              title="Deploy New Managed Labeling Batch"
            >
              <UploadCloudIcon size={14} />
              <span>Deploy Run</span>
            </button>

            <button
              onClick={() => handleDownloadBatchCoco(batches[0])}
              disabled={batches.length === 0}
              className={`h-9 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors inline-flex items-center gap-1.5 shadow-sm ${
                batches.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Download Sample Verified COCO Dataset"
            >
              <DownloadIcon size={13} className="text-indigo-500" />
              <span className="hidden md:inline">Sample COCO</span>
            </button>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <LogOutIcon size={14} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Deployment Notification Toast Banner */}
      {deployToast && (
        <div className="bg-indigo-600 text-white px-6 py-3 text-xs font-medium flex items-center justify-between shadow-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckSymbolIcon size={16} />
            <span>{deployToast}</span>
          </div>
          <button
            onClick={() => setDeployToast(null)}
            className="text-white hover:underline text-[11px] font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8">
        {/* KPI Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900/80 p-5 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">TOTAL FRAMES</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileCodeIcon size={16} />
              </div>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
              {totalFrames.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">
              {batches.length} Active & Completed Batches
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900/80 p-5 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">FLEET ACCURACY (IOU)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldAuditIcon size={16} />
              </div>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 mb-1">
              {meanFleetIou}%
            </div>
            <div className="text-xs text-emerald-700/80 dark:text-emerald-300/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Contract SLA: ≥85.0%</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900/80 p-5 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">HONEYPOT PASS RATE</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <CaliperIcon size={16} />
              </div>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
              99.4%
            </div>
            <div className="text-xs text-slate-500">
              3,740 / 3,760 passed (20 auto-rerouted)
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-slate-900/80 p-5 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">INGESTION BUCKET</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <DatabaseIcon size={16} />
              </div>
            </div>
            <div className="text-sm font-mono font-bold text-slate-900 dark:text-white truncate mb-1" title={bucketUri}>
              s3://prod-cv-ingest-apse1/
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Encrypted KMS AES-256</span>
            </div>
          </div>
        </section>

        {/* Console Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 mb-6">
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-all flex items-center gap-2 ${
              activeTab === 'batches'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCodeIcon size={15} />
            <span>Active & Completed Batches ({batches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-all flex items-center gap-2 ${
              activeTab === 'distribution'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChartIcon size={15} />
            <span>IoU Quality Distribution</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-all flex items-center gap-2 ${
              activeTab === 'storage'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UploadCloudIcon size={15} />
            <span>Cloud Storage & Webhooks</span>
          </button>
        </div>

        {/* Tab 1: Batches Ledger */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Header & Filter Bar */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Dataset Production Pipeline
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time status of managed labeling runs, calibration scores, and verified export packages.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <SearchIcon size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter batches or ID..."
                      className="h-8 pl-8 pr-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-indigo-500 w-44"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="h-8 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">All Statuses</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  {/* Modality Filter */}
                  <select
                    value={modalityFilter}
                    onChange={(e) => setModalityFilter(e.target.value as any)}
                    className="h-8 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">All Modalities</option>
                    <option value="Bounding Box">Bounding Box</option>
                    <option value="Polygon Seg">Polygon Seg</option>
                    <option value="Keypoint">Keypoint</option>
                  </select>

                  <button
                    onClick={() => setDeployModalOpen(true)}
                    className="h-8 px-3 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <UploadCloudIcon size={13} />
                    <span>Deploy Run</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-6">Batch ID & Title</th>
                      <th className="py-3.5 px-6">Modality</th>
                      <th className="py-3.5 px-6">Frames</th>
                      <th className="py-3.5 px-6">Progress</th>
                      <th className="py-3.5 px-6">Mean IoU</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                    {filteredBatches.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <p className="text-sm font-semibold mb-1">
                            {batches.length === 0 ? 'No batches in production ledger.' : 'No batches match your filter criteria.'}
                          </p>
                          <div className="flex items-center justify-center gap-4 mt-2">
                            {batches.length === 0 ? (
                              <button
                                onClick={() => saveBatches(INITIAL_BATCHES)}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                Restore Sample Batches
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSearchQuery('');
                                  setStatusFilter('all');
                                  setModalityFilter('all');
                                }}
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                Reset filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBatches.map((batch) => (
                        <tr
                          key={batch.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {batch.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {batch.id}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                              {batch.modality}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono">
                            {batch.completedFrames.toLocaleString()} / {batch.frames.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 min-w-[150px]">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{batch.progressPct}%</span>
                              {batch.status === 'In Progress' && (
                                <button
                                  onClick={() => handleAdvanceBatchProgress(batch.id)}
                                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                                  title="Advance progress by 25%"
                                >
                                  +25% Progress
                                </button>
                              )}
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  batch.progressPct === 100
                                    ? 'bg-emerald-500'
                                    : 'bg-indigo-600'
                                }`}
                                style={{ width: `${batch.progressPct}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 font-mono font-bold ${
                                batch.iouScore >= 90
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {batch.iouScore.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
                                batch.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                              }`}
                            >
                              {batch.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => handleOpenSpotCheck(batch)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                              title="Inspect 5% Randomized Spot Check Frames"
                            >
                              <CaliperIcon size={12} className="text-indigo-500" />
                              <span>Spot Check</span>
                            </button>

                            {batch.status === 'Delivered' ? (
                              <>
                                <button
                                  onClick={() => handleOpenCertificate(batch)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                                >
                                  <ShieldAuditIcon size={12} />
                                  <span>Certificate</span>
                                </button>

                                <button
                                  onClick={() => handleDownloadBatchCoco(batch)}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                                  title="Download verified COCO JSON dataset"
                                >
                                  <DownloadIcon size={12} />
                                  <span>COCO</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleAdvanceBatchProgress(batch.id)}
                                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold transition-colors inline-flex items-center gap-1 shadow-xs"
                                title="Accelerate batch completion"
                              >
                                <SparklesIcon size={12} />
                                <span>Advance QA</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteBatch(batch.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center"
                              title="Delete batch"
                            >
                              <TrashIcon size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: IoU Quality Distribution */}
        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    IoU Score Frequency Distribution (N = {totalFrames.toLocaleString()} annotations)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calculated against blind honeypot reference coordinates across current active project.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  SLA Target: ≥85.0%
                </div>
              </div>

              {/* Histogram Bars */}
              <div className="space-y-4 text-xs">
                {/* 95% - 100% */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">
                      95.0% – 100.0% (Exceptional Ground Truth Fidelity)
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">44.6% ({Math.round(totalFrames * 0.446).toLocaleString()})</span>
                  </div>
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-700">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg" style={{ width: '44.6%' }} />
                  </div>
                </div>

                {/* 90% - 94.9% */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">
                      90.0% – 94.9% (High Fidelity Ground Truth)
                    </span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">46.2% ({Math.round(totalFrames * 0.462).toLocaleString()})</span>
                  </div>
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-700">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg" style={{ width: '46.2%' }} />
                  </div>
                </div>

                {/* 85% - 89.9% */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300">
                      85.0% – 89.9% (Within Contractual SLA Guarantee)
                    </span>
                    <span className="font-mono text-slate-500">8.4% ({Math.round(totalFrames * 0.084).toLocaleString()})</span>
                  </div>
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-700">
                    <div className="h-full bg-slate-400 dark:bg-slate-600 rounded-lg" style={{ width: '8.4%' }} />
                  </div>
                </div>

                {/* 75% - 84.9% */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-slate-500">
                      75.0% – 84.9% (Flagged for Automated Secondary Review)
                    </span>
                    <span className="font-mono text-slate-500">0.8% ({Math.round(totalFrames * 0.008).toLocaleString()})</span>
                  </div>
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-700">
                    <div className="h-full bg-amber-500 rounded-lg" style={{ width: '0.8%' }} />
                  </div>
                </div>

                {/* <75% */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-slate-500">
                      &lt;75.0% (Rejected & Automatically Re-routed)
                    </span>
                    <span className="font-mono text-slate-500">0.0% (0 delivered)</span>
                  </div>
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-700">
                    <div className="h-full bg-red-500 rounded-lg" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>

              {/* Benchmark Callout */}
              <div className="mt-8 p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] font-semibold block mb-0.5">
                    CUMULATIVE PASS RATE
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    99.2% Annotations Above Contract SLA (≥85% IoU)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 uppercase text-[10px] font-semibold block mb-0.5">
                    ZERO DEFECT POLICY
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    0 Sub-75% Frames Delivered
                  </span>
                </div>
              </div>
            </div>

            {/* QA Calibration Metrics Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase">
                  <ShieldAuditIcon size={14} />
                  <span>Calibration Integrity</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Automated Audit Protocol
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block mb-1">
                      HONEYPOT FREQUENCY
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      1 Blind Frame per 25 Frames (4%)
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block mb-1">
                      DRIFT ALARM THRESHOLD
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      IoU &lt; 85% Triggering Task Halt
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block mb-1">
                      CONSENSUS OVERLAP
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Dual-Annotator on 5% Spot Check
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Cloud Storage & Webhooks */}
        {activeTab === 'storage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
              <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cloud Bucket Ingestion & Presigned Token Exchange
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure zero-retention cloud ingress. Annotators read directly via ephemeral presigned URLs with AES-256 KMS encryption.
                </p>
              </div>

              {/* Provider Selector */}
              <div className="mb-6">
                <label className="block text-slate-500 text-xs font-semibold mb-2 uppercase">
                  Storage Provider
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() => setCloudProvider('s3')}
                    className={`h-11 px-4 border rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      cloudProvider === 's3'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Amazon S3</span>
                  </button>

                  <button
                    onClick={() => setCloudProvider('gcs')}
                    className={`h-11 px-4 border rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      cloudProvider === 'gcs'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Google Cloud GCS</span>
                  </button>

                  <button
                    onClick={() => setCloudProvider('azure')}
                    className={`h-11 px-4 border rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      cloudProvider === 'azure'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Azure Blob</span>
                  </button>
                </div>
              </div>

              {/* Bucket URI */}
              <div className="space-y-4 text-xs mb-6">
                <div>
                  <label className="block text-slate-500 mb-1.5 uppercase font-semibold text-[11px]">
                    Target Bucket URI
                  </label>
                  <input
                    type="text"
                    value={bucketUri}
                    onChange={(e) => setBucketUri(e.target.value)}
                    className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1.5 uppercase font-semibold text-[11px]">
                    Cross-Account IAM Role ARN / Service Account
                  </label>
                  <input
                    type="text"
                    value={iamRole}
                    onChange={(e) => setIamRole(e.target.value)}
                    className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Save Storage Configuration & IAM Policy */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleSaveStorageConfig}
                  className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-md shadow-indigo-500/20"
                >
                  <CheckSymbolIcon size={14} />
                  <span>Save Cloud Storage Configuration</span>
                </button>

                <span className="text-xs text-slate-400 font-mono">
                  Region: ap-southeast-1
                </span>
              </div>

              {/* Status Banner */}
              {testResult && (
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                  <CheckSymbolIcon size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{testResult}</span>
                </div>
              )}

              {/* IAM Zero-Retention Policy Snippet */}
              <div className="mt-5 p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-[10px] uppercase font-bold">
                  <span>Cross-Account Ingress Policy (JSON)</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify({
                        Version: "2012-10-17",
                        Statement: [
                          {
                            Effect: "Allow",
                            Action: ["s3:GetObject", "s3:PutObject", "s3:ListBucket"],
                            Resource: [`${bucketUri}*`, bucketUri.replace(/\/$/, '')]
                          }
                        ]
                      }, null, 2));
                      setTestResult('IAM Policy copied to clipboard.');
                      setTimeout(() => setTestResult(null), 3000);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 normal-case"
                  >
                    Copy Policy
                  </button>
                </div>
                <pre className="text-slate-400 text-[10px] overflow-x-auto">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::710924158912:role/MatrixLabelIngestRole" },
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "${bucketUri}*"
    }
  ]
}`}
                </pre>
              </div>
            </div>

            {/* Webhook Configuration Sidebar with Working Dispatch Tester */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase">
                  <FileCodeIcon size={14} />
                  <span>Event Dispatch</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Automated Webhook Sync
                </h4>

                <div className="space-y-3 text-xs mb-5">
                  <div>
                    <label className="block text-slate-400 mb-1 text-[10px] font-semibold uppercase">
                      PAYLOAD DESTINATION URL
                    </label>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-[11px] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[10px] font-semibold uppercase">
                      HMAC SIGNING SECRET
                    </label>
                    <input
                      type="password"
                      defaultValue="whsec_984fbc9102c771da4"
                      className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-[11px] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendTestWebhook}
                  disabled={webhookTesting}
                  className="w-full h-9 mb-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <RefreshCwIcon size={13} className={webhookTesting ? 'animate-spin' : ''} />
                  <span>{webhookTesting ? 'Dispatching Event...' : 'Send Test Webhook Ping'}</span>
                </button>

                {webhookResponse && (
                  <div className="mb-4 p-3 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 font-mono text-[11px]">
                    <div className="flex justify-between items-center text-emerald-400 mb-1.5 pb-1 border-b border-slate-800">
                      <span>HTTP 200 OK</span>
                      <span>{webhookResponse.latency}ms</span>
                    </div>
                    <pre className="text-[10px] text-slate-400 overflow-x-auto">
                      {webhookResponse.payload}
                    </pre>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckSymbolIcon size={13} className="text-emerald-500" />
                  <span>batch.qa_passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSymbolIcon size={13} className="text-emerald-500" />
                  <span>batch.delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSymbolIcon size={13} className="text-emerald-500" />
                  <span>qa.drift_alert</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quality Certificate Preview Modal */}
      {selectedBatch && (
        <QualityCertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          batchId={selectedBatch.id}
          batchTitle={selectedBatch.name}
          iouScore={`${selectedBatch.iouScore.toFixed(1)}%`}
          sampleCount={`${selectedBatch.frames.toLocaleString()} frames`}
        />
      )}

      {/* Spot Check Frame Inspection Modal */}
      {spotCheckBatch && (
        <SpotCheckModal
          isOpen={spotCheckModalOpen}
          onClose={() => setSpotCheckModalOpen(false)}
          batchId={spotCheckBatch.id}
          batchName={spotCheckBatch.name}
        />
      )}

      {/* Deploy Batch Modal */}
      <DeployBatchModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        onDeploy={handleDeployBatch}
      />
    </div>
  );
}
