import Link from "next/link";
import { type ReactElement } from "react";

import type { SectionAction } from "@/lib/pageBlueprints";

interface DetailNavProps {
  readonly links: ReadonlyArray<SectionAction>;
  readonly helperText?: string;
}

/**
 * Chip links used for quick navigation between service/product detail pages.
 */
export const DetailNav = ({
  links,
  helperText,
}: DetailNavProps): ReactElement => (
  <div className="mt-8">
    {helperText ? (
      <p className="mb-4 text-sm text-brand-body">{helperText}</p>
    ) : null}
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <Link
          key={`${link.href}-${link.label}`}
          href={link.href}
          className="inline-flex items-center rounded-full border border-brand-heading/15 bg-white px-4 py-2 text-sm font-semibold text-brand-heading transition hover:border-brand-heading/50 hover:text-brand-primary"
        >
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);
