import { type ReactElement } from "react";

import {
  ContactCTA,
  Hero,
  Section,
  SectionContent,
  SectionHeader,
  buildPageMetadata,
} from "../_components";
import { contactBlueprint } from "@/lib/pageBlueprints";

export const metadata = buildPageMetadata(contactBlueprint);

const heroSection = contactBlueprint.sections.find(
  (section) => section.kind === "hero",
);
const contentSections = contactBlueprint.sections.filter(
  (section) => section.kind !== "hero",
);

/**
 * Contact page rendering the blueprint sections and embedded ContactCTA for lead capture.
 */
const ContactPage = (): ReactElement => (
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
    <ContactCTA context="contact" title="Tell us about your fleet or project" />
  </>
);

export default ContactPage;
