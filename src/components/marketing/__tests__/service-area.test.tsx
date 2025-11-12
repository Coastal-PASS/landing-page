import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ServiceArea } from "../ServiceArea";

describe("ServiceArea", () => {
  it("lists each service card", () => {
    render(<ServiceArea />);
    expect(screen.getByText(/fleet telematics/i)).toBeInTheDocument();
    expect(screen.getByText(/water management/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /talk with our team/i })[0],
    ).toHaveAttribute("href", "/contact");
  });
});
