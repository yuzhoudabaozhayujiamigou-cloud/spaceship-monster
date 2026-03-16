/**
 * React Hook: 使用全局流管理器
 *
 * 特性:
 * 1. 自动订阅流更新
 * 2. 组件卸载时自动取消订阅
 * 3. 流状态独立于组件生命周期
 */

'use client';

import { useEffect, useState } from 'react';
import {
  subscribe,
  getSnapshot,
  type StreamSnapshot,
} from '@/lib/global-stream-manager';

/**
 * 订阅流快照
 */
export function useStreamSnapshot(sessionId: string): StreamSnapshot | null {
  const [snapshot, setSnapshot] = useState<StreamSnapshot | null>(() => getSnapshot(sessionId));

  useEffect(() => {
    // 获取初始快照
    setSnapshot(getSnapshot(sessionId));

    // 订阅更新
    const unsubscribe = subscribe(sessionId, (newSnapshot) => {
      setSnapshot(newSnapshot);
    });

    return unsubscribe;
  }, [sessionId]);

  return snapshot;
}

/**
 * 监听流阶段变化
 */
export function useStreamPhase(sessionId: string): StreamSnapshot['phase'] {
  const snapshot = useStreamSnapshot(sessionId);
  return snapshot?.phase || 'idle';
}

/**
 * 监听流是否活跃
 */
export function useIsStreamActive(sessionId: string): boolean {
  const phase = useStreamPhase(sessionId);
  return phase === 'active';
}

/**
 * 监听流错误
 */
export function useStreamError(sessionId: string): string | null {
  const snapshot = useStreamSnapshot(sessionId);
  return snapshot?.error || null;
}

/**
 * 监听流完成信息
 */
export function useStreamDoneInfo(sessionId: string): StreamSnapshot['doneInfo'] {
  const snapshot = useStreamSnapshot(sessionId);
  return snapshot?.doneInfo || null;
}
