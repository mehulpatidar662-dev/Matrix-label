'use client';

import React, { useState } from 'react';
import { FileCodeIcon, CheckSymbolIcon, ShieldAuditIcon, ChevronRightIcon, SparklesIcon, RefreshCwIcon } from './ui/Icons';

export default function DeveloperApiConsole() {
  const [activeMode, setActiveMode] = useState<'sdk' | 'runner'>('sdk');
  const [lang, setLang] = useState<'python' | 'curl' | 'node'>('python');
  const [copied, setCopied] = useState<boolean>(false);
  const [webhookFired, setWebhookFired] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Live Runner State
  const [runnerEndpoint, setRunnerEndpoint] = useState<'create_batch' | 'get_status' | 'get_export' | 'audit_gate'>('create_batch');
  const [apiKey, setApiKey] = useState('ml_live_9f81a4b92c');
  const [selectedModality, setSelectedModality] = useState<'bbox' | 'polygon' | 'keypoint'>('bbox');
  const [targetIou, setTargetIou] = useState<number>(0.90);
  const [runnerExecuting, setRunnerExecuting] = useState(false);
  const [runnerResponse, setRunnerResponse] = useState<{
    status: number;
    latency: number;
    timestamp: string;
    body: any;
  }>({
    status: 200,
    latency: 34,
    timestamp: new Date().toISOString(),
    body: {
      id: 'BATCH-48102',
      name: 'Autonomous-Highway-Night-4K',
      modality: 'bbox',
      status: 'queued',
      target_iou: 0.90,
      frames_registered: 20000,
      honeypot_ratio: 0.04,
      webhook_registered: true,
      created_at: new Date().toISOString(),
    },
  });

  const snippets = {
    python: `# 1. Install official SDK: pip install matrixlabel
import matrixlabel

# Initialize authenticated client
client = matrixlabel.Client(api_key="${apiKey}")

# Programmatically dispatch an image batch
batch = client.batches.create(
    name="Autonomous-Highway-Night-4K",
    modality="${selectedModality}",
    s3_bucket="s3://vision-raw-datasets/batch-049/",
    target_iou=${targetIou.toFixed(2)},
    turnaround="standard",
    webhook_url="https://api.yourcorp.ai/webhooks/matrixlabel"
)

print(f"✓ Batch dispatched: {batch.id} | Status: {batch.status}")`,
    curl: `# Direct REST Ingestion Endpoint
curl -X POST https://api.matrixlabel.ai/v1/batches \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Autonomous-Highway-Night-4K",
    "modality": "${selectedModality}",
    "s3_bucket": "s3://vision-raw-datasets/batch-049/",
    "target_iou": ${targetIou.toFixed(2)},
    "turnaround": "standard",
    "webhook_url": "https://api.yourcorp.ai/webhooks/matrixlabel"
  }'`,
    node: `// 1. Install SDK: npm install @matrixlabel/sdk
import { MatrixLabel } from '@matrixlabel/sdk';

const client = new MatrixLabel({
  apiKey: process.env.MATRIXLABEL_API_KEY || '${apiKey}'
});

const batch = await client.batches.create({
  name: 'Autonomous-Highway-Night-4K',
  modality: '${selectedModality}',
  s3Bucket: 's3://vision-raw-datasets/batch-049/',
  targetIou: ${targetIou.toFixed(2)},
  turnaround: 'standard',
  webhookUrl: 'https://api.yourcorp.ai/webhooks/matrixlabel',
});

console.log(\`✓ Batch active: \${batch.id}\`);`,
  };

  const webhookPayload = `{
  "event": "batch.qa_passed",
  "batch_id": "BATCH-48102",
  "status": "delivery_ready",
  "created_at": "2026-09-25T14:30:00Z",
  "qa_audit": {
    "total_frames": 20000,
    "measured_mean_iou": 0.946,
    "honeypot_ratio": 0.05,
    "spot_check_passed": true,
    "manifest_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  "exports": {
    "coco_json_url": "https://storage.matrixlabel.ai/exports/48102/coco_annotations.json?token=exp_...",
    "yolo_zip_url": "https://storage.matrixlabel.ai/exports/48102/yolo_labels.zip?token=exp_...",
    "pascal_voc_url": "https://storage.matrixlabel.ai/exports/48102/voc_xml.tar.gz?token=exp_..."
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateWebhook = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setWebhookFired(true);
      setTimeout(() => setWebhookFired(false), 4000);
    }, 450);
  };

  const handleExecuteLiveRunner = () => {
    setRunnerExecuting(true);
    setTimeout(() => {
      setRunnerExecuting(false);
      const latency = Math.floor(25 + Math.random() * 20);
      let resBody: any = {};

      if (runnerEndpoint === 'create_batch') {
        resBody = {
          id: `BATCH-${Math.floor(10000 + Math.random() * 89999)}`,
          status: 'queued',
          name: 'Autonomous-Highway-Night-4K',
          modality: selectedModality,
          target_iou: targetIou,
          frames_registered: 20000,
          honeypot_frequency: '1:25 frames (4%)',
          webhook_url: 'https://api.yourcorp.ai/webhooks/matrixlabel',
          created_at: new Date().toISOString(),
        };
      } else if (runnerEndpoint === 'get_status') {
        resBody = {
          batch_id: 'BATCH-48102',
          status: 'Delivered',
          completed_frames: 20000,
          total_frames: 20000,
          mean_iou: 0.946,
          honeypots_verified: 800,
          honeypots_passed: 798,
          qa_certificate_signed: true,
          sla_compliance: 'PASSED',
        };
      } else if (runnerEndpoint === 'get_export') {
        resBody = {
          batch_id: 'BATCH-48102',
          schema: 'COCO_JSON_v1.0',
          presigned_download_url: 'https://storage.matrixlabel.ai/exports/48102/verified_coco.json?X-Amz-Signature=891...',
          expires_in_seconds: 3600,
          sha256_checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        };
      } else {
        resBody = {
          audit_run_id: 'AUDIT-89102',
          batch_id: 'BATCH-48102',
          algorithm: 'Blind Dual-Annotator Consensus + Honeypot Check',
          samples_tested: 1000,
          gate_threshold: targetIou,
          measured_mean_iou: 0.946,
          verdict: 'APPROVED_FOR_DEPLOYMENT',
        };
      }

      setRunnerResponse({
        status: 200,
        latency,
        timestamp: new Date().toISOString(),
        body: resBody,
      });
    }, 450);
  };

  return (
    <section id="api" className="relative w-full bg-slate-50 dark:bg-[#0E131F] py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800">
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-3">
              <FileCodeIcon size={14} />
              <span>Programmatic Pipeline Integration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Developer REST API & Interactive Playground
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              Integrate dataset labeling directly into your CI/CD and training workflows. Dispatch batches, execute simulated live calls, and stream signed annotations via webhooks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs text-xs font-semibold">
              <button
                onClick={() => setActiveMode('sdk')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMode === 'sdk'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                SDK & Code
              </button>
              <button
                onClick={() => setActiveMode('runner')}
                className={`px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1.5 ${
                  activeMode === 'runner'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <SparklesIcon size={13} />
                <span>Live Request Runner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code Console & Webhook Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: API Code Snippet or Live Request Runner (7 cols) */}
          <div className="lg:col-span-7 bg-[#0B0F17] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
            {activeMode === 'sdk' ? (
              <div>
                {/* macOS Style Window Header Bar */}
                <div className="h-12 px-4 bg-[#111722] border-b border-slate-800/90 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* macOS dots */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                      <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                    </div>

                    {/* Language switch tabs */}
                    <div className="flex items-center gap-1 bg-[#0A0D14] p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setLang('python')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                          lang === 'python'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Python
                      </button>
                      <button
                        onClick={() => setLang('curl')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                          lang === 'curl'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        cURL
                      </button>
                      <button
                        onClick={() => setLang('node')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                          lang === 'node'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Node.js
                      </button>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all inline-flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <CheckSymbolIcon size={12} className="text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <span>Copy Snippet</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Pre Block */}
                <div className="p-5 overflow-x-auto text-xs font-mono leading-relaxed text-slate-300">
                  <pre>{snippets[lang]}</pre>
                </div>
              </div>
            ) : (
              /* Interactive Live Request Runner UI */
              <div>
                <div className="h-12 px-4 bg-[#111722] border-b border-slate-800/90 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-xs text-white uppercase tracking-wider">
                      Interactive Endpoint Tester
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">
                    HTTPS / TLS 1.3
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Endpoint Select */}
                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] mb-1.5 uppercase font-semibold">
                      Endpoint Action
                    </label>
                    <select
                      value={runnerEndpoint}
                      onChange={(e) => setRunnerEndpoint(e.target.value as any)}
                      className="w-full h-10 px-3 bg-[#0E1420] border border-slate-800 rounded-xl text-xs font-mono text-white outline-none focus:border-indigo-500"
                    >
                      <option value="create_batch">POST /v1/batches (Queue & Ingest Run)</option>
                      <option value="get_status">GET /v1/batches/BATCH-48102 (Telemetry & Status)</option>
                      <option value="get_export">GET /v1/batches/BATCH-48102/export (Signed COCO Manifest)</option>
                      <option value="audit_gate">POST /v1/qa/honeypot/verify (Calibrate Overlap Gate)</option>
                    </select>
                  </div>

                  {/* API Key */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-mono text-[11px] mb-1.5 uppercase font-semibold">
                        API Bearer Key
                      </label>
                      <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full h-10 px-3 bg-[#0E1420] border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-mono text-[11px] mb-1.5 uppercase font-semibold">
                        Target Modality
                      </label>
                      <select
                        value={selectedModality}
                        onChange={(e) => setSelectedModality(e.target.value as any)}
                        className="w-full h-10 px-3 bg-[#0E1420] border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
                      >
                        <option value="bbox">Bounding Box (2D)</option>
                        <option value="polygon">Polygon Segmentation</option>
                        <option value="keypoint">Sub-pixel Keypoints</option>
                      </select>
                    </div>
                  </div>

                  {/* Target SLA Overlap */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-slate-400 font-mono text-[11px]">
                      <span>TARGET CALIBRATION SLA (IOU)</span>
                      <span className="text-emerald-400 font-bold">{(targetIou * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.85"
                      max="0.98"
                      step="0.01"
                      value={targetIou}
                      onChange={(e) => setTargetIou(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  {/* Execute Button */}
                  <button
                    type="button"
                    onClick={handleExecuteLiveRunner}
                    disabled={runnerExecuting}
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25"
                  >
                    <RefreshCwIcon size={13} className={runnerExecuting ? 'animate-spin' : ''} />
                    <span>{runnerExecuting ? 'Executing Request...' : 'Send Live API Request'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="px-5 py-3.5 bg-[#0D121B] border-t border-slate-800/90 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-indigo-400">BASE URL: https://api.matrixlabel.ai/v1</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                API v1.5 Stable
              </span>
            </div>
          </div>

          {/* Right Column: Webhook Simulator or Live Response Output (5 cols) */}
          <div className="lg:col-span-5 bg-[#0B0F17] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
            {activeMode === 'sdk' ? (
              <div>
                {/* Header Bar */}
                <div className="h-12 px-4 bg-[#111722] border-b border-slate-800/90 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="font-semibold text-xs text-white uppercase tracking-wider">
                      Webhook Event Dispatch
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono">
                    batch.qa_passed
                  </span>
                </div>

                {/* Explanation & Action */}
                <div className="p-5 border-b border-slate-800/90 bg-[#0E1420]">
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    When a batch completes and passes the 85%+ IoU threshold, MatrixLabel immediately fires a signed HMAC webhook with pre-authenticated download tokens.
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSimulateWebhook}
                      disabled={isSimulating}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-2"
                    >
                      <span>{isSimulating ? 'Sending Webhook...' : 'Test Webhook Dispatch'}</span>
                      <ChevronRightIcon size={13} />
                    </button>

                    {webhookFired && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono animate-fade-in">
                        <CheckSymbolIcon size={12} />
                        <span>HTTP 200 OK • 38ms</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Webhook JSON Payload */}
                <div className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300 max-h-[240px]">
                  <pre>{webhookPayload}</pre>
                </div>
              </div>
            ) : (
              /* Live Runner Response Output */
              <div>
                <div className="h-12 px-4 bg-[#111722] border-b border-slate-800/90 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px]">
                      {runnerResponse.status} OK
                    </span>
                    <span className="text-slate-400">
                      {runnerResponse.latency}ms
                    </span>
                  </div>
                  <span className="text-slate-400 text-[10px]">
                    {runnerResponse.timestamp.split('T')[1].slice(0, 8)} UTC
                  </span>
                </div>

                <div className="p-4 bg-[#0E1420] border-b border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                  <div>Content-Type: application/json</div>
                  <div>X-MatrixLabel-Signature: HMAC-SHA256</div>
                </div>

                <div className="p-4 overflow-x-auto text-[11.5px] font-mono leading-relaxed text-slate-200 max-h-[290px]">
                  <pre>{JSON.stringify(runnerResponse.body, null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="px-4 py-3 bg-[#0D121B] border-t border-slate-800/90 text-[11px] font-mono text-slate-400 flex justify-between">
              <span>Header: X-MatrixLabel-Signature</span>
              <span className="text-emerald-400">HMAC-SHA256</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
