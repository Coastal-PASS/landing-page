import {
  buildAction,
  buildCards,
  buildHeroSection,
  pageBlueprintSchema,
} from "../schema";
import { imagery } from "../../imagery";
import { serviceSummaries } from "../services";

export const homeBlueprint = pageBlueprintSchema.parse({
  slug: "home",
  title: "Coastal PASS | Precision Ag Services",
  description:
    "Precision ag services, RTK connectivity, and multi-brand support backed by real field techs on California's Central Coast.",
  sections: [
    buildHeroSection("home-hero", {
      eyebrow: "Precision Ag Services",
      title: "Precision ag services, RTK solutions, and multi-brand support",
      body: "Coastal PASS delivers hands-on services powered by modern hardware, GNSS systems, and field expertise. We keep your equipment connected, calibrated, and running at peak efficiency.",
      media: "homeHero",
      actions: [
        buildAction("Talk with our team", "/contact", "primary"),
        buildAction("Watch video", "#overview-video", "secondary"),
      ],
      background: "gradient",
    }),
    {
      id: "audiences",
      kind: "grid",
      eyebrow: "Who we serve",
      title: "Specialty growers, dealerships, and fleet managers",
      body: "Every engagement pairs hands-on field expertise with digital infrastructure so your crew stays connected and productive.",
      cards: buildCards([
        {
          icon: "sprout",
          title: "Growers & farm operations",
          body: "Specialty crops, vineyards, row crops, orchards, and mixed fleets across the Central Coast.",
          cta: { label: "Explore services", href: "/services" },
        },
        {
          icon: "building",
          title: "Dealerships & service providers",
          body: "White-label installs, diagnostics, RTK service, and support delivered under your brand.",
          cta: { label: "Partner program", href: "/partner-program" },
        },
        {
          icon: "satellite",
          title: "Fleet managers",
          body: "Multi-brand telematics integrations and remote monitoring for every machine in motion.",
          cta: {
            label: "Fleet telematics",
            href: "/services/fleet-telematics",
          },
        },
      ]),
      background: "white",
    },
    {
      id: "service-grid",
      kind: "grid",
      eyebrow: "Our services",
      title: "Comprehensive solutions for modern agriculture",
      body: "Browse the service pillars growers request most and the OEM partners we support on every install.",
      cards: buildCards(
        serviceSummaries.map((service) => ({
          title: service.title,
          body: service.description,
          cta: { label: "View details", href: service.ctaHref },
        })),
      ),
      logos: [
        {
          name: "Trimble",
          logo: "/assets/img/logo.png",
          alt: "Trimble placeholder logo",
        },
        {
          name: "Raven",
          logo: "/assets/img/logo2.png",
          alt: "Raven placeholder logo",
        },
        {
          name: "New Holland",
          logo: "/assets/img/logo3.png",
          alt: "New Holland placeholder logo",
        },
        {
          name: "Ecorobotix",
          logo: "/assets/img/ct/emblem.png",
          alt: "Ecorobotix placeholder logo",
        },
      ],
      background: "wash",
    },
    {
      id: "beta-programs",
      kind: "beta-programs",
      eyebrow: "Beta programs",
      title: "AgSupport Platform + Coastal PASS RTK+ Network",
      body: "Two invitation-only programs that modernize fleet support and RTK coverage across the Central Coast.",
      programs: [
        {
          name: "AgSupport Platform",
          description:
            "Single-pane support workflows covering work orders, RTK access, and service scheduling.",
          bullets: [
            "Centralize grower + dealership requests",
            "Track RTK credentials and user access",
            "Give service teams live equipment context",
          ],
          action: buildAction("Join the AgSupport beta", "/products/agcore"),
          status: { label: "Beta", tone: "warning" },
        },
        {
          name: "Coastal PASS RTK+ Network",
          description:
            "Managed RTK base stations with LTE backhaul, monitoring, and CMR+/RTCM feeds.",
          bullets: [
            "Zero-maintenance base stations",
            "NTRIP + Trimble CMR+ compatibility",
            "24/7 uptime monitoring by Coastal PASS",
          ],
          action: buildAction("Request RTK+ access", "/products/rtk-plus"),
          status: { label: "Limited slots", tone: "warning" },
        },
      ],
      background: "white",
    },
    {
      id: "client-trust",
      kind: "partner-logos",
      eyebrow: "Farms that trust Coastal PASS",
      title: "Central Coast growers we serve",
      body: "A sampling of multi-generational farms and co-ops that rely on Coastal PASS for precision technology deployments.",
      logos: [
        {
          name: "Riverbend Farms",
          logo: "/assets/img/client/1.svg",
          alt: "Riverbend Farms logo",
        },
        {
          name: "Valley Mesa Cooperative",
          logo: "/assets/img/client/2.svg",
          alt: "Valley Mesa Cooperative logo",
        },
        {
          name: "Oak Ridge Vineyards",
          logo: "/assets/img/client/3.svg",
          alt: "Oak Ridge Vineyards logo",
        },
        {
          name: "Coastal Row Crops",
          logo: "/assets/img/client/4.svg",
          alt: "Coastal Row Crops logo",
        },
      ],
      background: "wash",
    },
    {
      id: "why",
      kind: "timeline",
      eyebrow: "Why choose Coastal PASS",
      title: "High-tech advantage with old-fashioned service",
      body: "Four reasons growers keep us on speed dial.",
      steps: [
        {
          label: "01 — Real expertise",
          description:
            "Decades of precision ag deployments with practical upgrades based on real-world results.",
        },
        {
          label: "02 — Full-cycle support",
          description:
            "Installs, retrofits, diagnostics, telemetry, and in-season support from one team.",
        },
        {
          label: "03 — Multi-brand mastery",
          description:
            "Trimble, CNH, Raven, New Holland, and more — mixed fleets welcome.",
        },
        {
          label: "04 — Field-ready reliability",
          description:
            "When something breaks at 6AM, we answer the phone and show up.",
        },
      ],
      background: "white",
      media: imagery.partnerHero,
    },
  ],
});
