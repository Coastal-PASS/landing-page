import {
  buildAction,
  buildCards,
  buildHeroSection,
  pageBlueprintSchema,
} from "../schema";

export const aboutBlueprint = pageBlueprintSchema.parse({
  slug: "about",
  title: "About Coastal PASS",
  description:
    "A legacy rooted in farming with locations in Salinas, King City, and Paso Robles — now powering precision ag services.",
  sections: [
    buildHeroSection("about-hero", {
      eyebrow: "About Coastal PASS",
      title: "A legacy rooted in farming",
      body: "Coastal PASS is the high-tech division of Coastal Tractor. We pair 50+ years of agricultural know-how with modern precision technology.",
      media: "aboutHero",
      actions: [buildAction("Visit our locations", "/contact?context=about")],
      background: "gradient",
    }),
    {
      id: "origin-story",
      kind: "timeline",
      eyebrow: "Origin story",
      title: "From a family dealership to a precision ag team",
      body: "We have stayed family-owned across three generations, earning a reputation for fairness and integrity.",
      steps: [
        {
          label: "1971",
          description:
            "Coastal Tractor opens its doors in Salinas to serve specialty growers.",
        },
        {
          label: "1990s",
          description:
            "Expanded to King City and Paso Robles while building precision install expertise.",
        },
        {
          label: "Today",
          description:
            "Coastal PASS brings GNSS planning, telematics, and multi-brand support to every engagement.",
        },
      ],
    },
    {
      id: "why-we-exist",
      kind: "grid",
      eyebrow: "Why we exist",
      title: "Trusted expertise, partnerships, and local presence",
      body: "We match growers with the best equipment, service what we sell, and extend that care to precision technology.",
      cards: buildCards([
        {
          icon: "shield",
          title: "Trusted expertise",
          body: "Fleet telematics, water management, seeding, and application control tuned to your acres.",
        },
        {
          icon: "network",
          title: "Industry-leading partners",
          body: "Raven, PTx Trimble, Ecorobotix, CNH — we integrate award-winning hardware with robust software.",
        },
        {
          icon: "map",
          title: "Local presence",
          body: "Salinas, King City, and Paso Robles teams provide in-person support with global standards.",
        },
      ]),
      background: "wash",
    },
    {
      id: "gnss-planning",
      kind: "beta-highlight",
      eyebrow: "Looking ahead",
      title: "GNSS Planning",
      body: "Soon-to-launch platform for satellite visibility, interference risk, and dilution-of-precision forecasting.",
      status: { label: "In development", tone: "warning" },
      copy: [
        "Save field boundaries, set alerts, and sync positioning data with Raven or PTx Trimble displays.",
        "Built on resilient backend services with provider fail-over and interference analytics.",
      ],
      actions: [buildAction("Get notified", "/contact?context=gnss-planning")],
    },
    {
      id: "stats",
      kind: "stats",
      eyebrow: "Commitment to service",
      title: "Numbers that back the promise",
      body: "Our family has supported Central Coast agriculture for over half a century.",
      stats: [
        {
          label: "Years in business",
          value: ">50",
          helper: "Family-owned since 1971",
        },
        {
          label: "Locations",
          value: "3",
          helper: "Salinas • King City • Paso Robles",
        },
        {
          label: "Response time",
          value: "< 1 day",
          helper: "Average for field calls",
        },
      ],
      background: "wash",
    },
    {
      id: "visit-us",
      kind: "grid",
      eyebrow: "Visit us",
      title: "Central Coast locations",
      body: "Stop by, call 831-612-PASS (7277), or email hello@coastalpass.services.",
      cards: buildCards([
        {
          icon: "pin",
          title: "Salinas",
          body: "10 Harris Pl, Salinas, CA 93901",
          cta: {
            label: "Get directions",
            href: "https://maps.apple.com/?q=10+Harris+Pl+Salinas+CA",
          },
        },
        {
          icon: "pin",
          title: "King City",
          body: "110 E. San Antonio Dr., King City, CA 93930",
          cta: {
            label: "Get directions",
            href: "https://maps.apple.com/?q=110+E+San+Antonio+Dr+King+City+CA",
          },
        },
        {
          icon: "pin",
          title: "Paso Robles",
          body: "2348 Golden Hill Rd., Paso Robles, CA 93446",
          cta: {
            label: "Get directions",
            href: "https://maps.apple.com/?q=2348+Golden+Hill+Rd+Paso+Robles+CA",
          },
        },
      ]),
    },
  ],
});
