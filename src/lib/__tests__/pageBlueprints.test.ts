import { describe, expect, it } from "vitest";

import {
  marketingBlueprints,
  productBlueprintBySlug,
  productBlueprints,
  serviceBlueprintBySlug,
  serviceBlueprints,
  type ProductSlug,
  type ServiceSlug,
} from "@/lib/pageBlueprints";

/**
 * Ensures blueprint maps cover every configured slug so dynamic routes stay type-safe.
 */
describe("pageBlueprints", () => {
  it("maps every service blueprint by slug", () => {
    serviceBlueprints.forEach((blueprint) => {
      const slug = blueprint.slug as ServiceSlug;
      expect(serviceBlueprintBySlug[slug]).toBeDefined();
      expect(
        serviceBlueprintBySlug[slug].sections.length,
      ).toBeGreaterThanOrEqual(3);
    });
  });

  it("maps every product blueprint by slug", () => {
    productBlueprints.forEach((blueprint) => {
      const slug = blueprint.slug as ProductSlug;
      expect(productBlueprintBySlug[slug]).toBeDefined();
      expect(
        productBlueprintBySlug[slug].sections.length,
      ).toBeGreaterThanOrEqual(3);
    });
  });

  it("registers marketing blueprints with metadata", () => {
    Object.values(marketingBlueprints).forEach((blueprint) => {
      expect(blueprint.title.length).toBeGreaterThan(0);
      expect(blueprint.description.length).toBeGreaterThan(10);
    });
  });
});
