import { execSync } from "node:child_process";
import fs from "node:fs";

export function lastModForPath(fileOrDirPath: string): Date {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${fileOrDirPath}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    if (out) {
      const d = new Date(out);
      if (!Number.isNaN(d.getTime())) return d;
    }
  } catch {
    // ignore and fallback to mtime
  }

  try {
    const stat = fs.statSync(fileOrDirPath);
    return stat.mtime;
  } catch {
    return new Date();
  }
}
