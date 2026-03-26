import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  const { code, language } = await req.json();

  if (!code || !language) {
    return NextResponse.json({ error: "code and language required" }, { status: 400 });
  }

  if (!["python", "javascript"].includes(language)) {
    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  }

  const tmpDir = os.tmpdir();
  const ext = language === "python" ? "py" : "js";
  const tmpFile = path.join(tmpDir, `codelearner_${Date.now()}.${ext}`);

  try {
    fs.writeFileSync(tmpFile, code);

    const cmd = language === "python" ? `python3 "${tmpFile}"` : `node "${tmpFile}"`;

    const output = execSync(cmd, {
      timeout: 10000,
      maxBuffer: 1024 * 1024,
      encoding: "utf-8",
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    });

    return NextResponse.json({ output: output.trimEnd(), error: null });
  } catch (err: unknown) {
    const execErr = err as { stderr?: string; message?: string };
    const stderr = execErr.stderr || execErr.message || "Execution error";
    // Clean up the error message
    const cleanError = stderr
      .replace(new RegExp(tmpFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "<script>")
      .trim();
    return NextResponse.json({ output: null, error: cleanError });
  } finally {
    try { fs.unlinkSync(tmpFile); } catch {}
  }
}
