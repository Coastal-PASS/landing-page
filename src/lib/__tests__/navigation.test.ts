import { describe, expect, it } from "vitest";

import { primaryNav } from "@/lib/navigation";

/**
 * Verifies nav hierarchy matches docs/content-rewrite/nav_and_site_structure.md.
 */
describe("navigation", () => {
  it("includes Services and Products dropdowns with child links", () => {
    const services = primaryNav.find((item) => item.label === "Services");
    const products = primaryNav.find((item) => item.label === "Products");

    expect(services?.children?.length).toBeGreaterThanOrEqual(6);
    expect(products?.children?.length).toBeGreaterThanOrEqual(5);
  });

  it("lists core pages in nav order", () => {
    const labels = primaryNav.map((item) => item.label);
    expect(labels).toEqual([
      "Home",
      "About",
      "Services",
      "Products",
      "Dealership Partner Program",
    ]);
  });
});
