import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "../Footer";

describe("Footer", () => {
  it("renders contact information and navigation links", () => {
    render(<Footer />); 

    expect(screen.getByText(/831-612-pass/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(
      screen.getByRole("link", { name: /fleet telematics/i }),
    ).toHaveAttribute("href", "/services/fleet-telematics");
  });
});
