import { type ReactElement } from "react";

import {
  ContactCTA,
  Hero,
  Section,
  SectionContent,
  SectionHeader,
  buildPageMetadata,
} from "../_components";
import { servicesBlueprint } from "@/lib/pageBlueprints";

export const metadata = buildPageMetadata(servicesBlueprint);

const heroSection = servicesBlueprint.sections.find(
  (section) => section.kind === "hero",
);
const contentSections = servicesBlueprint.sections.filter(
  (section) => section.kind !== "hero",
);

/**
 * Services landing page composed from the shared blueprint plus a targeted contact CTA.
 */
const ServicesPage = (): ReactElement => (
  <>
    {heroSection?.kind === "hero" ? <Hero section={heroSection} /> : null}
    {contentSections.map((section) => (
      <Section key={section.id} id={section.id} background={section.background}>
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          body={section.body}
        />
        <SectionContent section={section} />
      </Section>
    ))}
    <ContactCTA context="services" title="Need help scoping the right mix?" />
  </>
);

export default ServicesPage;
