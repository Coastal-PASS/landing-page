"use client";

import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ScrollToTop from "react-scroll-to-top";

import { getQueryClient } from "./query-client";

interface ClientProvidersProps {
  readonly children: ReactNode;
}

export const ClientProviders = ({
  children,
}: ClientProvidersProps): ReactElement => {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ScrollToTop smooth color="#0c2c94" />
        {process.env.NODE_ENV !== "production" ? (
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        ) : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
};
