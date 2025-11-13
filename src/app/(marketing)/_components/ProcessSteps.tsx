import { type ReactElement } from "react";

import type { Section } from "@/lib/pageBlueprints";

interface ProcessStepsProps {
  readonly steps: Extract<Section, { kind: "process" }>["steps"];
}

/**
 * Stepper component for services landing page.
 */
export const ProcessSteps = ({ steps }: ProcessStepsProps): ReactElement => (
  <div className="mt-12 grid gap-6 md:grid-cols-3">
    {steps.map((step, index) => (
      <div
        key={step.title}
        className="rounded-3xl border border-white/60 bg-white p-6 shadow-card"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-neutral">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-2 text-xl font-semibold text-brand-heading">
          {step.title}
        </h3>
        <p className="mt-2 text-brand-body">{step.description}</p>
        {step.helper ? (
          <p className="mt-2 text-sm text-brand-neutral">{step.helper}</p>
        ) : null}
      </div>
    ))}
  </div>
);
