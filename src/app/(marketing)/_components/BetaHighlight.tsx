import { type ReactElement } from "react";

import { ActionButton } from "./action-helpers";
import type { Section } from "@/lib/pageBlueprints";

interface BetaHighlightProps {
  readonly section: Extract<Section, { kind: "beta-highlight" }>;
}

const badgeTone = {
  default: "bg-brand-heading text-white",
  warning: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-700",
} as const;

/**
 * Highlights beta programs with status pills and CTA buttons.
 */
export const BetaHighlight = ({
  section,
}: BetaHighlightProps): ReactElement => (
  <div className="rounded-3xl border border-brand-heading/10 bg-white p-8 shadow-card">
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${badgeTone[section.status.tone]}`}
    >
      {section.status.label}
    </span>
    <h3 className="mt-4 text-2xl font-semibold text-brand-heading">
      {section.title}
    </h3>
    <p className="mt-3 text-brand-body">{section.body}</p>
    {section.copy?.length ? (
      <ul className="mt-4 list-disc space-y-2 pl-5 text-brand-body">
        {section.copy.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : null}
    <div className="mt-6 flex flex-wrap gap-4">
      {section.actions.map((action, index) => (
        <ActionButton
          key={`${action.href}-${action.label}-${index}`}
          action={action}
        />
      ))}
    </div>
  </div>
);
