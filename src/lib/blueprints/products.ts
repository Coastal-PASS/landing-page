import { type ImageryKey } from "../imagery";
import {
  buildAction,
  buildCards,
  buildHeroSection,
  pageBlueprintSchema,
  type PageBlueprint,
} from "./schema";

interface ProductDetailConfig {
  readonly slug: "trimble" | "raven" | "ecorobotix" | "rtk-plus" | "agcore";
  readonly title: string;
  readonly description: string;
  readonly media: ImageryKey;
  readonly features: ReadonlyArray<string>;
  readonly compatibility: ReadonlyArray<string>;
  readonly ctaHref: string;
  readonly ctaLabel: string;
  readonly status: "Available" | "Limited availability" | "Beta";
}

const productConfigs: ReadonlyArray<ProductDetailConfig> = [
  {
    slug: "trimble",
    title: "Trimble Precision Ag Systems",
    description:
      "Guidance, corrections, and control for mixed fleets backed by Trimble support.",
    media: "trimbleProduct",
    features: [
      "Autosteer and guidance",
      "Field Level II surveying",
      "Rate and section control",
      "RTK setup and troubleshooting",
    ],
    compatibility: [
      "CNH / New Holland",
      "Raven",
      "Aftermarket controllers",
      "PLM equipment",
    ],
    ctaHref: "/contact?context=trimble",
    ctaLabel: "Talk with a Trimble specialist",
    status: "Available",
  },
  {
    slug: "raven",
    title: "Raven Precision Systems",
    description:
      "Spraying, steering, rate control, and application automation built for specialty crops.",
    media: "ravenProduct",
    features: [
      "Raven ARA",
      "DirectSteer",
      "Rate control modules",
      "Implement steering and vineyard integrations",
    ],
    compatibility: [
      "Air-blast sprayers",
      "Vineyard equipment",
      "Broadacre rigs",
      "Retrofit-ready fleets",
    ],
    ctaHref: "/contact?context=raven",
    ctaLabel: "Talk with our team",
    status: "Available",
  },
  {
    slug: "ecorobotix",
    title: "Ecorobotix ARA",
    description:
      "Ultra-targeted spraying with advanced machine vision that reduces chemical use by up to 95%.",
    media: "ecorobotixProduct",
    features: [
      "Ultra-low-rate microdosing",
      "AI-based weed ID",
      "Real-time targeting",
      "High-accuracy application",
    ],
    compatibility: ["Vineyards", "Vegetables", "Specialty crops"],
    ctaHref: "/contact?context=ecorobotix",
    ctaLabel: "Learn more",
    status: "Limited availability",
  },
  {
    slug: "rtk-plus",
    title: "Coastal PASS RTK+ Network (Beta)",
    description:
      "Managed RTK service built for the Central Coast with in-house stations and LTE backhaul.",
    media: "rtkPlusProduct",
    features: [
      "Full-service base stations",
      "Multi-brand GNSS compatibility",
      "NTRIP connections",
      "Monitoring & uptime management",
    ],
    compatibility: [
      "RTCM corrections",
      "Trimble CMR+ (testing)",
      "Multi-brand fleets",
    ],
    ctaHref: "/contact?context=rtk-plus",
    ctaLabel: "Request early access",
    status: "Beta",
  },
  {
    slug: "agcore",
    title: "AgSupport Platform (Beta)",
    description:
      "Unified support and fleet management portal designed for growers and dealerships.",
    media: "agsupportProduct",
    features: [
      "Work order management",
      "Fleet tracking",
      "RTK access management",
      "Customer communication tools",
    ],
    compatibility: [
      "Dealership multi-tenant support",
      "Grower service teams",
      "Mixed fleets",
    ],
    ctaHref: "/contact?context=agsupport",
    ctaLabel: "Join the beta list",
    status: "Beta",
  },
];

const buildProductBlueprint = (config: ProductDetailConfig): PageBlueprint => {
  const cta = buildAction(config.ctaLabel, config.ctaHref);

  return pageBlueprintSchema.parse({
    slug: config.slug,
    title: `${config.title} | Coastal PASS Products`,
    description: config.description,
    sections: [
      buildHeroSection(`${config.slug}-hero`, {
        eyebrow: "Products",
        title: config.title,
        body: config.description,
        media: config.media,
        actions: [
          cta,
          buildAction("Browse all products", "/products", "secondary"),
        ],
        background: config.status === "Beta" ? "gradient" : "white",
      }),
      {
        id: `${config.slug}-features`,
        kind: "grid",
        eyebrow: "What we support",
        title: "Capabilities",
        body: "Hands-on installs, configuration, and support for the most requested features.",
        cards: buildCards(
          config.features.map((feature) => ({ title: feature, body: "" })),
        ),
      },
      {
        id: `${config.slug}-compatibility`,
        kind: "detail-nav",
        eyebrow: "Compatibility",
        title: "Fleet fit",
        body: "Validated combinations and operating environments.",
        links: config.compatibility.map((fit) =>
          buildAction(fit, config.ctaHref, "ghost"),
        ),
      },
      {
        id: `${config.slug}-cta`,
        kind: "cta",
        eyebrow:
          config.status === "Beta"
            ? "Beta program"
            : "Talk with our specialists",
        title:
          config.status === "Beta"
            ? `${config.title} is in ${config.status}`
            : "Ready to configure your system?",
        body:
          config.status === "Beta"
            ? "Early partners receive onboarding, feature roadmap updates, and direct access to our field engineering team."
            : "Tell us about your fleet and we will scope installs, retrofits, and support packages to match.",
        actions: [cta],
        background: "wash",
      },
    ],
  });
};

export const productBlueprints = productConfigs.map(buildProductBlueprint);
export type ProductSlug = ProductDetailConfig["slug"];

export const productBlueprintBySlug: Record<ProductSlug, PageBlueprint> =
  Object.fromEntries(productBlueprints.map((bp) => [bp.slug, bp])) as Record<
    ProductSlug,
    PageBlueprint
  >;

export const productsDetailNav = productConfigs.map((config) => ({
  label: config.title,
  href: `/products/${config.slug}`,
}));

export const productSummaries = productConfigs.map((config) => ({
  slug: config.slug,
  title: config.title,
  description: config.description,
  ctaHref: `/products/${config.slug}`,
  status: config.status,
  fit: config.compatibility[0] ?? "Mixed fleets",
}));
