/**
 * DemoClient V3 - Linear/Vercel 风格重构版
 *
 * 特性:
 * 1. 左右分栏工作台布局
 * 2. Framer Motion 动画
 * 3. 深色主题 (slate-950)
 * 4. 实时可视化图表
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StreamBoard, type UIGranularity } from '../ui-streaming-demo/StreamBlocks';
import {
  initStream,
  applyEvent,
  stopStream,
  getAbortController,
  markStreamActive,
  type StreamEvent,
} from '@/lib/global-stream-manager';
import { useStreamSnapshot } from '@/hooks/useStreamSnapshot';

type StopReason = 'user' | 'restart';
type VizPoint = { id: number; label: string; chars: number; deltaChars: number; cps: number };
type DemoTone = 'primary' | 'neutral' | 'danger' | 'info';

const GRANULARITY_OPTIONS: UIGranularity[] = ['brief', 'balanced', 'detailed'];
const GRANULARITY_SET: ReadonlySet<UIGranularity> = new Set(GRANULARITY_OPTIONS);
const API_STREAM_PATH = '/api/ui-stream/';
const RAW_LOG_LIMIT = 180;
const VIZ_WINDOW_SIZE = 28;
const VIZ_TARGET_CHARS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'ssr-session';

  const stored = localStorage.getItem('ui-stream-session-id');
  if (stored) return stored;

  const newId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem('ui-stream-session-id', newId);
  return newId;
}

function parseSSEFrame(frame: string): StreamEvent | null {
  const lines = frame.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        return JSON.parse(line.slice(6)) as StreamEvent;
      } catch {
        return null;
      }
    }
  }
  return null;
}

function buildWavePath(points: VizPoint[]): string {
  if (points.length === 0) {
    return 'M0,90 L100,90';
  }

  const maxSpeed = Math.max(...points.map((point) => point.cps), 1);
  return points
    .map((point, idx) => {
      const x = points.length === 1 ? 100 : (idx / Math.max(points.length - 1, 1)) * 100;
      const y = 92 - (point.cps / maxSpeed) * 74;
      return `${idx === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

function toneClasses(tone: DemoTone): string {
  if (tone === 'primary') {
    return 'border-cyan-400/45 bg-cyan-400/12 text-cyan-200 hover:border-cyan-300/65';
  }
  if (tone === 'danger') {
    return 'border-rose-400/35 bg-rose-400/10 text-rose-200 hover:border-rose-300/55';
  }
  if (tone === 'info') {
    return 'border-indigo-400/35 bg-indigo-400/10 text-indigo-200 hover:border-indigo-300/55';
  }
  return 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500';
}

function createDemoSampleEvents(prompt: string, granularity: UIGranularity): StreamEvent[] {
  const contentA = 'Streaming visualization online. Receiving structured patches...';
  const contentB = `${contentA}\nNow rendering metrics, chart blocks, and timeline data.`;
  const contentC = `${contentB}\nGranularity: ${granularity}. Prompt: ${prompt.slice(0, 40)}${prompt.length > 40 ? '...' : ''}`;

  return [
    { type: 'ui.init', title: 'UI Streaming Visual Demo', layout: 'dashboard-2col' },
    { type: 'ui.block', id: 'prompt', blockType: 'text', title: 'Prompt', column: 'full', content: prompt },
    {
      type: 'ui.block',
      id: 'granularity',
      blockType: 'control',
      title: 'Granularity',
      column: 'full',
      options: GRANULARITY_OPTIONS,
      value: granularity,
    },
    { type: 'ui.block', id: 'answer', blockType: 'text', title: 'Assistant', column: 'left', content: '' },
    { type: 'ui.block', id: 'chars', blockType: 'kpi', label: 'Generated Chars', column: 'right', value: 0 },
    {
      type: 'ui.block',
      id: 'draft_line_chart',
      blockType: 'chart',
      title: 'Draft Growth',
      column: 'left',
      chart: { type: 'line', labels: ['T0'], series: [{ name: 'Chars', data: [0] }] },
    },
    {
      type: 'ui.block',
      id: 'term_bar_chart',
      blockType: 'chart',
      title: 'Top Terms',
      column: 'right',
      chart: {
        type: 'bar',
        labels: ['stream', 'patch', 'visual'],
        series: [{ name: 'Mentions', data: [0, 0, 0] }],
      },
    },
    {
      type: 'ui.patch',
      id: 'answer',
      patch: { content: contentA },
    },
    { type: 'ui.patch', id: 'chars', patch: { value: contentA.length } },
    {
      type: 'ui.patch',
      id: 'draft_line_chart',
      patch: {
        chart: {
          type: 'line',
          labels: ['T1', 'T2', 'T3'],
          series: [{ name: 'Chars', data: [14, 31, contentA.length] }],
        },
      },
    },
    {
      type: 'ui.patch',
      id: 'term_bar_chart',
      patch: {
        chart: {
          type: 'bar',
          labels: ['stream', 'patch', 'visual'],
          series: [{ name: 'Mentions', data: [2, 1, 1] }],
        },
      },
    },
    { type: 'ui.patch', id: 'answer', patch: { content: contentB } },
    { type: 'ui.patch', id: 'chars', patch: { value: contentB.length } },
    {
      type: 'ui.patch',
      id: 'draft_line_chart',
      patch: {
        chart: {
          type: 'line',
          labels: ['T1', 'T2', 'T3', 'T4', 'T5'],
          series: [{ name: 'Chars', data: [14, 31, 63, 88, contentB.length] }],
        },
      },
    },
    { type: 'ui.patch', id: 'answer', patch: { content: contentC } },
    { type: 'ui.patch', id: 'chars', patch: { value: contentC.length } },
    {
      type: 'ui.patch',
      id: 'term_bar_chart',
      patch: {
        chart: {
          type: 'bar',
          labels: ['stream', 'patch', 'visual'],
          series: [{ name: 'Mentions', data: [4, 3, 2] }],
        },
      },
    },
    { type: 'ui.done', source: 'fallback', provider: 'fallback' },
  ];
}

export default function DemoClientV3() {
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [prompt, setPrompt] = useState('地球自转的轨迹');
  const [granularity, setGranularity] = useState<UIGranularity>('balanced');
  const [status, setStatus] = useState('Idle');
  const [running, setRunning] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState(API_STREAM_PATH);
  const [rawLog, setRawLog] = useState<string[]>([]);
  const [vizPoints, setVizPoints] = useState<VizPoint[]>([]);

  const snapshot = useStreamSnapshot(sessionId);

  const runningRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const stopReasonRef = useRef<StopReason | null>(null);
  const restartGranularityRef = useRef<UIGranularity | null>(null);
  const vizRef = useRef<{ chars: number; at: number }>({ chars: -1, at: Date.now() });

  useEffect(() => {
    initStream(sessionId);
  }, [sessionId]);

  useEffect(() => {
    const isActive = snapshot?.phase === 'active';
    setRunning(isActive);
    runningRef.current = isActive;

    if (snapshot?.error) {
      setStatus(`Error: ${snapshot.error}`);
    } else if (snapshot?.doneInfo) {
      const source = snapshot.doneInfo.source || 'unknown';
      const provider = snapshot.doneInfo.provider || 'unknown';
      setStatus(`Completed (${source}/${provider})`);
    } else if (isActive) {
      setStatus('Streaming...');
    } else if (snapshot?.phase === 'stopped') {
      setStatus('Stopped');
    } else if (snapshot?.phase === 'idle') {
      setStatus('Idle');
    }
  }, [snapshot?.phase, snapshot?.error, snapshot?.doneInfo]);

  function appendRawLog(entry: string): void {
    const line = `${new Date().toISOString()} ${entry}`;
    setRawLog((previous) => [...previous.slice(-(RAW_LOG_LIMIT - 1)), line]);
  }

  function dispatchStreamEvent(event: StreamEvent, source: 'api' | 'local' = 'api'): void {
    appendRawLog(`${source} data: ${JSON.stringify(event)}`);
    applyEvent(sessionId, event);
  }

  function resetStreamState(options?: { keepLog?: boolean }): void {
    initStream(sessionId);
    setStatus('Idle');
    setVizPoints([]);
    vizRef.current = { chars: -1, at: Date.now() };
    if (!options?.keepLog) {
      setRawLog([]);
    }
  }

  function requestStop(reason: StopReason) {
    if (!runningRef.current) return;
    stopRequestedRef.current = true;
    stopReasonRef.current = reason;
    setStatus(reason === 'restart' ? 'Restarting...' : 'Stopping...');
    appendRawLog(`client stop reason=${reason}`);
    stopStream(sessionId);
  }

  async function streamFromApi(requestGranularity: UIGranularity = granularity) {
    if (runningRef.current) return;

    resetStreamState();
    setGranularity(requestGranularity);
    stopRequestedRef.current = false;
    stopReasonRef.current = null;
    restartGranularityRef.current = null;

    markStreamActive(sessionId);
    setStatus('Connecting...');

    const controller = getAbortController(sessionId);
    if (!controller) return;

    try {
      const requestUrl = new URL(API_STREAM_PATH, window.location.origin);
      requestUrl.searchParams.set('_ts', String(Date.now()));
      setApiEndpoint(requestUrl.toString());
      appendRawLog(`request POST ${requestUrl.toString()} granularity=${requestGranularity}`);

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'x-ui-session-id': sessionId,
        },
        body: JSON.stringify({ prompt, granularity: requestGranularity }),
        signal: controller.signal,
      });
      appendRawLog(`response status=${response.status}`);

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      setStatus('Streaming...');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let sawDone = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split('\n\n');
        buffer = frames.pop() || '';

        for (const frame of frames) {
          if (!frame.trim() || frame.startsWith(':')) continue;

          const evt = parseSSEFrame(frame);
          if (evt) {
            dispatchStreamEvent(evt, 'api');
            if (evt.type === 'ui.done') {
              sawDone = true;
            }
          }
        }
      }

      buffer += decoder.decode();
      if (buffer.trim() && !buffer.startsWith(':')) {
        const evt = parseSSEFrame(buffer);
        if (evt) {
          dispatchStreamEvent(evt, 'api');
          if (evt.type === 'ui.done') {
            sawDone = true;
          }
        }
      }

      if (!sawDone) {
        dispatchStreamEvent({ type: 'ui.done', source: 'api', provider: 'unknown' }, 'local');
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        const shouldRestart = stopReasonRef.current === 'restart';
        const nextGranularity = restartGranularityRef.current;
        appendRawLog(`aborted restart=${shouldRestart ? 'yes' : 'no'}`);

        if (shouldRestart && nextGranularity) {
          await sleep(100);
          void streamFromApi(nextGranularity);
        } else if (stopRequestedRef.current) {
          dispatchStreamEvent({ type: 'ui.done', source: 'cancelled', provider: 'client' }, 'local');
        }
      } else {
        console.error('Stream error:', error);
        const message = error instanceof Error ? error.message : 'Unknown stream error';
        dispatchStreamEvent({ type: 'ui.error', message, code: 'internal_error' }, 'local');
        dispatchStreamEvent({ type: 'ui.done', source: 'error', provider: 'fallback' }, 'local');
      }
    }
  }

  function isGranularity(value: unknown): value is UIGranularity {
    return GRANULARITY_SET.has(value as UIGranularity);
  }

  async function switchGranularity(next: UIGranularity) {
    if (next === granularity) return;
    setGranularity(next);
    appendRawLog(`client granularity=${next}`);

    if (runningRef.current) {
      restartGranularityRef.current = next;
      requestStop('restart');
      return;
    }

    await streamFromApi(next);
  }

  async function replayVisualizationSample(): Promise<void> {
    if (runningRef.current) return;

    resetStreamState();
    markStreamActive(sessionId);
    setStatus('Playing local visualization sample...');
    appendRawLog('local sample replay start');

    const sampleEvents = createDemoSampleEvents(prompt, granularity);
    for (const event of sampleEvents) {
      dispatchStreamEvent(event, 'local');
      await sleep(220);
    }
  }

  const blockList = useMemo(() => {
    return Object.values(snapshot?.blocks || {});
  }, [snapshot?.blocks]);
  const generatedChars = useMemo(() => {
    const blocks = snapshot?.blocks || {};
    const charsBlock = blocks.chars as { value?: unknown } | undefined;
    const answerBlock = blocks.answer as { content?: unknown } | undefined;
    const fromKpi = typeof charsBlock?.value === 'number' ? charsBlock.value : 0;
    const fromAnswer = typeof answerBlock?.content === 'string' ? answerBlock.content.length : 0;
    return Math.max(fromKpi, fromAnswer);
  }, [snapshot?.blocks]);
  const visualBars = useMemo(() => vizPoints.slice(-16), [vizPoints]);
  const avgSpeed = useMemo(() => {
    if (visualBars.length === 0) return 0;
    return visualBars.reduce((total, point) => total + point.cps, 0) / visualBars.length;
  }, [visualBars]);
  const completion = useMemo(() => {
    return Math.min((generatedChars / VIZ_TARGET_CHARS) * 100, 100);
  }, [generatedChars]);

  useEffect(() => {
    const now = Date.now();
    const previous = vizRef.current;
    const nextChars = Math.max(generatedChars, 0);
    if (nextChars === previous.chars) {
      return;
    }

    const deltaChars = Math.max(nextChars - previous.chars, 0);
    const deltaMs = Math.max(now - previous.at, 1);
    const cps = deltaChars / (deltaMs / 1000);
    const label = new Date(now).toISOString().slice(14, 19);

    vizRef.current = { chars: nextChars, at: now };
    setVizPoints((existing) => [
      ...existing.slice(-(VIZ_WINDOW_SIZE - 1)),
      { id: now, label, chars: nextChars, deltaChars, cps },
    ]);
  }, [generatedChars]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* 顶部标题栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">UI Streaming Demo V3</h1>
          <p className="text-sm text-slate-400 mt-1">Linear/Vercel 风格 · 全局流管理器</p>
        </div>
      </motion.div>

      {/* 主工作区 - 左右分栏 */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧控制面板 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-4 space-y-4"
          >
            {/* Prompt 输入 */}
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm">
              <label className="block text-sm font-medium text-slate-200 mb-3">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="输入你的问题..."
              />
            </div>

            {/* Granularity 选择 */}
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm">
              <label className="block text-sm font-medium text-slate-200 mb-3">
                Granularity
              </label>
              <div className="flex gap-2">
                {GRANULARITY_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => void switchGranularity(opt)}
                    className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      opt === granularity
                        ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm">
              <div className="mb-3 text-xs uppercase tracking-[0.16em] text-slate-400">Controls</div>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => void streamFromApi()}
                  disabled={running}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-45 ${toneClasses('primary')}`}
                >
                  {running ? 'Streaming...' : 'Start'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => requestStop('user')}
                  disabled={!running}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-45 ${toneClasses('danger')}`}
                >
                  Stop
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    void replayVisualizationSample();
                  }}
                  disabled={running}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-45 ${toneClasses('info')}`}
                >
                  Replay
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => resetStreamState({ keepLog: true })}
                  disabled={running}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-45 ${toneClasses('neutral')}`}
                >
                  Reset
                </motion.button>
              </div>
            </div>

            {/* 状态指示器 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-sm text-slate-300">{status}</span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-400">
                <div>Phase: {snapshot?.phase || 'idle'}</div>
                <div>Endpoint: {apiEndpoint}</div>
                {snapshot?.doneInfo ? (
                  <div>
                    Done: {snapshot.doneInfo.source}/{snapshot.doneInfo.provider}
                  </div>
                ) : null}
              </div>
            </motion.div>

            {/* 实时可视化面板 */}
            <AnimatePresence>
              {vizPoints.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm space-y-4"
                >
                  <h3 className="text-sm font-medium text-slate-200">实时可视化总览</h3>

                  <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
                    {/* 波形图 */}
                    <div className="relative h-24 rounded-xl bg-slate-950/50 border border-slate-800/30 overflow-hidden">
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="absolute inset-0 w-full h-full"
                      >
                        <defs>
                          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgb(56, 189, 248)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="rgb(129, 140, 248)" stopOpacity="0.9" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="90" x2="100" y2="90" stroke="#334155" strokeWidth="0.7" />
                        <path
                          d={buildWavePath(vizPoints)}
                          fill="none"
                          stroke="url(#waveGradient)"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                          className="drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                        />
                      </svg>
                    </div>

                    {/* 柱状图 */}
                    <div className="flex h-24 items-end gap-1 rounded-xl border border-slate-800/30 bg-slate-950/50 p-2">
                      {visualBars.length === 0 ? (
                        <div className="w-full text-center text-[11px] text-slate-500">Waiting events...</div>
                      ) : (
                        visualBars.map((point) => {
                          const maxDelta = Math.max(...visualBars.map((entry) => entry.deltaChars), 1);
                          const height = Math.max((point.deltaChars / maxDelta) * 100, point.deltaChars > 0 ? 8 : 2);
                          return (
                            <motion.div
                              key={point.id}
                              initial={{ height: 0, opacity: 0.5 }}
                              animate={{ height: `${height}%`, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-500/80 to-indigo-400/85"
                              title={`${point.deltaChars} chars @ ${point.label}`}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* 指标卡片 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-slate-950/50 border border-slate-800/30 p-3">
                      <div className="text-xs text-slate-400 mb-1">总字符</div>
                      <div className="text-lg font-semibold text-emerald-400">{generatedChars}</div>
                    </div>
                    <div className="rounded-lg bg-slate-950/50 border border-slate-800/30 p-3">
                      <div className="text-xs text-slate-400 mb-1">平均速度</div>
                      <div className="text-lg font-semibold text-cyan-400">{avgSpeed.toFixed(1)}<span className="text-xs text-slate-500 ml-1">c/s</span></div>
                    </div>
                    <div className="rounded-lg bg-slate-950/50 border border-slate-800/30 p-3">
                      <div className="text-xs text-slate-400 mb-1">进度</div>
                      <div className="text-lg font-semibold text-indigo-400">{completion.toFixed(0)}<span className="text-xs text-slate-500 ml-1">%</span></div>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="relative h-1.5 rounded-full bg-slate-950/50 border border-slate-800/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 右侧输出区域 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="col-span-12 lg:col-span-8"
          >
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
              <div className="border-b border-slate-800/50 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-100">
                  {snapshot?.title || 'Waiting for stream...'}
                </h2>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {blockList.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-96 text-slate-500"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-4">📊</div>
                        <p>
                          点击 <code>Start Stream</code> 开始生成可视化内容
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <StreamBoard
                        blocks={blockList}
                        layout={snapshot?.layout || 'stack'}
                        granularity={granularity}
                        isGranularityOption={isGranularity}
                        onGranularityChange={(next) => {
                          void switchGranularity(next);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 rounded-2xl border border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Raw Event Log</div>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setRawLog([])}
                      className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition ${toneClasses('neutral')}`}
                    >
                      Clear
                    </motion.button>
                  </div>
                  <pre className="max-h-52 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] leading-relaxed text-slate-300">
                    {rawLog.length > 0 ? rawLog.join('\n\n') : '(empty)'}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
