import {
  buildAction,
  buildCards,
  buildHeroSection,
  pageBlueprintSchema,
} from "../schema";

export const contactBlueprint = pageBlueprintSchema.parse({
  slug: "contact",
  title: "Contact Coastal PASS",
  description:
    "Reach the Coastal PASS team for installs, support, and consultations. Call 831-612-PASS or email hello@coastalpass.services.",
  sections: [
    buildHeroSection("contact-hero", {
      eyebrow: "Let’s talk",
      title: "Tell us about your fleet or project",
      body: "Whether you need a single upgrade or multi-location deployment, our precision specialists can help scope, install, and support the right solution.",
      media: "contactHero",
      actions: [
        buildAction("Send a message", "/contact"),
        buildAction("Call 831-612-PASS", "tel:+18316127277", "secondary"),
      ],
      background: "gradient",
    }),
    {
      id: "contact-methods",
      kind: "grid",
      eyebrow: "Quick contact",
      title: "Reach us directly",
      body: "Call, email, or visit — whatever gets you answers fastest.",
      cards: buildCards([
        {
          icon: "phone",
          title: "Call us",
          body: "831-612-PASS (7277)",
          cta: { label: "Dial now", href: "tel:+18316127277" },
        },
        {
          icon: "mail",
          title: "Email us",
          body: "hello@coastalpass.services",
          cta: {
            label: "Compose email",
            href: "mailto:hello@coastalpass.services",
          },
        },
        {
          icon: "pin",
          title: "Visit Salinas HQ",
          body: "10 Harris Pl, Salinas, CA 93901",
          cta: {
            label: "Open Maps",
            href: "https://maps.apple.com/?q=10+Harris+Pl+Salinas+CA",
          },
        },
      ]),
    },
    {
      id: "faq",
      kind: "faq",
      eyebrow: "FAQ",
      title: "What to expect",
      body: "Response times, service areas, and emergency support answered up front.",
      faqs: [
        {
          question: "How fast do you reply?",
          answer:
            "We respond to form submissions within one business day — sooner during critical windows.",
        },
        {
          question: "Do you travel outside the Central Coast?",
          answer:
            "Yes. We primarily serve Monterey, San Luis Obispo, and Santa Barbara counties, with select projects statewide.",
        },
        {
          question: "Is emergency support available?",
          answer:
            "Call 831-612-PASS and mark the request urgent — we prioritize seasonal downtime.",
        },
      ],
      background: "wash",
    },
  ],
});
