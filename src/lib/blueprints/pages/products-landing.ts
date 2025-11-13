import {
  buildAction,
  buildCards,
  buildDetailNavLinks,
  buildHeroSection,
  pageBlueprintSchema,
} from "../schema";
import { productSummaries, productsDetailNav } from "../products";

export const productsBlueprint = pageBlueprintSchema.parse({
  slug: "products",
  title: "Products | Coastal PASS",
  description:
    "Multi-brand hardware backed by real field techs — Trimble, Raven, Ecorobotix, RTK+ Network, and AgSupport Platform.",
  sections: [
    buildHeroSection("products-hero", {
      eyebrow: "Products",
      title: "Multi-brand hardware backed by real field techs",
      body: "We install, configure, and support the brands growers trust most, plus beta platforms we are building in-house.",
      media: "productsHero",
      actions: [
        buildAction("Browse hardware", "/products"),
        buildAction(
          "Talk with our team",
          "/contact?context=products",
          "secondary",
        ),
      ],
      background: "gradient",
    }),
    {
      id: "product-cards",
      kind: "grid",
      eyebrow: "Featured brands",
      title: "Hardware & platforms we stand behind",
      body: "Each product card includes a direct link to its detail page.",
      cards: buildCards(
        productSummaries.map((product) => ({
          title: product.title,
          body: product.description,
          cta: { label: "View details", href: product.ctaHref },
        })),
      ),
      detailNav: buildDetailNavLinks(productsDetailNav),
    },
    {
      id: "comparison",
      kind: "comparison",
      eyebrow: "Comparison",
      title: "Pick the right fit",
      body: "Quick view of use case, fleet fit, and status for every product.",
      rows: productSummaries.map((product) => ({
        label: product.title,
        useCase: product.description,
        fit: product.fit,
        status: product.status,
      })),
      background: "wash",
    },
    {
      id: "products-cta",
      kind: "cta",
      eyebrow: "Need a demo?",
      title: "Pair hardware with white-glove installs",
      body: "Tell us what you are trying to solve and our specialists will scope installs, retrofits, and support plans.",
      actions: [
        buildAction("Talk with our team", "/contact?context=products"),
        buildAction("Partner with us", "/partner-program", "secondary"),
      ],
    },
  ],
});
