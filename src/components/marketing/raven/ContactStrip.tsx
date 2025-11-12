import Link from "next/link";
import { type ReactElement } from "react";

import type { RavenBrochure } from "@/scripts/ravenBrochure";

interface ContactStripProps {
  readonly contact?: RavenBrochure["contactStrip"];
}

/**
 * Gradient contact strip for the Raven brochure page.
 */
export const ContactStrip = ({
  contact,
}: ContactStripProps): ReactElement | null => {
  if (!contact) {
    return null;
  }

  const links = [contact.website, contact.instagram, contact.phone];

  return (
    <div className="bg-gradient-to-r from-brand-heading via-brand-primary to-brand-accent py-6 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 text-sm font-semibold uppercase tracking-wide">
        <span>{contact.text}</span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-white transition hover:text-surface-muted"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
