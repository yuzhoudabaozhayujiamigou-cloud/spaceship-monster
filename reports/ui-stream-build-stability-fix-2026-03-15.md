# UI Stream Build 稳定性修复报告

- 报告文件: `reports/ui-stream-build-stability-fix-2026-03-15.md`
- 报告时间: 2026-03-16 02:00 (Asia/Shanghai)
- 当前状态: PASS（已收口）
- 主阻塞: 并发 `next build` 竞争写入 `.next` 导致 ENOENT

## 1. 问题与复现

本次在 Windows 本机复现到与历史 `pages-manifest.json ENOENT` 同类的构建竞态：
同一工作区并发执行两个 `next build` 时，第二个进程在 `.next` 产物重命名阶段失败。

复现证据（修复前）:
- `reports/ui-stream-build-stability-fix-2026-03-15-run1.log`: 串行构建成功
- `reports/ui-stream-build-stability-fix-2026-03-15-run2.log`: 串行构建成功
- `reports/ui-stream-build-stability-fix-2026-03-15-concurrent-runA.log`: 并发 A 成功
- `reports/ui-stream-build-stability-fix-2026-03-15-concurrent-runB.log`: 并发 B 失败

关键错误（`concurrent-runB.log`）:

```text
Build error occurred
Error: ENOENT: no such file or directory, rename
'.next\\export\\500.html' -> '.next\\server\\pages\\500.html'
```

## 2. 根因分析

- 根因不是业务代码（`app/api/ui-stream/route.ts`）逻辑错误。
- 根因是构建流程层面的共享产物目录竞争：多个 `next build` 同时读写同一个 `.next` 目录，触发文件存在性竞态。
- 历史中的 `pages-manifest.json ENOENT` 与本次 `500.html rename ENOENT` 本质相同，都是同类并发构建 race condition。

## 3. 修复方案

为 `npm run build` 增加互斥锁包装，保证同一工作区一次只跑一个 Next build：

1. 新增 `scripts/stable-next-build.mjs`
- 使用 `.next-build.lock` 目录锁。
- 锁冲突时轮询等待并输出等待日志。
- 支持超时控制（默认 180000ms，可由 `NEXT_BUILD_LOCK_TIMEOUT_MS` 覆盖）。
- 进程结束/中断时释放锁，避免脏锁长期占用。

2. 更新 `package.json`
- `build`: `node scripts/stable-next-build.mjs`
- 新增 `build:raw`: `next build`（保留原生命令用于诊断）

## 4. 修复后验证

修复后证据:
- `reports/ui-stream-build-stability-fix-2026-03-15-postfix-run1.log`: 成功
- `reports/ui-stream-build-stability-fix-2026-03-15-postfix-run2.log`: 成功
- `reports/ui-stream-build-stability-fix-2026-03-15-postfix-concurrent-runA.log`: 成功
- `reports/ui-stream-build-stability-fix-2026-03-15-postfix-concurrent-runB.log`: 成功

并发 B 日志中可见锁等待而非失败:

```text
[stable-build] Another build is running. Waiting for lock ...
```

最终并发结果:
- A_EXIT=0
- B_EXIT=0

## 5. 结论

- `pages-manifest.json ENOENT` 类构建稳定性阻塞已形成闭环修复。
- 当前建议所有 CI/CD 与本地流程统一使用 `npm run build`（不要直接并发调用 `next build`）。
- 本任务状态: CLOSED / PASS。
