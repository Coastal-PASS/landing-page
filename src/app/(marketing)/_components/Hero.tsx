import Image from "next/image";
import { type ReactElement } from "react";

import { ActionButton } from "./action-helpers";
import type { Section } from "@/lib/pageBlueprints";

interface HeroProps {
  readonly section: Extract<Section, { kind: "hero" }>;
}

/**
 * Two-column hero with background media and CTA buttons.
 */
export const Hero = ({ section }: HeroProps): ReactElement => (
  <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-heading via-brand-primary/80 to-brand-highlight/40 text-white">
    <Image
      src={section.media.src}
      alt={section.media.alt}
      fill
      sizes="100vw"
      className="object-cover opacity-20"
      priority
    />
    <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-6">
        {section.eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-highlight">
            {section.eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
          {section.title}
        </h1>
        <p className="text-lg text-white/80">{section.body}</p>
        <div className="flex flex-wrap gap-4">
          {section.actions.map((action, index) => (
            <ActionButton
              key={`${action.href}-${action.label}-${index}`}
              action={action}
            />
          ))}
        </div>
      </div>
      <div className="flex-1">
        <div className="relative rounded-3xl bg-white/10 p-1 shadow-card backdrop-blur">
          <Image
            src={section.media.src}
            alt={section.media.alt}
            width={section.media.width}
            height={section.media.height}
            className="rounded-[1.5rem]"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);
