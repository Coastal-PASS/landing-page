import {
  buildAction,
  buildCards,
  buildDetailNavLinks,
  buildHeroSection,
  pageBlueprintSchema,
} from "../schema";
import { serviceSummaries, servicesDetailNav } from "../services";

export const servicesBlueprint = pageBlueprintSchema.parse({
  slug: "services",
  title: "Services | Coastal PASS",
  description:
    "Fleet telematics, water management, seeding, application control, sprayer retrofits, and agtech consulting for specialty growers.",
  sections: [
    buildHeroSection("services-hero", {
      eyebrow: "Services",
      title: "Comprehensive solutions for modern agriculture",
      body: "Each engagement blends field techs, modern hardware, and data workflows so your fleet stays connected and productive.",
      media: "servicesHero",
      actions: [
        buildAction("Book a consultation", "/contact?context=services"),
        buildAction("Talk with support", "tel:+18316127277", "secondary"),
      ],
      background: "gradient",
    }),
    {
      id: "services-grid",
      kind: "grid",
      eyebrow: "Service pillars",
      title: "Start with the outcome you need",
      body: "Pick the service that aligns with your challenge. Each links to a playbook with deliverables and CTAs.",
      cards: buildCards(
        serviceSummaries.map((service) => ({
          title: service.title,
          body: service.description,
          cta: { label: "View details", href: service.ctaHref },
        })),
      ),
      detailNav: buildDetailNavLinks(servicesDetailNav),
    },
    {
      id: "process",
      kind: "process",
      eyebrow: "Our process",
      title: "Field-proven, fail-fast",
      body: "We validate inputs early, throw errors immediately, and keep you informed across every install.",
      steps: [
        {
          title: "Assess",
          description:
            "Walk the ranch, audit hardware, and capture goals so we prescribe the right mix.",
          helper: "Remote or in-person",
        },
        {
          title: "Integrate",
          description:
            "Install, retrofit, and configure with test passes before hand-off.",
          helper: "Includes operator coaching",
        },
        {
          title: "Support",
          description:
            "Monitor, troubleshoot, and iterate with seasonal service plans.",
          helper: "Less downtime, more uptime",
        },
      ],
      background: "wash",
    },
    {
      id: "services-cta",
      kind: "cta",
      eyebrow: "Need guidance?",
      title: "Not sure where to start?",
      body: "Book a consultation and we will scope the right mix of hardware, software, and service for your fleet.",
      actions: [
        buildAction("Book a consultation", "/contact?context=services"),
      ],
    },
  ],
});
