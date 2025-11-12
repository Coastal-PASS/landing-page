import type { Metadata } from "next";
import { type ReactElement } from "react";

import {
  Footer,
  HeroBanner,
  Navbar,
  ServiceArea,
  WhyChoose,
} from "@/components/marketing";

export const metadata: Metadata = {
  title: "Coastal PASS | Precision Agriculture Solutions",
  description:
    "Coastal PASS delivers precision ag equipment, connectivity, and service workflows for orchards and specialty crops.",
};

const HomePage = (): ReactElement => (
  <>
    <Navbar />
    <main>
      <HeroBanner />
      <ServiceArea />
      <WhyChoose />
    </main>
    <Footer />
  </>
);

export default HomePage;
