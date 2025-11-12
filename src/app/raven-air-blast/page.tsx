import type { Metadata } from 'next';
import { type ReactElement } from 'react';

import {
  Footer,
  Navbar,
  RavenAgSyncSection,
  RavenClosingSection,
  RavenContactStrip,
  RavenHeroSection,
  RavenSystemsSection,
} from '@/components/marketing';
import {
  agsyncContent,
  closingContent,
  contactStrip,
  connectivityContent,
  heroContent,
  brochureLogos,
  tractorOptions,
} from '@/scripts/ravenBrochure';

export const metadata: Metadata = {
  title: 'Raven Air Blast Sprayer Application Kit',
  description: 'Discover how Raven technology boosts coverage and saves inputs for specialty crop sprayers.',
};

const RavenAirBlastPage = (): ReactElement => (
  <>
    <Navbar />
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
    </main>
    <Footer />
  </>
);

export default RavenAirBlastPage;
