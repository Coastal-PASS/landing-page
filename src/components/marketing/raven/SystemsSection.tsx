import Image from "next/image";
import { type ReactElement } from "react";

import type { RavenBrochure } from "@/scripts/ravenBrochure";

interface SystemsSectionProps {
  readonly implementNote?: RavenBrochure["heroContent"]["implementNote"];
  readonly options?: RavenBrochure["tractorOptions"];
  readonly connectivity?: RavenBrochure["connectivityContent"];
}

/**
 * Highlights implement base kit details plus tractor control options.
 */
export const SystemsSection = ({
  implementNote,
  options,
  connectivity,
}: SystemsSectionProps): ReactElement | null => {
  if (!implementNote && (!options?.length || !connectivity)) {
    return null;
  }

  return (
    <section className="bg-white py-25">
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="flex flex-col gap-6 rounded-3xl border border-surface-muted/80 bg-surface-muted/40 p-6 shadow-card lg:flex-row lg:items-center">
          <Image
            src="/assets/img/raven-brocure/rcm.png"
            alt="RCM Universal"
            width={220}
            height={160}
            className="mx-auto lg:mx-0"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              Implement Base Kit
            </p>
            <p className="mt-2 text-brand-body">{implementNote}</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
            Tractor control options
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-brand-heading">
            Choose the in-cab experience that fits your crew
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(options ?? []).map((option) => (
            <article
              key={option.title}
              className="h-full rounded-3xl border border-surface-muted/80 bg-white p-6 shadow-card"
            >
              <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl bg-surface-muted">
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-contain p-4"
                />
              </div>
              <h3 className="text-lg font-semibold text-brand-heading">
                {option.title}
              </h3>
              <p className="mt-2 text-sm text-brand-body">
                {option.description}
              </p>
            </article>
          ))}
        </div>

        {connectivity ? (
          <div className="flex flex-col gap-6 rounded-3xl border border-surface-muted/80 bg-white p-6 shadow-card lg:flex-row lg:items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-brand-heading">
                {connectivity.title}
              </h3>
              <p className="mt-2 text-brand-body">{connectivity.description}</p>
            </div>
            {connectivity.icon ? (
              <Image
                src={connectivity.icon}
                alt="Connectivity hardware"
                width={220}
                height={180}
                className="mx-auto lg:mx-0"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};
