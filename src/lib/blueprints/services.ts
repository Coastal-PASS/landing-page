import { type ImageryKey } from "../imagery";
import {
  buildAction,
  buildCards,
  buildHeroSection,
  pageBlueprintSchema,
  type PageBlueprint,
} from "./schema";

interface ServiceDetailConfig {
  readonly slug:
    | "fleet-telematics"
    | "water-management"
    | "seeding-and-rate-control"
    | "application-control"
    | "sprayer-retrofits"
    | "agtech-consulting";
  readonly title: string;
  readonly description: string;
  readonly heroCopy: string;
  readonly media: ImageryKey;
  readonly highlights: ReadonlyArray<string>;
  readonly metrics: ReadonlyArray<string>;
  readonly audiences: ReadonlyArray<string>;
  readonly ctaHref: string;
  readonly ctaLabel: string;
}

const detailConfigs: ReadonlyArray<ServiceDetailConfig> = [
  {
    slug: "fleet-telematics",
    title: "Fleet Telematics",
    description:
      "Mixed-fleet visibility without the guesswork. Monitor CNH, Trimble, Raven, and aftermarket hardware from one dashboard.",
    heroCopy:
      "Modern farming depends on knowing where your equipment is, how it's performing, and which problems you can prevent before they cost a crop.",
    media: "fleetTelematics",
    highlights: [
      "Real-time location and diagnostics",
      "Fuel, idle, and operator behavior insights",
      "Preventative maintenance alerts",
    ],
    metrics: [
      "Real-time location",
      "Engine hours",
      "Diagnostic codes",
      "Fuel consumption",
      "Operator behavior",
      "Maintenance intervals",
    ],
    audiences: [
      "Mixed-brand fleets",
      "Service managers",
      "Multi-ranch growers",
      "Dealership support teams",
    ],
    ctaHref: "/contact?context=fleet-telematics",
    ctaLabel: "Talk with our team",
  },
  {
    slug: "water-management",
    title: "Water Management & Field Leveling",
    description:
      "Survey, plan, and grade with precision RTK workflows to improve drainage and irrigation.",
    heroCopy:
      "Complete Field Level II and multiplane surveys eliminate waste, improve drainage, and create uniform rows for irrigation and planting.",
    media: "waterManagement",
    highlights: [
      "RTK surveys and multiplane modeling",
      "Cut-fill mapping and prep plans",
      "Deployment support for leveling equipment",
    ],
    metrics: [
      "High-accuracy RTK surveys",
      "Multiplane surface modeling",
      "Cut-fill mapping",
      "Field preparation plans",
      "Leveling equipment deployment",
    ],
    audiences: [
      "Vineyards & specialty crops",
      "Row crop rotations",
      "Pre-irrigation projects",
      "Automation-ready fields",
    ],
    ctaHref: "/contact?context=water-management",
    ctaLabel: "Schedule a survey",
  },
  {
    slug: "seeding-and-rate-control",
    title: "Seeding & Rate Control",
    description:
      "More accuracy. Less waste. Better yield potential with OEM and retrofit systems.",
    heroCopy:
      "We install and support rate control platforms that maintain consistent placement and prevent costly skips or doubles.",
    media: "seedingRateControl",
    highlights: [
      "Variable rate seeding",
      "Blockage monitoring",
      "Section control",
      "Prescription map integrations",
    ],
    metrics: [
      "Variable rate seeding",
      "Blockage monitoring",
      "Section control",
      "OEM + aftermarket controllers",
      "Prescription map workflows",
    ],
    audiences: [
      "Mixed soil zones",
      "Vegetable operations",
      "Planters needing automation",
      "Dealership retrofit programs",
    ],
    ctaHref: "/contact?context=seeding",
    ctaLabel: "Talk with our team",
  },
  {
    slug: "application-control",
    title: "Application Control",
    description:
      "Precision spraying for vineyards, vegetables, and specialty crops.",
    heroCopy:
      "From fertilizer to crop protection, we configure rate and section control solutions for consistent coverage on every pass.",
    media: "applicationControl",
    highlights: [
      "Liquid rate control",
      "Section control",
      "Pulse-width modulation",
      "Application mapping",
    ],
    metrics: [
      "Liquid rate control",
      "Section control",
      "PWM integrations",
      "Vineyard/orchard sprayers",
      "Application records",
    ],
    audiences: [
      "Air-blast sprayers",
      "Vegetable growers",
      "Broadacre spraying",
      "Mixed fleets needing unified control",
    ],
    ctaHref: "/contact?context=application-control",
    ctaLabel: "Talk with our team",
  },
  {
    slug: "sprayer-retrofits",
    title: "Sprayer Retrofits",
    description:
      "Run modern Raven control systems on existing sprayers with clean installs.",
    heroCopy:
      "Retrofit older sprayers with Raven ARA and DirectSteer to cut drift, reduce waste, and extend the life of your equipment.",
    media: "sprayerRetrofits",
    highlights: [
      "Raven ARA",
      "DirectSteer",
      "Boom control modules",
      "Custom cab harnessing",
    ],
    metrics: [
      "Raven ARA installs",
      "DirectSteer steering",
      "Section + rate controllers",
      "Custom wiring looms",
      "Before/after verification",
    ],
    audiences: [
      "Specialty crop sprayers",
      "Dealership retrofit programs",
      "Growers delaying replacement",
      "Mixed fleets",
    ],
    ctaHref: "/contact?context=retrofits",
    ctaLabel: "Talk with our team",
  },
  {
    slug: "agtech-consulting",
    title: "AgTech Consulting & Integrations",
    description:
      "Where hardware meets software to unify telematics, GNSS, and data workflows.",
    heroCopy:
      "We integrate OEM systems with cloud dashboards, APIs, and dealership workflows so your data and teams stay connected.",
    media: "agtechConsulting",
    highlights: [
      "Data workflow design",
      "Custom dashboards",
      "Equipment-to-cloud integrations",
      "API connections",
    ],
    metrics: [
      "Mixed fleet telemetry",
      "Customer portals",
      "Standardized data collection",
      "Dealership workflow automation",
      "Multi-brand fleet unification",
    ],
    audiences: [
      "Dealership service teams",
      "Farm data leads",
      "Developers needing OEM access",
      "Operations leaders",
    ],
    ctaHref: "/contact?context=consulting",
    ctaLabel: "Start a consultation",
  },
];

const buildServiceBlueprint = (config: ServiceDetailConfig): PageBlueprint => {
  const cta = buildAction(config.ctaLabel, config.ctaHref);

  return pageBlueprintSchema.parse({
    slug: config.slug,
    title: `${config.title} | Coastal PASS Services`,
    description: config.description,
    sections: [
      buildHeroSection(`${config.slug}-hero`, {
        eyebrow: "Services",
        title: config.title,
        body: config.heroCopy,
        media: config.media,
        actions: [
          cta,
          buildAction("See all services", "/services", "secondary"),
        ],
        background: "gradient",
      }),
      {
        id: `${config.slug}-metrics`,
        kind: "grid",
        eyebrow: "Capabilities",
        title: "What we deliver",
        body: "Core deliverables that keep your fleet connected and productive.",
        cards: buildCards(
          config.metrics.map((metric) => ({ title: metric, body: "" })),
        ),
      },
      {
        id: `${config.slug}-why`,
        kind: "cta",
        eyebrow: "Why it matters",
        title: "Better visibility means fewer surprises",
        body: "Every engagement pairs hands-on techs with data so you catch issues early, reduce downtime, and support crews in season.",
        copy: config.highlights,
        actions: [cta],
        background: "wash",
      },
      {
        id: `${config.slug}-audiences`,
        kind: "detail-nav",
        eyebrow: "Perfect for",
        title: "Where this service shines",
        body: "Ideal operations that see immediate ROI.",
        links: config.audiences.map((audience) =>
          buildAction(audience, config.ctaHref, "ghost"),
        ),
      },
    ],
  });
};

export const serviceBlueprints = detailConfigs.map(buildServiceBlueprint);
export type ServiceSlug = ServiceDetailConfig["slug"];

export const serviceBlueprintBySlug: Record<ServiceSlug, PageBlueprint> =
  Object.fromEntries(serviceBlueprints.map((bp) => [bp.slug, bp])) as Record<
    ServiceSlug,
    PageBlueprint
  >;

export const servicesDetailNav = detailConfigs.map((config) => ({
  label: config.title,
  href: `/services/${config.slug}`,
}));

export const serviceSummaries = detailConfigs.map((config) => ({
  slug: config.slug,
  title: config.title,
  description: config.description,
  ctaHref: `/services/${config.slug}`,
}));
