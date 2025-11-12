import Image from "next/image";
import { type ReactElement } from "react";

import type { RavenBrochure } from "@/scripts/ravenBrochure";

interface ClosingSectionProps {
  readonly closing?: RavenBrochure["closingContent"];
}

/**
 * Closing CTA encouraging customers to contact local reps.
 */
export const ClosingSection = ({
  closing,
}: ClosingSectionProps): ReactElement | null => {
  if (!closing) {
    return null;
  }

  return (
    <section className="bg-surface-muted py-25">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
        <Image
          src={closing.orchardImage}
          alt="Aerial orchard view"
          width={720}
          height={480}
          className="rounded-3xl border border-white/60 shadow-card"
        />
        <div className="space-y-4 text-brand-body">
          {closing.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};
