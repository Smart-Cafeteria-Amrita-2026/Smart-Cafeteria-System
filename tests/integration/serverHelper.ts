import { spawn, ChildProcess } from "child_process";
import * as path from "path";

// Mock aliases used in frontend services to resolve to their actual files
// This bypasses the need to modify the root jest.config.js
jest.mock("@/lib/api", () => jest.requireActual(path.resolve(__dirname, "../../frontend/src/lib/api")), { virtual: true });
jest.mock("@/src/stores/useMaintenanceStore", () => ({
  useMaintenanceStore: {
    getState: () => ({
      setMaintenance: jest.fn(),
    }),
  },
}), { virtual: true });
jest.mock("@/src/types/primitiveTypes", () => ({}), { virtual: true });

// Mock UI-only dependencies that might break in a Node environment
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}), { virtual: true });
jest.mock("@gsap/react", () => ({}), { virtual: true });
jest.mock("gsap", () => ({}), { virtual: true });

// Import the real api instance to add interceptors for testing
import { api } from "../../frontend/src/lib/api";

/**
 * Sets the authentication cookies for all subsequent service calls.
 * This is necessary because Axios in Node does not handle cookies automatically.
 */
export function setAuthToken(accessToken: string, refreshToken: string) {
  api.interceptors.request.use((config) => {
    config.headers.Cookie = `access_token=${accessToken}; refresh_token=${refreshToken}`;
    return config;
  });
}

export const BASE_URL = "http://localhost:3001";

let backendProcess: ChildProcess | null = null;

export function startBackend(timeout = 60000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (backendProcess) return resolve();

    // Use pnpm exec so local dev deps (ts-node) are picked up
    const cmd = "pnpm";
    const args = ["--filter", "./backend", "exec", "tsx", "src/index.ts"];

    backendProcess = spawn(cmd, args, { shell: true, stdio: ["ignore", "pipe", "pipe"], cwd: process.cwd() });

    const timer = setTimeout(() => {
      reject(new Error("Backend did not start within timeout"));
    }, timeout);

    function onOutput(chunk: unknown) {
      const text = String(chunk);
      // Forward backend output to the test runner logs for debugging
      try {
        console.log("[backend] ", text.trim());
      } catch (e) { }
      if (text.includes("Server running")) {
        clearTimeout(timer);
        resolve();
      }
    }

    backendProcess.stdout?.on("data", onOutput);
    backendProcess.stderr?.on("data", onOutput);

    backendProcess.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    backendProcess.on("exit", (code) => {
      backendProcess = null;
    });
  });
}

export function stopBackend(): void {
  if (!backendProcess) return;
  try {
    backendProcess.kill();
  } catch (e) { }
  backendProcess = null;
}
