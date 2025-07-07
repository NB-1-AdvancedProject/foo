import { spawn } from "child_process";
import path from "path";
import os from "os";

export async function runPythonScript(script: string, args: string[] = []) {
  const isWindows = process.platform === "win32";

  // 플랫폼에 따라 파이썬 실행 경로 설정
  const venvPythonPath = isWindows
    ? path.resolve(__dirname, "../../venv/Scripts/python.exe") // Windows
    : path.resolve(__dirname, "../../venv/bin/python"); // macOS/Linux

  const scriptPath = path.resolve(__dirname, `../../recommendations/${script}`);

  return new Promise<string>((resolve, reject) => {
    const p = spawn(venvPythonPath, [scriptPath, ...args], {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
      },
    });

    let stdout = "";
    let stderr = "";

    p.stdout.on("data", (data) => (stdout += data.toString()));
    p.stderr.on("data", (data) => (stderr += data.toString()));

    p.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        console.error(stderr);
        reject(new Error(stderr));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}
