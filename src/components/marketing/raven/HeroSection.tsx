import Image from "next/image";
import { type ReactElement } from "react";

import type { RavenBrochure } from "@/scripts/ravenBrochure";

interface HeroSectionProps {
  readonly hero?: RavenBrochure["heroContent"];
  readonly logos?: RavenBrochure["brochureLogos"];
}

/**
 * Raven brochure hero with copy, imagery, and partner lockups.
 */
export const HeroSection = ({
  hero,
  logos,
}: HeroSectionProps): ReactElement | null => {
  if (!hero) {
    return null;
  }

  const safeLogos = logos ?? [];

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-heading via-brand-primary to-brand-violet py-25 text-white">
      <div
        className="absolute inset-0 bg-[url('/assets/img/ct/hero.jpg')] bg-cover bg-center opacity-10"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-surface-muted">
            {hero.kicker}
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
            {hero.title}
          </h1>
          {hero.paragraphs.map((paragraph) => (
            <p className="text-base text-surface-muted" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="flex-1 space-y-6">
          <div className="rounded-3xl border border-white/30 bg-white/10 p-1 shadow-card backdrop-blur">
            <Image
              src={hero.image}
              alt="Raven Air Blast Sprayer"
              width={620}
              height={420}
              className="rounded-[1.6rem]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {safeLogos.map((logo) => (
              <div
                key={logo.alt}
                className="rounded-xl border border-white/20 bg-white/90 px-4 py-2"
              >
                <Image src={logo.src} alt={logo.alt} width={140} height={40} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
