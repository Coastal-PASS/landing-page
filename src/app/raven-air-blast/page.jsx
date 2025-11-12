import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AgSyncSection from "@/components/raven/AgSyncSection";
import ClosingSection from "@/components/raven/ClosingSection";
import ContactStrip from "@/components/raven/ContactStrip";
import HeroSection from "@/components/raven/HeroSection";
import SystemsSection from "@/components/raven/SystemsSection";
import {
  agsyncContent,
  closingContent,
  contactStrip,
  heroContent,
  tractorOptions,
  brochureLogos,
  connectivityContent,
} from "@/scripts/ravenBrochure";

export const metadata = {
  title: "Raven Air Blast Sprayer Retrofit | Coastal PASS",
  description:
    "Bring Raven precision to orchard and vineyard sprayers with CR7, Viper 4+, Field Hub 2.1, and Coastal PASS integration.",
};

const RavenAirBlastPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection hero={heroContent} logos={brochureLogos} />
      <SystemsSection
        implementNote={heroContent.implementNote}
        options={tractorOptions}
        connectivity={connectivityContent}
      />
      <AgSyncSection content={agsyncContent} />
      <ClosingSection closing={closingContent} />
      {/* <ContactStrip contact={contactStrip} /> */}
      <Footer />
    </>
  );
};

export default RavenAirBlastPage;
