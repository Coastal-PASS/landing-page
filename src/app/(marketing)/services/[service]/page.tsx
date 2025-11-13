import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { type ReactElement, use } from "react";

import {
  ContactCTA,
  Hero,
  Section,
  SectionContent,
  SectionHeader,
  buildPageMetadata,
} from "../../_components";
import {
  serviceBlueprintBySlug,
  serviceSummaries,
  type ServiceSlug,
} from "@/lib/pageBlueprints";

interface ServiceRouteParams {
  readonly service: ServiceSlug;
}

interface ServicePageProps {
  readonly params: Promise<ServiceRouteParams>;
}

export const generateStaticParams = (): Array<{ service: ServiceSlug }> =>
  serviceSummaries.map((service) => ({ service: service.slug as ServiceSlug }));

export const dynamicParams = false;

export const generateMetadata = async ({
  params,
}: ServicePageProps): Promise<Metadata> => {
  const resolvedParams = await params;
  return buildPageMetadata(serviceBlueprintBySlug[resolvedParams.service]);
};

/**
 * Service detail page renders the blueprint-driven hero, supporting sections,
 * and a contextual contact CTA for the requested service slug.
 */
const ServiceDetailPage = ({ params }: ServicePageProps): ReactElement => {
  const resolvedParams = use(params);
  const blueprint = serviceBlueprintBySlug[resolvedParams.service];

  if (!blueprint) {
    return notFound();
  }

  const heroSection = blueprint.sections.find(
    (section) => section.kind === "hero",
  );
  const contentSections = blueprint.sections.filter(
    (section) => section.kind !== "hero",
  );
  return (
    <>
      {heroSection?.kind === "hero" ? <Hero section={heroSection} /> : null}
      {contentSections.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          background={section.background}
        >
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
        context={`services-${resolvedParams.service}`}
        title={`Talk with us about ${blueprint.title}`}
      />
    </>
  );
};

export default ServiceDetailPage;
