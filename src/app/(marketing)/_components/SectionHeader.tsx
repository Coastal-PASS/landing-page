import { type ReactElement } from "react";

interface SectionHeaderProps {
  readonly eyebrow?: string | undefined;
  readonly title: string;
  readonly body: string;
  readonly copy?: ReadonlyArray<string> | undefined;
  readonly align?: "left" | "center" | undefined;
}

/**
 * Shared heading block that keeps typography consistent across sections.
 */
export const SectionHeader = ({
  eyebrow,
  title,
  body,
  copy,
  align = "left",
}: SectionHeaderProps): ReactElement => (
  <div
    className={
      align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
    }
  >
    {eyebrow ? (
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-neutral">
        {eyebrow}
      </p>
    ) : null}
    <h2 className="mt-4 text-3xl font-semibold text-brand-heading lg:text-4xl">
      {title}
    </h2>
    <p className="mt-4 text-lg text-brand-body">{body}</p>
    {copy?.length ? (
      <div className="mt-4 space-y-3 text-brand-body">
        {copy.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    ) : null}
  </div>
);
