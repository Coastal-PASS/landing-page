import { type ReactElement } from "react";

import { ActionButton } from "./action-helpers";
import type { Section } from "@/lib/pageBlueprints";

interface BetaProgramsProps {
  readonly programs: Extract<Section, { kind: "beta-programs" }>["programs"];
}

/**
 * Two-column beta program layout that keeps each cohort distinct while sharing a section.
 */
export const BetaPrograms = ({ programs }: BetaProgramsProps): ReactElement => (
  <div className="grid gap-6 md:grid-cols-2">
    {programs.map((program) => (
      <div
        key={program.name}
        className="flex h-full flex-col gap-4 rounded-3xl border border-brand-heading/10 bg-white p-6 shadow-card"
      >
        {program.status ? (
          <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
            {program.status.label}
          </span>
        ) : null}
        <div>
          <h3 className="text-2xl font-semibold text-brand-heading">
            {program.name}
          </h3>
          <p className="mt-2 text-brand-body">{program.description}</p>
        </div>
        <ul className="flex-1 list-disc space-y-2 pl-5 text-sm text-brand-body">
          {program.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <ActionButton action={program.action} />
      </div>
    ))}
  </div>
);
