import { type ReactElement, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  readonly id: string;
  readonly background?: "white" | "wash" | "gradient" | undefined;
  readonly children: ReactNode;
}

const sectionBackground = {
  white: "bg-white",
  wash: "bg-surface-muted",
  gradient:
    "bg-gradient-to-br from-brand-primary/5 via-brand-wash to-brand-highlight/20",
} as const;

/**
 * Wrapper that applies consistent spacing, max-width, and alternating backgrounds.
 */
export const Section = ({
  id,
  background = "white",
  children,
}: SectionProps): ReactElement => (
  <section
    id={id}
    className={cn(sectionBackground[background] ?? sectionBackground.white)}
  >
    <div className="mx-auto max-w-6xl px-4 py-20 lg:py-28">{children}</div>
  </section>
);
