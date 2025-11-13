import Image from "next/image";
import { type ReactElement } from "react";

import type { Section } from "@/lib/pageBlueprints";

interface TimelineProps {
  readonly section: Extract<Section, { kind: "timeline" }>;
}

/**
 * Numbered timeline used across Why Choose and About sections.
 */
export const Timeline = ({ section }: TimelineProps): ReactElement => (
  <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
    <ol className="space-y-8 border-l border-brand-heading/10 pl-8">
      {section.steps.map((step) => (
        <li key={step.label} className="relative">
          <span className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
            {step.label.split(" ")[0]}
          </span>
          <p className="text-xl font-semibold text-brand-heading">
            {step.label}
          </p>
          <p className="mt-2 text-brand-body">{step.description}</p>
        </li>
      ))}
    </ol>
    {section.media ? (
      <div className="relative rounded-3xl border border-white/60 bg-white/10 p-4 shadow-card backdrop-blur lg:-mt-14">
        <Image
          src={section.media.src}
          alt={section.media.alt}
          width={section.media.width}
          height={section.media.height}
          className="rounded-2xl object-cover"
        />
      </div>
    ) : null}
  </div>
);
