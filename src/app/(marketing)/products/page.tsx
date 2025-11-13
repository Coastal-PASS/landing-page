import { type ReactElement } from "react";

import {
  ContactCTA,
  Hero,
  Section,
  SectionContent,
  SectionHeader,
  buildPageMetadata,
} from "../_components";
import { productsBlueprint } from "@/lib/pageBlueprints";

export const metadata = buildPageMetadata(productsBlueprint);

const heroSection = productsBlueprint.sections.find(
  (section) => section.kind === "hero",
);
const contentSections = productsBlueprint.sections.filter(
  (section) => section.kind !== "hero",
);

/**
 * Products landing page showcasing every product blueprint section and a follow-up CTA.
 */
const ProductsPage = (): ReactElement => (
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
    <ContactCTA
      context="products"
      title="Pair hardware with white-glove installs"
    />
  </>
);

export default ProductsPage;
