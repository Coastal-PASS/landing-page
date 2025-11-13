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
  productBlueprintBySlug,
  productSummaries,
  type ProductSlug,
} from "@/lib/pageBlueprints";

interface ProductRouteParams {
  readonly product: ProductSlug;
}

interface ProductPageProps {
  readonly params: Promise<ProductRouteParams>;
}

export const generateStaticParams = (): Array<{ product: ProductSlug }> =>
  productSummaries.map((product) => ({ product: product.slug as ProductSlug }));

export const dynamicParams = false;

export const generateMetadata = async ({
  params,
}: ProductPageProps): Promise<Metadata> => {
  const resolvedParams = await params;
  return buildPageMetadata(productBlueprintBySlug[resolvedParams.product]);
};

/**
 * Product detail route that hydrates the selected product blueprint and renders
 * a contextual CTA scoped to the product slug.
 */
const ProductDetailPage = ({ params }: ProductPageProps): ReactElement => {
  const resolvedParams = use(params);
  const blueprint = productBlueprintBySlug[resolvedParams.product];

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
        context={`products-${resolvedParams.product}`}
        title={`Talk with us about ${blueprint.title}`}
      />
    </>
  );
};

export default ProductDetailPage;
