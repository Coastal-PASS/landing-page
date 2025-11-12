import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RavenHeroSection } from "../../index";
import { brochureLogos, heroContent } from "@/scripts/ravenBrochure";

describe("RavenHeroSection", () => {
  it("renders hero copy and partner logos", () => {
    render(<RavenHeroSection hero={heroContent} logos={brochureLogos} />);

    expect(screen.getByText(heroContent.kicker)).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThan(1);
  });

  it("returns null when hero content missing", () => {
    const { container } = render(<RavenHeroSection />);
    expect(container.firstChild).toBeNull();
  });
});
