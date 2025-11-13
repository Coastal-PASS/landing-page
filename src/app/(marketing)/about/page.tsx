import { type ReactElement } from "react";

import {
  ContactCTA,
  Hero,
  Section,
  SectionContent,
  SectionHeader,
  buildPageMetadata,
} from "../_components";
import { aboutBlueprint } from "@/lib/pageBlueprints";

export const metadata = buildPageMetadata(aboutBlueprint);

const heroSection = aboutBlueprint.sections.find(
  (section) => section.kind === "hero",
);
const contentSections = aboutBlueprint.sections.filter(
  (section) => section.kind !== "hero",
);

/**
 * About page presenting blueprint-defined history sections and a tailored contact CTA.
 */
const AboutPage = (): ReactElement => (
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
    <ContactCTA context="about" title="Visit the Coastal PASS team" />
  </>
);

export default AboutPage;
