import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RavenAgSyncSection } from "../../index";
import { agsyncContent } from "@/scripts/ravenBrochure";

describe("RavenAgSyncSection", () => {
  it("renders platform bullets", () => {
    render(<RavenAgSyncSection content={agsyncContent} />);
    expect(screen.getByText(/Dispatch Pro Advantage/i)).toBeInTheDocument();
    expect(screen.getByText(/Work Order Management/i)).toBeInTheDocument();
  });

  it("returns null when no content", () => {
    const { container } = render(<RavenAgSyncSection />);
    expect(container.firstChild).toBeNull();
  });
});
