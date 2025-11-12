import Image from "next/image";
import { type ReactElement } from "react";

import type { RavenBrochure } from "@/scripts/ravenBrochure";

interface AgSyncSectionProps {
  readonly content?: RavenBrochure["agsyncContent"];
}

/**
 * Highlights the AgSync Dispatch Pro platform and its advantages.
 */
export const AgSyncSection = ({
  content,
}: AgSyncSectionProps): ReactElement | null => {
  if (!content) {
    return null;
  }

  return (
    <section className="py-25">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="rounded-3xl border border-surface-muted/80 bg-white p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
              {content.platformTitle}
            </p>
            <p className="mt-2 text-brand-body">{content.platformIntro}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-brand-heading">
              {content.platformBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-surface-muted/80 bg-white p-6 shadow-card">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
                {content.advantageTitle}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-brand-heading">
                {content.advantageBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span
                      className="mt-1 h-2 w-2 rounded-full bg-brand-primary"
                      aria-hidden
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-3xl border border-surface-muted/80 bg-surface-muted/40 shadow-card">
              <Image
                src={content.screenshot}
                alt="AgSync Dispatch Pro screenshot"
                width={720}
                height={420}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
