import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { spawn, ChildProcess } from "child_process";
import { readFileSync, existsSync, rmSync } from "fs";
import { resolve, join } from "path";

describe("Celestial Integration E2E Tests", () => {
  let devServer: ChildProcess | null = null;
  const packageDir = resolve(import.meta.dirname, "..");
  const celestialDir = join(packageDir, ".celestial");
  const templateHtmlPath = join(celestialDir, "template.html");

  beforeEach(() => {
    if (existsSync(celestialDir)) {
      rmSync(celestialDir, { recursive: true, force: true });
    }
  });

  afterEach(async () => {
    if (devServer) {
      devServer.kill();
      devServer = null;
    }

    if (existsSync(celestialDir)) {
      rmSync(celestialDir, { recursive: true, force: true });
    }
  });

  it("should generate template.html when dev server starts", async () => {
    const { serverUrl, process } = await startDevServer(packageDir);
    devServer = process;

    expect(existsSync(templateHtmlPath)).toBe(true);

    const htmlContent = readFileSync(templateHtmlPath, "utf-8");
    expect(htmlContent).toContain("<!DOCTYPE html>");
    expect(htmlContent).toContain("<title>Integration Test</title>");
    expect(htmlContent).toContain(">Integration Test</h1>"); // More flexible - allows for data attributes
    expect(htmlContent).toContain("Testing the Celestial integration");
    expect(htmlContent).toContain('<div id="slot"');
  });
});

async function startDevServer(
  packageDir: string
): Promise<{ serverUrl: string; process: ChildProcess }> {
  const devServer = spawn("npm", ["run", "dev"], {
    cwd: packageDir,
    stdio: "pipe",
  });

  return new Promise<{ serverUrl: string; process: ChildProcess }>(
    (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Server start timeout"));
      }, 15_000);

      devServer.stdout?.on("data", (data) => {
        const chunk = data.toString();

        const match = chunk.match(/Local\s+http:\/\/([^\s]+)/);
        if (match) {
          const serverUrl = `http://${match[1]}`.replace(/\/$/, "");
          clearTimeout(timeout);
          setTimeout(() => resolve({ serverUrl, process: devServer }), 3_000);
        }
      });

      devServer.stderr?.on("data", (data) => {
        const errorOutput = data.toString();
        if (errorOutput.includes("error") || errorOutput.includes("Error")) {
          clearTimeout(timeout);
          reject(new Error(`Server error: ${errorOutput}`));
        }
      });
    }
  );
}
