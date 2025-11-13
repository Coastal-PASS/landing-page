import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";

import type { Section } from "@/lib/pageBlueprints";

interface PartnerLogosProps {
  readonly logos: Extract<Section, { kind: "partner-logos" }>["logos"];
}

/**
 * Logo row used on the home page to reinforce partnerships.
 */
export const PartnerLogos = ({ logos }: PartnerLogosProps): ReactElement => (
  <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
    {logos.map((logo) => {
      const image = (
        <Image
          src={logo.logo}
          alt={logo.alt}
          width={180}
          height={60}
          className="object-contain"
        />
      );
      return logo.href ? (
        <Link
          key={logo.alt}
          href={logo.href}
          aria-label={logo.name}
          className="rounded-2xl border border-white/70 bg-white/90 px-6 py-3 shadow-sm"
        >
          {image}
        </Link>
      ) : (
        <div
          key={logo.alt}
          className="rounded-2xl border border-white/70 bg-white/90 px-6 py-3 shadow-sm"
        >
          {image}
        </div>
      );
    })}
  </div>
);
