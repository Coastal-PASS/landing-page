import { afterEach, describe, expect, it, vi } from "vitest";

describe("getQueryClient", () => {
  const loadModule = async (): Promise<typeof import("../query-client")> => {
    vi.resetModules();
    return import("../query-client");
  };

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;
  });

  it("creates a new client per call on the server", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;
    const { getQueryClient } = await loadModule();

    const first = getQueryClient();
    const second = getQueryClient();
    expect(first).not.toBe(second);
  });

  it("reuses the singleton in the browser", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = {} as Window;
    const { getQueryClient } = await loadModule();

    const first = getQueryClient();
    const second = getQueryClient();
    expect(first).toBe(second);
  });
});
