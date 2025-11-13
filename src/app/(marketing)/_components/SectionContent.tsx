import { type ReactElement } from "react";

import { BetaHighlight } from "./BetaHighlight";
import { BetaPrograms } from "./BetaPrograms";
import { CTACluster } from "./CTACluster";
import { DetailNav } from "./DetailNav";
import { FaqAccordion } from "./FaqAccordion";
import { Hero } from "./Hero";
import { IconCardGrid } from "./IconCardGrid";
import { PartnerLogos } from "./PartnerLogos";
import { ProcessSteps } from "./ProcessSteps";
import { StatGroup } from "./StatGroup";
import { Timeline } from "./Timeline";
import type { Section } from "@/lib/pageBlueprints";

interface SectionContentProps {
  readonly section: Section;
}

/**
 * Maps each blueprint section kind to its UI renderer.
 */
export const SectionContent = ({
  section,
}: SectionContentProps): ReactElement => {
  switch (section.kind) {
    case "hero":
      return <Hero section={section} />;
    case "grid":
      return (
        <>
          <IconCardGrid cards={section.cards} />
          {section.detailNav ? <DetailNav links={section.detailNav} /> : null}
          {"logos" in section && section.logos ? (
            <PartnerLogos logos={section.logos} />
          ) : null}
        </>
      );
    case "timeline":
      return <Timeline section={section} />;
    case "detail-nav":
      return <DetailNav links={section.links} helperText={section.body} />;
    case "cta":
      return <CTACluster actions={section.actions} copy={section.copy} />;
    case "stats":
      return <StatGroup stats={section.stats} />;
    case "faq":
      return <FaqAccordion items={section.faqs} />;
    case "process":
      return <ProcessSteps steps={section.steps} />;
    case "partner-logos":
      return <PartnerLogos logos={section.logos} />;
    case "beta-highlight":
      return <BetaHighlight section={section} />;
    case "beta-programs":
      return <BetaPrograms programs={section.programs} />;
    case "comparison":
      return (
        <div className="mt-10 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-brand-body">
            <thead className="text-xs uppercase tracking-wider text-brand-neutral">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Use case</th>
                <th className="px-4 py-2">Fleet fit</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-t border-brand-heading/10"
                >
                  <td className="px-4 py-3 font-semibold text-brand-heading">
                    {row.label}
                  </td>
                  <td className="px-4 py-3">{row.useCase}</td>
                  <td className="px-4 py-3">{row.fit}</td>
                  <td className="px-4 py-3 text-brand-primary">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return <></>;
  }
};
