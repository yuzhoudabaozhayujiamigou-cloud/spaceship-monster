import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const LOCK_DIR = path.join(process.cwd(), ".next-build.lock");
const LOCK_INFO_PATH = path.join(LOCK_DIR, "owner.json");
const LOCK_RETRY_MS = readPositiveInt("NEXT_BUILD_LOCK_RETRY_MS", 500);
const LOCK_TIMEOUT_MS = readPositiveInt("NEXT_BUILD_LOCK_TIMEOUT_MS", 180_000);

let hasLock = false;

function readPositiveInt(name, fallback) {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function acquireBuildLock() {
  const startAt = Date.now();
  let lastLogAt = 0;

  while (true) {
    try {
      await mkdir(LOCK_DIR);
      hasLock = true;
      await writeFile(
        LOCK_INFO_PATH,
        JSON.stringify(
          {
            pid: process.pid,
            createdAt: new Date().toISOString(),
            cwd: process.cwd(),
          },
          null,
          2,
        ),
        "utf8",
      );
      return;
    } catch (error) {
      const code = error && typeof error === "object" ? error.code : undefined;
      if (code !== "EEXIST") {
        throw error;
      }

      const elapsed = Date.now() - startAt;
      if (elapsed >= LOCK_TIMEOUT_MS) {
        throw new Error(
          `Timed out waiting ${LOCK_TIMEOUT_MS}ms for Next.js build lock at ${LOCK_DIR}.`,
        );
      }

      if (Date.now() - lastLogAt >= 5_000) {
        lastLogAt = Date.now();
        console.log(
          `[stable-build] Another build is running. Waiting for lock (${Math.ceil(elapsed / 1000)}s)...`,
        );
      }
      await sleep(LOCK_RETRY_MS);
    }
  }
}

async function releaseBuildLock() {
  if (!hasLock) {
    return;
  }

  hasLock = false;
  await rm(LOCK_DIR, { recursive: true, force: true });
}

function runNextBuild(extraArgs) {
  const nextBin = require.resolve("next/dist/bin/next");
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextBin, "build", ...extraArgs], {
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        resolve(1);
        return;
      }
      resolve(code ?? 1);
    });
  });
}

async function main() {
  const extraArgs = process.argv.slice(2);
  await acquireBuildLock();
  try {
    const exitCode = await runNextBuild(extraArgs);
    process.exitCode = exitCode;
  } finally {
    await releaseBuildLock();
  }
}

async function handleSignal(signal) {
  try {
    await releaseBuildLock();
  } finally {
    process.exit(signal === "SIGINT" ? 130 : 143);
  }
}

process.on("SIGINT", () => {
  void handleSignal("SIGINT");
});
process.on("SIGTERM", () => {
  void handleSignal("SIGTERM");
});

main().catch(async (error) => {
  console.error("[stable-build] Build wrapper failed.", error);
  await releaseBuildLock();
  process.exit(1);
});
