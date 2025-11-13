import {
  buildAction,
  buildCards,
  buildHeroSection,
  pageBlueprintSchema,
} from "../schema";

export const ravenBlueprint = pageBlueprintSchema.parse({
  slug: "raven-air-blast",
  title: "Raven Air Blast Experience",
  description:
    "Immersive walkthrough of the Raven Air Blast Sprayer Application Kit, CR7/Viper 4+, Field Hub, and AgSync Dispatch Pro.",
  sections: [
    buildHeroSection("raven-hero", {
      eyebrow: "Raven experience",
      title:
        "Reach a new level with the Raven Air Blast Sprayer Application Kit",
      body: "Specialty crop growers gain unmatched control and efficiency by outfitting air blast sprayers with Raven technology.",
      media: "ravenHero",
      actions: [
        buildAction(
          "Talk with Raven specialists",
          "/contact?context=raven-air-blast",
        ),
      ],
      background: "gradient",
    }),
    {
      id: "raven-implement",
      kind: "cta",
      eyebrow: "Implement base kit",
      title: "RCM-Universal kit",
      body: "Master on/off valve, sectional boom valves, high-accuracy flow meter, and remote display support for turn-compensated control.",
      copy: [
        "Supports up to 12 on/off sections and multi-product control.",
        "Includes remote display support for real-time troubleshooting.",
      ],
      actions: [
        buildAction("Request install", "/contact?context=raven-air-blast"),
      ],
    },
    {
      id: "raven-displays",
      kind: "grid",
      eyebrow: "Tractor control options",
      title: "Choose the in-cab experience",
      body: "CR7 for compact operations and Viper 4+ for advanced workflows.",
      cards: buildCards([
        {
          icon: "monitor",
          title: "CR7",
          body: 'Compact 7" display with widget-based navigation, auto boundaries, job lists, and Slingshot connectivity.',
        },
        {
          icon: "display",
          title: "Viper 4+",
          body: '12.1" touchscreen with camera inputs, ethernet, and scalability for seeding, spraying, and spreading.',
        },
        {
          icon: "users",
          title: "Operator coaching",
          body: "Coastal PASS provides remote display support plus in-field training to keep crews confident on every pass.",
        },
      ]),
      background: "wash",
    },
    {
      id: "raven-connectivity",
      kind: "grid",
      eyebrow: "Connectivity",
      title: "Field Hub 2.1",
      body: "Reliable LTE modem with Wi-Fi hotspot, ethernet, GPS, and serial connections for cellular RTK streaming and fleet tracking.",
      cards: buildCards([
        {
          icon: "wifi",
          title: "Always-connected sprayers",
          body: "Link operators, managers, and Coastal PASS support on one centralized network.",
        },
        {
          icon: "cloud",
          title: "Remote support",
          body: "Full web-based capabilities and over-the-air updates for Raven displays and mobile devices.",
        },
        {
          icon: "satellite",
          title: "Fleet visibility",
          body: "Field Hub telemetry feeds Slingshot portals so dispatchers can monitor status and redeploy idle assets fast.",
        },
      ]),
    },
    {
      id: "raven-agsync",
      kind: "faq",
      eyebrow: "AgSync Dispatch Pro",
      title: "Workflow advantages",
      body: "Manage multiple people and equipment across locations with work orders, scheduling, monitoring, reporting, and mobile apps.",
      faqs: [
        {
          question: "Dispatch Pro features",
          answer:
            "Work order management, scheduling, live asset monitoring, reporting, analytics, and mobile apps.",
        },
        {
          question: "Dispatch Pro advantage",
          answer:
            "Track equipment status, sort orders via maps, drag-and-drop tasks, and sync work instantly to Viper 4+ or Field Ops.",
        },
        {
          question: "Connectivity support",
          answer:
            "Know when assets are idle, reassign quickly, and keep operations synced across locations.",
        },
      ],
    },
  ],
});
