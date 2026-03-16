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

const GRANULARITY_OPTIONS: UIGranularity[] = ['brief', 'balanced', 'detailed'];
const GRANULARITY_SET: ReadonlySet<UIGranularity> = new Set(GRANULARITY_OPTIONS);
const API_STREAM_PATH = '/api/ui-stream/';

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

export default function DemoClientV3() {
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [prompt, setPrompt] = useState('地球自转的轨迹');
  const [granularity, setGranularity] = useState<UIGranularity>('balanced');
  const [status, setStatus] = useState('Idle');
  const [running, setRunning] = useState(false);

  const snapshot = useStreamSnapshot(sessionId);

  const runningRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const stopReasonRef = useRef<StopReason | null>(null);
  const restartGranularityRef = useRef<UIGranularity | null>(null);

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
      setStatus('Completed');
    } else if (isActive) {
      setStatus('Streaming...');
    }
  }, [snapshot?.phase, snapshot?.error, snapshot?.doneInfo]);

  function requestStop(reason: StopReason) {
    if (!runningRef.current) return;
    stopRequestedRef.current = true;
    stopReasonRef.current = reason;
    setStatus(reason === 'restart' ? 'Restarting...' : 'Stopping...');
    stopStream(sessionId);
  }

  async function streamFromApi(requestGranularity: UIGranularity = granularity) {
    if (runningRef.current) return;

    initStream(sessionId);
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

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

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
            applyEvent(sessionId, evt);
          }
        }
      }

      buffer += decoder.decode();
      if (buffer.trim() && !buffer.startsWith(':')) {
        const evt = parseSSEFrame(buffer);
        if (evt) {
          applyEvent(sessionId, evt);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        const shouldRestart = stopReasonRef.current === 'restart';
        const nextGranularity = restartGranularityRef.current;

        if (shouldRestart && nextGranularity) {
          await sleep(100);
          void streamFromApi(nextGranularity);
        }
      } else {
        console.error('Stream error:', error);
      }
    }
  }

  function isGranularity(value: unknown): value is UIGranularity {
    return GRANULARITY_SET.has(value as UIGranularity);
  }

  async function switchGranularity(next: UIGranularity) {
    if (next === granularity) return;
    setGranularity(next);

    if (runningRef.current) {
      restartGranularityRef.current = next;
      requestStop('restart');
      return;
    }

    await streamFromApi(next);
  }

  const blockList = useMemo(() => {
    return Object.values(snapshot?.blocks || {});
  }, [snapshot?.blocks]);

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
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => void streamFromApi()}
                disabled={running}
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {running ? 'Streaming...' : 'Start Stream'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => requestStop('user')}
                disabled={!running}
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Stop
              </motion.button>
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
            </motion.div>
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
