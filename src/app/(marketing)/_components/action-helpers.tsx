import Link from "next/link";
import { type ReactElement } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import type { SectionAction } from "@/lib/pageBlueprints";

const buttonVariantMap: Record<
  SectionAction["variant"],
  ButtonProps["variant"]
> = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
};

/**
 * Renders a CTA button based on a blueprint action definition.
 */
export const ActionButton = ({
  action,
  size = "lg",
}: {
  readonly action: SectionAction;
  readonly size?: ButtonProps["size"];
}): ReactElement => (
  <Button asChild variant={buttonVariantMap[action.variant]} size={size}>
    <Link href={action.href}>{action.label}</Link>
  </Button>
);
