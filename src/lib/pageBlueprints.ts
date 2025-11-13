export {
  pageBlueprintSchema,
  sectionSchema,
  type PageBlueprint,
  type Section,
  type SectionAction,
} from "./blueprints/schema";

export {
  serviceBlueprints,
  serviceBlueprintBySlug,
  servicesDetailNav,
  serviceSummaries,
  type ServiceSlug,
} from "./blueprints/services";

export {
  productBlueprints,
  productBlueprintBySlug,
  productSummaries,
  productsDetailNav,
  type ProductSlug,
} from "./blueprints/products";

import { aboutBlueprint } from "./blueprints/pages/about";
import { contactBlueprint } from "./blueprints/pages/contact";
import { homeBlueprint } from "./blueprints/pages/home";
import { partnerProgramBlueprint } from "./blueprints/pages/partner-program";
import { privacyBlueprint } from "./blueprints/pages/privacy";
import { productsBlueprint } from "./blueprints/pages/products-landing";
import { ravenBlueprint } from "./blueprints/pages/raven";
import { servicesBlueprint } from "./blueprints/pages/services-landing";
import type { PageBlueprint } from "./blueprints/schema";

export const marketingBlueprints = {
  home: homeBlueprint,
  about: aboutBlueprint,
  services: servicesBlueprint,
  products: productsBlueprint,
  partner: partnerProgramBlueprint,
  contact: contactBlueprint,
  privacy: privacyBlueprint,
  raven: ravenBlueprint,
} satisfies Record<string, PageBlueprint>;

export type MarketingBlueprintSlug = keyof typeof marketingBlueprints;

export const getMarketingBlueprint = (
  slug: MarketingBlueprintSlug,
): PageBlueprint => marketingBlueprints[slug];

export {
  homeBlueprint,
  aboutBlueprint,
  servicesBlueprint,
  productsBlueprint,
  partnerProgramBlueprint,
  contactBlueprint,
  privacyBlueprint,
  ravenBlueprint,
};
