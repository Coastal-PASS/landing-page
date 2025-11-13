import { type ReactElement } from "react";

import {
  RavenAgSyncSection,
  RavenClosingSection,
  RavenContactStrip,
  RavenHeroSection,
  RavenSystemsSection,
} from "@/components/marketing";
import {
  agsyncContent,
  closingContent,
  contactStrip,
  connectivityContent,
  heroContent,
  brochureLogos,
  tractorOptions,
} from "@/scripts/ravenBrochure";
import { ContactCTA, buildPageMetadata } from "../_components";
import { ravenBlueprint } from "@/lib/pageBlueprints";

export const metadata = buildPageMetadata(ravenBlueprint);

/**
 * Raven brochure experience composed of legacy brochure sections plus the shared CTA.
 */
const RavenAirBlastPage = (): ReactElement => (
  <main>
    <RavenHeroSection hero={heroContent} logos={brochureLogos} />
    <RavenSystemsSection
      implementNote={heroContent.implementNote}
      options={tractorOptions}
      connectivity={connectivityContent}
    />
    <RavenAgSyncSection content={agsyncContent} />
    <RavenClosingSection closing={closingContent} />
    <RavenContactStrip contact={contactStrip} />
    <ContactCTA context="raven" title="Talk with Raven specialists" />
  </main>
);

export default RavenAirBlastPage;
