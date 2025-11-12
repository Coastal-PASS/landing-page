import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RavenSystemsSection } from "../../index";
import {
  connectivityContent,
  heroContent,
  tractorOptions,
} from "@/scripts/ravenBrochure";

describe("RavenSystemsSection", () => {
  it("renders implement note and tractor options", () => {
    render(
      <RavenSystemsSection
        implementNote={heroContent.implementNote}
        options={tractorOptions}
        connectivity={connectivityContent}
      />,
    );

    expect(screen.getAllByText(/Implement Base Kit/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/CR7/i)[0]).toBeInTheDocument();
  });

  it("returns null when no data provided", () => {
    const { container } = render(<RavenSystemsSection />);
    expect(container.firstChild).toBeNull();
  });
});
