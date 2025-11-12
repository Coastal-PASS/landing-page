import Image from "next/image";
import Link from "next/link";
import { type ComponentType, type ReactElement } from "react";
import { FaTractor, FaWater } from "react-icons/fa";
import { GiField, GiPlantWatering } from "react-icons/gi";
import { PiFarm } from "react-icons/pi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceItem {
  readonly title: string;
  readonly description: string;
  readonly Icon: ComponentType<{ className?: string }>;
}

const services: ServiceItem[] = [
  {
    title: "Fleet Telematics",
    description:
      "OEM and add-on solutions that monitor equipment location, engine hours, and diagnostics across mixed fleets.",
    Icon: FaTractor,
  },
  {
    title: "Water Management",
    description:
      "Advanced field leveling and surveying ensures every row is prepared for efficient irrigation and runoff control.",
    Icon: FaWater,
  },
  {
    title: "Seeding Solutions",
    description:
      "Turn-key rate control and blockage monitoring prevent over- or under-seeding and protect yield potential.",
    Icon: GiPlantWatering,
  },
  {
    title: "Application Control",
    description:
      "Precision spraying hardware delivers accurate fertilizer and crop protection coverage on every pass.",
    Icon: GiPlantWatering,
  },
  {
    title: "AgTech Innovation",
    description:
      "Product consulting and integrations that pair proven OEM technology with custom software initiatives.",
    Icon: PiFarm,
  },
  {
    title: "AgSupport Platform",
    description:
      "A forthcoming SaaS suite that streamlines service scheduling and simplifies fleet/customer management.",
    Icon: GiField,
  },
];

const partnerLogos = [
  { src: "/assets/img/ct/nh-logo.png", alt: "New Holland" },
  { src: "/assets/img/ct/raven-logo.png", alt: "Raven" },
  { src: "/assets/img/ct/ptx-trimble-logo.png", alt: "PTX Trimble" },
];

/**
 * Highlights Coastal PASS service pillars with partner lockups.
 */
export const ServiceArea = (): ReactElement => (
  <section className="bg-surface-muted py-30">
    <div className="mx-auto max-w-6xl px-4">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
          Our Services
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-brand-heading">
          Comprehensive solutions for modern agriculture
        </h2>
        <p className="mt-4 text-brand-body">
          Every engagement pairs hands-on field expertise with the digital
          infrastructure your crew needs to stay connected and productive.
        </p>
      </header>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {services.map(({ title, description, Icon }) => (
          <Card
            key={title}
            className="relative overflow-hidden border border-white/60 shadow-card"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-primary bg-white">
                <Icon className="h-6 w-6 text-brand-primary" aria-hidden />
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-brand-body">
              <p>{description}</p>
              <ButtonLink />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
        {partnerLogos.map((logo) => (
          <div
            key={logo.alt}
            className="rounded-2xl border border-white/70 bg-white px-6 py-3 shadow-sm"
          >
            <Image src={logo.src} alt={logo.alt} width={180} height={60} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ButtonLink = (): ReactElement => (
  <Link
    href="/contact"
    className="inline-flex items-center text-sm font-semibold text-brand-primary transition hover:text-brand-highlight"
  >
    Talk with our team
    <span aria-hidden className="ml-1">
      &rarr;
    </span>
  </Link>
);
