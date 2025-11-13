import type { Metadata } from "next";

import type { PageBlueprint } from "@/lib/pageBlueprints";

/**
 * Helper to convert a blueprint into a Next.js metadata object.
 */
export const buildPageMetadata = (blueprint: PageBlueprint): Metadata => ({
  title: blueprint.title,
  description: blueprint.description,
});
