import type { ReactElement, ReactNode } from "react";

import { Footer, Navbar } from "@/components/marketing";

interface MarketingLayoutProps {
  readonly children: ReactNode;
}

/**
 * Shared layout for all marketing routes ensuring Navbar/Footer consistency.
 */
const MarketingLayout = ({ children }: MarketingLayoutProps): ReactElement => (
  <div className="min-h-screen bg-white text-brand-heading">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

export default MarketingLayout;
