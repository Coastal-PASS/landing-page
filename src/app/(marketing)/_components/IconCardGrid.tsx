import Link from "next/link";
import { type ComponentType, type ReactElement } from "react";
import {
  BarChart3,
  Building2,
  Circle,
  Clock3,
  Cloud,
  Gauge,
  Mail,
  Map,
  MapPin,
  MonitorSmartphone,
  Network,
  Phone,
  SatelliteDish,
  ShieldCheck,
  Sprout,
  Users2,
  Wifi,
  Wrench,
} from "lucide-react";

import type { Section } from "@/lib/pageBlueprints";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

const iconMap: Record<string, IconComponent> = {
  sprout: Sprout,
  building: Building2,
  satellite: SatelliteDish,
  shield: ShieldCheck,
  network: Network,
  map: Map,
  pin: MapPin,
  monitor: MonitorSmartphone,
  display: MonitorSmartphone,
  wifi: Wifi,
  cloud: Cloud,
  clock: Clock3,
  gauge: Gauge,
  users: Users2,
  tools: Wrench,
  chart: BarChart3,
  phone: Phone,
  mail: Mail,
};

const getIcon = (icon?: string): IconComponent => iconMap[icon ?? ""] ?? Circle;

interface IconCardGridProps {
  readonly cards: Extract<Section, { kind: "grid" }>["cards"];
}

/**
 * Grid used for service, audience, and capability cards.
 */
export const IconCardGrid = ({ cards }: IconCardGridProps): ReactElement => (
  <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {cards.map((card) => {
      const CardIcon = getIcon(card.icon);
      return (
        <div
          key={card.title}
          className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-wash text-brand-primary">
              <CardIcon className="h-6 w-6" aria-hidden />
            </div>
            <h3 className="text-xl font-semibold text-brand-heading">
              {card.title}
            </h3>
          </div>
          <p className="mt-4 text-brand-body">{card.body}</p>
          {card.cta ? (
            <Link
              href={card.cta.href}
              className="mt-4 inline-flex items-center text-sm font-semibold text-brand-primary transition hover:text-brand-highlight"
            >
              {card.cta.label}
              <span aria-hidden className="ml-2">
                &rarr;
              </span>
            </Link>
          ) : null}
        </div>
      );
    })}
  </div>
);
