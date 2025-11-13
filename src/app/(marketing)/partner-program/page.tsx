import { type ReactElement } from "react";

import {
  ContactCTA,
  Hero,
  Section,
  SectionContent,
  SectionHeader,
  buildPageMetadata,
} from "../_components";
import { partnerProgramBlueprint } from "@/lib/pageBlueprints";

export const metadata = buildPageMetadata(partnerProgramBlueprint);

const heroSection = partnerProgramBlueprint.sections.find(
  (section) => section.kind === "hero",
);
const contentSections = partnerProgramBlueprint.sections.filter(
  (section) => section.kind !== "hero",
);

/**
 * Dealership partner program page that assembles the partner blueprint
 * and highlights the CTA for prospective partners.
 */
const PartnerProgramPage = (): ReactElement => (
  <>
    {heroSection?.kind === "hero" ? <Hero section={heroSection} /> : null}
    {contentSections.map((section) => (
      <Section key={section.id} id={section.id} background={section.background}>
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          body={section.body}
          copy={section.copy}
        />
        <SectionContent section={section} />
      </Section>
    ))}
    <ContactCTA context="partner" title="Become a Coastal PASS partner" />
  </>
);

export default PartnerProgramPage;
