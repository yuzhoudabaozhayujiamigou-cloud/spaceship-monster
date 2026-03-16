/**
 * DemoClient V2 - 使用全局流管理器
 *
 * 改进:
 * 1. 流状态独立于组件生命周期
 * 2. 支持多组件监听同一流
 * 3. 组件卸载时流继续运行
 * 4. 刷新页面后可恢复流状态
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { StreamBoard, type UIGranularity } from './StreamBlocks';
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

const SAMPLE: StreamEvent[] = [
  { type: 'ui.init', title: 'UI Streaming Local Fallback', layout: 'dashboard-2col' },
  {
    type: 'ui.block',
    id: 'prompt',
    blockType: 'text',
    title: 'Prompt',
    column: 'full',
    content: 'Show a tiny dashboard that updates with ui.patch in real time.',
  },
  {
    type: 'ui.block',
    id: 'granularity',
    blockType: 'control',
    title: 'Granularity',
    column: 'full',
    options: GRANULARITY_OPTIONS,
    value: 'balanced',
  },
  { type: 'ui.block', id: 'answer', blockType: 'text', title: 'Assistant', content: '', column: 'left' },
  {
    type: 'ui.block',
    id: 'metric_compare',
    blockType: 'metric-group',
    title: 'Compare Metrics',
    column: 'right',
    metrics: [
      { id: 'chars', label: 'Chars', value: 0, delta: 0, tone: 'neutral' },
      { id: 'words', label: 'Words', value: 0, delta: 0, tone: 'neutral' },
      { id: 'sentences', label: 'Sentences', value: 0, delta: 0, tone: 'neutral' },
      { id: 'read', label: 'Read Sec', value: 0, delta: 0, tone: 'neutral' },
    ],
  },
  {
    type: 'ui.block',
    id: 'draft_line_chart',
    blockType: 'chart',
    title: 'Draft Growth',
    column: 'left',
    chart: {
      type: 'line',
      labels: ['T0'],
      series: [{ name: 'Chars', data: [0] }],
    },
  },
  {
    type: 'ui.block',
    id: 'term_bar_chart',
    blockType: 'chart',
    title: 'Top Terms',
    column: 'right',
    chart: {
      type: 'bar',
      labels: ['stream', 'patch', 'chart'],
      series: [{ name: 'Mentions', data: [0, 0, 0] }],
    },
  },
  {
    type: 'ui.block',
    id: 'update_table',
    blockType: 'table',
    title: 'Patch Timeline',
    column: 'full',
    columns: [
      { key: 'step', label: 'Step' },
      { key: 'snippet', label: 'Snippet' },
      { key: 'chars', label: 'Chars', align: 'right' },
    ],
    rows: [{ step: 'T0', snippet: 'Waiting for first patch...', chars: 0 }],
  },
  { type: 'ui.block', id: 'chars', blockType: 'kpi', label: 'Generated Chars', value: 0, column: 'right' },
  {
    type: 'ui.patch',
    id: 'answer',
    patch: {
      content: 'This is local fallback playback. It proves incremental rendering works even without API credentials.',
    },
  },
  { type: 'ui.patch', id: 'chars', patch: { value: 95 } },
  {
    type: 'ui.patch',
    id: 'metric_compare',
    patch: {
      metrics: [
        { id: 'chars', label: 'Chars', value: 95, delta: 95, tone: 'good' },
        { id: 'words', label: 'Words', value: 14, delta: 14, tone: 'good' },
        { id: 'sentences', label: 'Sentences', value: 2, delta: 2, tone: 'neutral' },
        { id: 'read', label: 'Read Sec', value: 6, delta: 0, tone: 'neutral' },
      ],
    },
  },
  {
    type: 'ui.patch',
    id: 'draft_line_chart',
    patch: {
      chart: {
        type: 'line',
        labels: ['T1', 'T2', 'T3', 'T4'],
        series: [{ name: 'Chars', data: [21, 44, 73, 95] }],
      },
    },
  },
  {
    type: 'ui.patch',
    id: 'term_bar_chart',
    patch: {
      chart: {
        type: 'bar',
        labels: ['stream', 'patch', 'fallback'],
        series: [{ name: 'Mentions', data: [3, 2, 1] }],
      },
    },
  },
  {
    type: 'ui.patch',
    id: 'update_table',
    patch: {
      rows: [
        { step: 'T2', snippet: 'This is local fallback playback.', chars: 31 },
        { step: 'T3', snippet: 'It proves incremental rendering works.', chars: 67 },
        { step: 'T4', snippet: 'Even without API credentials.', chars: 95 },
      ],
    },
  },
  { type: 'ui.done', source: 'fallback', provider: 'fallback' },
];

const STREAM_INACTIVITY_TIMEOUT_MS = 20_000;
const SESSION_ID_STORAGE_KEY = 'ui-stream-demo-session-id';
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createSessionId(): string {
  const generated =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

  return generated.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 64) || 'ui_stream_demo';
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return createSessionId();
  }

  try {
    const stored = window.localStorage.getItem(SESSION_ID_STORAGE_KEY);
    if (stored && SESSION_ID_PATTERN.test(stored)) {
      return stored;
    }
  } catch {
    // localStorage 不可用
  }

  const newId = createSessionId();
  try {
    window.localStorage.setItem(SESSION_ID_STORAGE_KEY, newId);
  } catch {
    // 忽略存储失败
  }

  return newId;
}

function clearSessionIdStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(SESSION_ID_STORAGE_KEY);
  } catch {
    // 忽略
  }
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

export default function DemoClientV2() {
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [prompt, setPrompt] = useState('地球自转的轨迹');
  const [granularity, setGranularity] = useState<UIGranularity>('balanced');
  const [status, setStatus] = useState('Idle');
  const [running, setRunning] = useState(false);

  // 使用全局流管理器
  const snapshot = useStreamSnapshot(sessionId);

  const runningRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const stopReasonRef = useRef<StopReason | null>(null);
  const restartGranularityRef = useRef<UIGranularity | null>(null);

  // 初始化流
  useEffect(() => {
    initStream(sessionId);
  }, [sessionId]);

  // 同步 running 状态
  useEffect(() => {
    const isActive = snapshot?.phase === 'active';
    setRunning(isActive);
    runningRef.current = isActive;

    if (snapshot?.error) {
      setStatus(`Error: ${snapshot.error}`);
    } else if (snapshot?.doneInfo) {
      setStatus(`Stream finished (source=${snapshot.doneInfo.source}, provider=${snapshot.doneInfo.provider})`);
    } else if (isActive) {
      setStatus('Streaming...');
    }
  }, [snapshot?.phase, snapshot?.error, snapshot?.doneInfo]);

  function requestStop(reason: StopReason) {
    if (!runningRef.current) return;

    stopRequestedRef.current = true;
    stopReasonRef.current = reason;
    setStatus(reason === 'restart' ? 'Switching granularity and restarting...' : 'Stopping stream...');
    stopStream(sessionId);
  }

  function clearSession() {
    clearSessionIdStorage();
    setStatus('Session cleared. Next request will create a new session id.');
  }

  async function runLocalSample() {
    initStream(sessionId);
    setStatus('Playing local fallback events...');

    for (const evt of SAMPLE) {
      applyEvent(sessionId, evt);
      await sleep(260);
    }
  }

  async function replayLocal() {
    if (runningRef.current) return;

    try {
      await runLocalSample();
    } catch (error) {
      console.error('Local replay error:', error);
    }
  }

  function isGranularity(value: unknown): value is UIGranularity {
    return GRANULARITY_SET.has(value as UIGranularity);
  }

  async function streamFromApi(requestGranularity: UIGranularity = granularity) {
    if (runningRef.current) return;

    initStream(sessionId);
    setGranularity(requestGranularity);
    stopRequestedRef.current = false;
    stopReasonRef.current = null;
    restartGranularityRef.current = null;

    const endpoint = API_STREAM_PATH;
    setStatus(`Connecting to ${endpoint}...`);

    try {
      markStreamActive(sessionId);

      const controller = getAbortController(sessionId);
      if (!controller) {
        throw new Error('AbortController not found');
      }

      let timedOut = false;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const touch = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, STREAM_INACTIVITY_TIMEOUT_MS);
      };

      try {
        touch();

        const requestUrl = new URL(endpoint, window.location.origin);
        requestUrl.searchParams.set('_ts', String(Date.now()));

        const response = await fetch(requestUrl, {
          method: 'POST',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'x-ui-session-id': sessionId,
            'Cache-Control': 'no-cache, no-store, max-age=0',
            Pragma: 'no-cache',
          },
          body: JSON.stringify({ prompt, granularity: requestGranularity }),
          signal: controller.signal,
        });

        if (!response.body) {
          throw new Error(`API request failed: ${response.status}`);
        }

        setStatus('Streaming events from API...');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let sawDone = false;

        while (true) {
          const { value, done: streamDone } = await reader.read();
          if (streamDone) break;

          if (value && value.byteLength > 0) {
            touch();
            buffer += decoder.decode(value, { stream: true });
          }

          let boundary = buffer.indexOf('\n\n');
          while (boundary !== -1) {
            const frame = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            const evt = parseSSEFrame(frame);
            if (evt) {
              applyEvent(sessionId, evt);
              touch();
              if (evt.type === 'ui.done') {
                sawDone = true;
              }
            }

            boundary = buffer.indexOf('\n\n');
          }
        }

        if (!sawDone) {
          throw new Error('Stream ended before ui.done.');
        }
      } catch (err) {
        if (stopRequestedRef.current) {
          if (stopReasonRef.current === 'user') {
            applyEvent(sessionId, { type: 'ui.done', source: 'cancelled', provider: 'client' });
            setStatus('Stream stopped by user.');
          }
        } else if (timedOut) {
          applyEvent(sessionId, {
            type: 'ui.error',
            message: `No stream event received for ${Math.round(STREAM_INACTIVITY_TIMEOUT_MS / 1000)} seconds.`,
          });
        } else {
          const message = err instanceof Error ? err.message : 'Unknown streaming error';
          applyEvent(sessionId, { type: 'ui.error', message });
        }
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      applyEvent(sessionId, { type: 'ui.error', message });
    } finally {
      const shouldRestart = stopReasonRef.current === 'restart' && !!restartGranularityRef.current;
      const nextGranularity = restartGranularityRef.current;
      stopRequestedRef.current = false;
      stopReasonRef.current = null;
      restartGranularityRef.current = null;

      if (shouldRestart && nextGranularity) {
        void streamFromApi(nextGranularity);
      }
    }
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

  const blockList = useMemo(() => Object.values(snapshot?.blocks || {}), [snapshot?.blocks]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
        <label htmlFor="prompt" className="mb-2 block text-sm text-zinc-300">
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          placeholder="Describe the UI you want the stream to generate"
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
        <div className="mb-2 text-sm text-zinc-300">Granularity (switch triggers a new API request)</div>
        <div className="flex flex-wrap gap-2">
          {GRANULARITY_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => void switchGranularity(opt)}
              className={`rounded-md px-3 py-1 text-xs ${
                opt === granularity
                  ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                  : 'border border-zinc-700 bg-zinc-900 text-zinc-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{snapshot?.title || 'Waiting for stream...'}</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void streamFromApi()}
            disabled={running}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? 'Streaming...' : 'Start API Stream'}
          </button>
          <button
            onClick={() => requestStop('user')}
            disabled={!running}
            className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Stop
          </button>
          <button
            onClick={() => void replayLocal()}
            disabled={running}
            className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm text-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Local Fallback Replay
          </button>
          <button
            onClick={() => initStream(sessionId)}
            disabled={running}
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={clearSession}
            disabled={running}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Session
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
        <div className="text-xs text-zinc-400">
          <span className="font-medium">Status:</span> {status}
        </div>
        {snapshot?.doneInfo && (
          <div className="mt-1 text-xs text-zinc-500">
            Source: {snapshot.doneInfo.source} | Provider: {snapshot.doneInfo.provider}
          </div>
        )}
      </div>

      <StreamBoard
        blocks={blockList}
        layout={snapshot?.layout || 'stack'}
        granularity={granularity}
        isGranularityOption={isGranularity}
        onGranularityChange={(next) => {
          void switchGranularity(next);
        }}
      />
    </div>
  );
}
