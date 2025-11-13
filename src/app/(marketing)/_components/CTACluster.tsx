import { type ReactElement } from "react";

import { ActionButton } from "./action-helpers";
import type { Section } from "@/lib/pageBlueprints";

interface CTAClusterProps {
  readonly actions: Extract<Section, { kind: "cta" }>["actions"];
  readonly copy?: ReadonlyArray<string> | undefined;
}

/**
 * Renders CTA body copy plus up to two actions.
 */
export const CTACluster = ({
  actions,
  copy,
}: CTAClusterProps): ReactElement => (
  <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
    <div className="space-y-3 text-brand-body">
      {copy?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
    <div className="flex flex-wrap gap-4">
      {actions.map((action, index) => (
        <ActionButton
          key={`${action.href}-${action.label}-${index}`}
          action={action}
        />
      ))}
    </div>
  </div>
);
