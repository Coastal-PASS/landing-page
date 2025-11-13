import {
  buildAction,
  buildCards,
  buildHeroSection,
  pageBlueprintSchema,
} from "../schema";

export const partnerProgramBlueprint = pageBlueprintSchema.parse({
  slug: "partner-program",
  title: "Dealership Partner Program",
  description:
    "White-label precision ag support for equipment dealerships — installs, diagnostics, RTK services, and Tier 1–3 support.",
  sections: [
    buildHeroSection("partner-hero", {
      eyebrow: "Dealership partner program",
      title: "White-label precision ag support",
      body: "Coastal PASS gives dealerships a complete precision team without the overhead. We deliver under your branding.",
      media: "partnerHero",
      actions: [
        buildAction("Become a partner", "/contact?context=partner"),
        buildAction("See services", "/services", "secondary"),
      ],
      background: "gradient",
    }),
    {
      id: "customers",
      kind: "grid",
      eyebrow: "What your customers get",
      title: "24/7 support from real field techs",
      body: "Remote diagnostics, RTK services, installs, and application control support that protects your reputation.",
      cards: buildCards([
        {
          icon: "clock",
          title: "24/7 response",
          body: "Field techs who pick up the phone during planting, harvest, and everything between.",
        },
        {
          icon: "gauge",
          title: "Diagnostics",
          body: "Mixed fleet troubleshooting, RTK corrections, and telemetry monitoring.",
        },
        {
          icon: "wifi",
          title: "RTK+ coverage",
          body: "Managed corrections during critical windows plus Field Hub connectivity support.",
        },
      ]),
    },
    {
      id: "dealership",
      kind: "grid",
      eyebrow: "What your dealership gets",
      title: "A precision ag team without hiring one",
      body: "Installs, service calls, API configuration, telemetry monitoring, and reporting handled for you.",
      cards: buildCards([
        {
          icon: "tools",
          title: "Install & retrofit",
          body: "We handle the wrenching, wiring, and validation — you keep the customer.",
        },
        {
          icon: "chart",
          title: "Reporting",
          body: "Seasonal summaries, fleet uptime, and service analytics to share internally.",
        },
        {
          icon: "users",
          title: "Multi-location consistency",
          body: "Standard playbooks so every store delivers the same experience.",
        },
      ]),
      background: "wash",
    },
    {
      id: "addons",
      kind: "faq",
      eyebrow: "Optional add-ons",
      title: "Customize the partnership",
      body: "Co-branded apps, telematics dashboards, RTK bundles, and on-site training packages.",
      faqs: [
        {
          question: "Co-branded customer app",
          answer:
            "Give growers a branded experience backed by Coastal PASS support.",
        },
        {
          question: "Telematics dashboards",
          answer:
            "Dashboards tailored for your sales and service reps with fleet health status.",
        },
        {
          question: "On-site training",
          answer:
            "We train your team during new equipment deliveries and seasonal refreshers.",
        },
      ],
    },
    {
      id: "partner-cta",
      kind: "cta",
      eyebrow: "Ready to expand?",
      title: "Become a partner",
      body: "Keep the customer relationship and brand recognition while we operate as your precision department.",
      actions: [buildAction("Become a partner", "/contact?context=partner")],
    },
  ],
});
