import { type ReactElement } from "react";

import {
  ContactCTA,
  Section,
  SectionContent,
  SectionHeader,
  buildPageMetadata,
} from "./_components";
import { HeroBanner } from "@/components/marketing";
import { homeBlueprint } from "@/lib/pageBlueprints";

export const metadata = buildPageMetadata(homeBlueprint);

const contentSections = homeBlueprint.sections.filter(
  (section) => section.kind !== "hero",
);

/**
 * Marketing home page that renders the hero and all subsequent blueprint sections
 * followed by the shared contact CTA band.
 */
const HomePage = (): ReactElement => (
  <>
    <HeroBanner />
    {contentSections.map((section) => (
      <Section key={section.id} id={section.id} background={section.background}>
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          body={section.body}
          copy={section.copy}
          align={section.kind === "partner-logos" ? "center" : "left"}
        />
        <SectionContent section={section} />
      </Section>
    ))}
    <ContactCTA context="home" />
  </>
);

export default HomePage;
