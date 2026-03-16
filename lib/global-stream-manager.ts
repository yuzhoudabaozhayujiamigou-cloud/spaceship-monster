/**
 * 全局流管理器 - 独立于 React 组件生命周期
 *
 * 核心特性:
 * 1. 流状态存储在 globalThis，组件卸载时不丢失
 * 2. 发布-订阅模式，支持多组件监听同一流
 * 3. 不可变快照，优化 React 重渲染
 * 4. 自动清理，防止内存泄漏
 */

import type { StreamBlock } from '@/app/tools/ui-streaming-demo/StreamBlocks';

// ==========================================
// 类型定义
// ==========================================

export type StreamPhase = 'idle' | 'active' | 'completed' | 'error' | 'stopped';

export type StreamEvent =
  | { type: 'ui.init'; title: string; layout?: string }
  | { type: 'ui.block'; id: string; blockType: string; [k: string]: unknown }
  | { type: 'ui.patch'; id: string; patch: Record<string, unknown> }
  | { type: 'ui.error'; code?: string; message: string }
  | { type: 'ui.done'; source?: string; provider?: string };

export interface StreamSnapshot {
  sessionId: string;
  phase: StreamPhase;
  title: string;
  layout: string;
  blocks: Record<string, StreamBlock>;
  error: string | null;
  doneInfo: { source: string; provider: string } | null;
  startedAt: number;
  completedAt: number | null;
}

export interface StreamState {
  sessionId: string;
  snapshot: StreamSnapshot;
  abortController: AbortController;
  gcTimer: ReturnType<typeof setTimeout> | null;
}

export type StreamEventListener = (snapshot: StreamSnapshot) => void;

// ==========================================
// 全局存储（使用 globalThis）
// ==========================================

const STREAMS_KEY = '__uiStreamManager__' as const;
const LISTENERS_KEY = '__uiStreamListeners__' as const;
const GC_DELAY_MS = 5 * 60 * 1000; // 5 分钟后清理已完成的流

function getStreamsMap(): Map<string, StreamState> {
  if (!(globalThis as Record<string, unknown>)[STREAMS_KEY]) {
    (globalThis as Record<string, unknown>)[STREAMS_KEY] = new Map<string, StreamState>();
  }
  return (globalThis as Record<string, unknown>)[STREAMS_KEY] as Map<string, StreamState>;
}

function getListenersMap(): Map<string, Set<StreamEventListener>> {
  if (!(globalThis as Record<string, unknown>)[LISTENERS_KEY]) {
    (globalThis as Record<string, unknown>)[LISTENERS_KEY] = new Map<string, Set<StreamEventListener>>();
  }
  return (globalThis as Record<string, unknown>)[LISTENERS_KEY] as Map<string, Set<StreamEventListener>>;
}

// ==========================================
// 辅助函数
// ==========================================

function buildSnapshot(state: StreamState): StreamSnapshot {
  return {
    sessionId: state.snapshot.sessionId,
    phase: state.snapshot.phase,
    title: state.snapshot.title,
    layout: state.snapshot.layout,
    blocks: { ...state.snapshot.blocks }, // 浅拷贝，不可变
    error: state.snapshot.error,
    doneInfo: state.snapshot.doneInfo,
    startedAt: state.snapshot.startedAt,
    completedAt: state.snapshot.completedAt,
  };
}

function emit(state: StreamState) {
  const snapshot = buildSnapshot(state);
  state.snapshot = snapshot; // 更新存储的快照

  // 通知所有订阅者
  const listeners = getListenersMap().get(state.sessionId);
  if (listeners) {
    for (const listener of listeners) {
      try {
        listener(snapshot);
      } catch (error) {
        console.error('[StreamManager] Listener error:', error);
      }
    }
  }

  // 触发 window 事件（用于跨组件通信）
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stream-snapshot-updated', {
        detail: { sessionId: state.sessionId, snapshot },
      })
    );
  }
}

function scheduleGC(state: StreamState) {
  if (state.gcTimer) {
    clearTimeout(state.gcTimer);
  }

  state.gcTimer = setTimeout(() => {
    const map = getStreamsMap();
    const current = map.get(state.sessionId);

    // 只清理已完成的流
    if (current === state && current.snapshot.phase !== 'active') {
      map.delete(state.sessionId);
      console.log(`[StreamManager] GC: Cleaned up stream ${state.sessionId}`);
    }
  }, GC_DELAY_MS);
}

// ==========================================
// 公共 API
// ==========================================

/**
 * 初始化流
 */
export function initStream(sessionId: string): void {
  const map = getStreamsMap();
  const existing = map.get(sessionId);

  // 如果已有活跃流，先中止
  if (existing && existing.snapshot.phase === 'active') {
    existing.abortController.abort();
    if (existing.gcTimer) {
      clearTimeout(existing.gcTimer);
    }
  }

  const abortController = new AbortController();

  const state: StreamState = {
    sessionId,
    abortController,
    snapshot: {
      sessionId,
      phase: 'idle',
      title: 'Waiting for stream...',
      layout: 'stack',
      blocks: {},
      error: null,
      doneInfo: null,
      startedAt: Date.now(),
      completedAt: null,
    },
    gcTimer: null,
  };

  map.set(sessionId, state);
  emit(state);
}

/**
 * 应用事件到流
 */
export function applyEvent(sessionId: string, event: StreamEvent): void {
  const map = getStreamsMap();
  const state = map.get(sessionId);

  if (!state) {
    console.warn(`[StreamManager] Stream ${sessionId} not found, initializing...`);
    initStream(sessionId);
    return applyEvent(sessionId, event);
  }

  switch (event.type) {
    case 'ui.init': {
      state.snapshot.phase = 'active';
      state.snapshot.title = event.title || 'Dashboard';
      state.snapshot.layout = event.layout || 'stack';
      break;
    }

    case 'ui.block': {
      state.snapshot.blocks = {
        ...state.snapshot.blocks,
        [event.id]: event as StreamBlock,
      };
      break;
    }

    case 'ui.patch': {
      const existingBlock = state.snapshot.blocks[event.id];
      if (existingBlock) {
        state.snapshot.blocks = {
          ...state.snapshot.blocks,
          [event.id]: { ...existingBlock, ...event.patch } as StreamBlock,
        };
      }
      break;
    }

    case 'ui.error': {
      state.snapshot.phase = 'error';
      state.snapshot.error = event.message;
      state.snapshot.completedAt = Date.now();
      scheduleGC(state);
      break;
    }

    case 'ui.done': {
      state.snapshot.phase = 'completed';
      state.snapshot.doneInfo = {
        source: event.source || 'unknown',
        provider: event.provider || 'unknown',
      };
      state.snapshot.completedAt = Date.now();
      scheduleGC(state);
      break;
    }
  }

  emit(state);
}

/**
 * 标记流为活跃状态
 */
export function markStreamActive(sessionId: string): void {
  const map = getStreamsMap();
  const state = map.get(sessionId);

  if (state && state.snapshot.phase === 'idle') {
    state.snapshot.phase = 'active';
    emit(state);
  }
}

/**
 * 停止流
 */
export function stopStream(sessionId: string): void {
  const map = getStreamsMap();
  const state = map.get(sessionId);

  if (state && state.snapshot.phase === 'active') {
    state.abortController.abort();
    state.snapshot.phase = 'stopped';
    state.snapshot.completedAt = Date.now();
    emit(state);
    scheduleGC(state);
  }
}

/**
 * 获取流的 AbortController
 */
export function getAbortController(sessionId: string): AbortController | null {
  const map = getStreamsMap();
  const state = map.get(sessionId);
  return state?.abortController || null;
}

/**
 * 获取流快照
 */
export function getSnapshot(sessionId: string): StreamSnapshot | null {
  const map = getStreamsMap();
  const state = map.get(sessionId);
  return state ? buildSnapshot(state) : null;
}

/**
 * 检查流是否活跃
 */
export function isStreamActive(sessionId: string): boolean {
  const map = getStreamsMap();
  const state = map.get(sessionId);
  return state?.snapshot.phase === 'active' || false;
}

/**
 * 订阅流更新
 */
export function subscribe(sessionId: string, listener: StreamEventListener): () => void {
  const listenersMap = getListenersMap();
  let listeners = listenersMap.get(sessionId);

  if (!listeners) {
    listeners = new Set();
    listenersMap.set(sessionId, listeners);
  }

  listeners.add(listener);

  // 返回取消订阅函数
  return () => {
    listeners!.delete(listener);
    if (listeners!.size === 0) {
      listenersMap.delete(sessionId);
    }
  };
}

/**
 * 清理流（手动触发 GC）
 */
export function clearStream(sessionId: string): void {
  const map = getStreamsMap();
  const state = map.get(sessionId);

  if (state) {
    if (state.gcTimer) {
      clearTimeout(state.gcTimer);
    }
    map.delete(sessionId);
    console.log(`[StreamManager] Manually cleared stream ${sessionId}`);
  }
}

/**
 * 获取所有活跃流的 ID
 */
export function getActiveStreamIds(): string[] {
  const map = getStreamsMap();
  const ids: string[] = [];

  for (const [id, state] of map) {
    if (state.snapshot.phase === 'active') {
      ids.push(id);
    }
  }

  return ids;
}

/**
 * 调试：打印所有流状态
 */
export function debugStreams(): void {
  const map = getStreamsMap();
  console.log('[StreamManager] Active streams:', map.size);

  for (const [id, state] of map) {
    console.log(`  ${id}:`, {
      phase: state.snapshot.phase,
      blocks: Object.keys(state.snapshot.blocks).length,
      startedAt: new Date(state.snapshot.startedAt).toISOString(),
    });
  }
}
