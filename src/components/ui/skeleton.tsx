import type { HTMLAttributes, ReactElement } from "react";

import { cn } from "@/lib/utils";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({
  className,
  ...props
}: SkeletonProps): ReactElement => (
  <div
    className={cn("animate-pulse rounded-md bg-primary/10", className)}
    {...props}
  />
);
