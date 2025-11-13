import { type ReactElement } from "react";

import type { Section } from "@/lib/pageBlueprints";

interface StatGroupProps {
  readonly stats: Extract<Section, { kind: "stats" }>["stats"];
}

/**
 * Displays stat chips used on About and product pages.
 */
export const StatGroup = ({ stats }: StatGroupProps): ReactElement => (
  <dl className="mt-12 grid gap-6 md:grid-cols-3">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className="rounded-3xl border border-white/80 bg-white p-6 text-center shadow-card"
      >
        <dt className="text-sm uppercase tracking-[0.3em] text-brand-neutral">
          {stat.label}
        </dt>
        <dd className="mt-3 text-4xl font-semibold text-brand-heading">
          {stat.value}
        </dd>
        {stat.helper ? (
          <p className="mt-2 text-sm text-brand-body">{stat.helper}</p>
        ) : null}
      </div>
    ))}
  </dl>
);
