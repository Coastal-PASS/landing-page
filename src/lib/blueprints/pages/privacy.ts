import { buildAction, buildHeroSection, pageBlueprintSchema } from "../schema";

export const privacyBlueprint = pageBlueprintSchema.parse({
  slug: "privacy",
  title: "Privacy Policy",
  description:
    "Learn how Coastal PASS collects, uses, and protects information across applications and services.",
  sections: [
    buildHeroSection("privacy-hero", {
      eyebrow: "Privacy",
      title: "How we handle your data",
      body: "We collect only the information required to deliver applications and support, and we document how it is stored, shared, and retained.",
      media: "privacyHero",
      actions: [
        buildAction("Contact us about privacy", "/contact?context=privacy"),
      ],
      background: "wash",
    }),
    {
      id: "privacy-toc",
      kind: "detail-nav",
      eyebrow: "Table of contents",
      title: "Jump to a section",
      body: "Data we collect, how we use it, sharing, cookies, your choices, and contact info.",
      links: [
        buildAction("Data we collect", "#data-we-collect", "ghost"),
        buildAction("How we use data", "#how-we-use-data", "ghost"),
        buildAction("Sharing & security", "#sharing-security", "ghost"),
        buildAction("Cookies & tracking", "#cookies", "ghost"),
        buildAction("Your choices", "#your-choices", "ghost"),
        buildAction("Contact", "#privacy-contact", "ghost"),
      ],
    },
    {
      id: "privacy-cta",
      kind: "cta",
      eyebrow: "Need details?",
      title: "Request the full policy",
      body: "Email appdev@coastalpass.services for PDF versions, historical revisions, or data-subject requests.",
      actions: [
        buildAction("Email our team", "mailto:appdev@coastalpass.services"),
      ],
    },
  ],
});
