import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "../skeleton";

describe("Skeleton", () => {
  it("applies default pulse classes", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toHaveClass("animate-pulse");
  });
});
