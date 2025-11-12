import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ClientProviders } from "../ClientProviders";

vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: (): ReactElement => <div data-testid="devtools" />,
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("ClientProviders", () => {
  it("renders children within providers", () => {
    render(
      <ClientProviders>
        <p>provider child</p>
      </ClientProviders>,
    );

    expect(screen.getByText("provider child")).toBeInTheDocument();
    expect(screen.getByTestId("devtools")).toBeInTheDocument();
  });

  it("omits devtools in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    render(
      <ClientProviders>
        <p>child</p>
      </ClientProviders>,
    );

    expect(screen.queryByTestId("devtools")).toBeNull();
  });
});
