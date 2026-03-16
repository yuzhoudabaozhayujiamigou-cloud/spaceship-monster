import DemoClientV2 from '../ui-streaming-demo/DemoClientV2';

export default function Page() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">UI Streaming Demo V2</h1>
        <p className="text-zinc-400">
          使用全局流管理器 - 流状态独立于组件生命周期，支持多组件监听
        </p>
        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <h2 className="text-sm font-semibold text-emerald-400 mb-2">🎉 新特性</h2>
          <ul className="text-xs text-emerald-300/80 space-y-1">
            <li>✅ 组件卸载时流继续运行</li>
            <li>✅ 多个组件可监听同一流</li>
            <li>✅ 不可变快照优化性能</li>
            <li>✅ 自动垃圾回收防止内存泄漏</li>
          </ul>
        </div>
      </div>
      <DemoClientV2 />
    </div>
  );
}
