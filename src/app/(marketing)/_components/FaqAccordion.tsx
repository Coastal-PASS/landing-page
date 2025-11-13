import { type ReactElement } from "react";

import type { Section } from "@/lib/pageBlueprints";

interface FaqAccordionProps {
  readonly items: Extract<Section, { kind: "faq" }>["faqs"];
}

/**
 * Accessible accordion using native details/summary elements.
 */
export const FaqAccordion = ({ items }: FaqAccordionProps): ReactElement => (
  <div className="mt-10 space-y-4">
    {items.map((faq) => (
      <details
        key={faq.question}
        className="rounded-2xl border border-brand-heading/10 bg-white p-4"
      >
        <summary className="cursor-pointer text-lg font-semibold text-brand-heading">
          {faq.question}
        </summary>
        <p className="mt-3 text-brand-body">{faq.answer}</p>
      </details>
    ))}
  </div>
);
