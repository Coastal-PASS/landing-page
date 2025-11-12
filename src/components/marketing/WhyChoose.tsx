import Image from "next/image";
import { type ReactElement } from "react";

interface Reason {
  readonly title: string;
  readonly copy: string;
}

const reasons: Reason[] = [
  {
    title: "Expertise & Innovation",
    copy: "Decades of precision ag deployments paired with modern integrations mean we can translate OEM roadmaps into practical field upgrades.",
  },
  {
    title: "Comprehensive Support",
    copy: "From hardware installs to remote monitoring, one team carries projects from kickoff through seasonal maintenance.",
  },
  {
    title: "Trusted Partnerships",
    copy: "We collaborate with New Holland, Raven, PTX Trimble, and emerging startups to deliver the right solution for each fleet.",
  },
];

/**
 * Storytelling block describing why Coastal PASS is a trusted partner.
 */
export const WhyChoose = (): ReactElement => (
  <section className="py-30">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
          Why choose us
        </p>
        <h2 className="text-3xl font-semibold text-brand-heading">
          High-tech advantage with old fashioned service
        </h2>
        <p className="text-brand-body">
          Our team pairs boots-on-the-ground experience with a modern provider
          stack, so growers get proactive support, actionable data, and
          equipment that simply works.
        </p>
        <dl className="space-y-5">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="flex gap-4 rounded-2xl border border-surface-muted/70 bg-white/80 p-5 shadow-card"
            >
              <dt className="text-3xl font-semibold text-brand-primary">
                {String(index + 1).padStart(2, "0")}
              </dt>
              <dd>
                <p className="text-lg font-semibold text-brand-heading">
                  {reason.title}
                </p>
                <p className="text-brand-body">{reason.copy}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative">
        <div className="hidden lg:block">
          <div
            className="absolute -top-6 -right-6 h-40 w-40 rounded-full bg-brand-accent/20 blur-3xl"
            aria-hidden
          />
        </div>
        <Image
          src="/assets/img/ct/jake_barn.png"
          alt="Jake with precision ag equipment"
          width={720}
          height={540}
          className="rounded-3xl border border-white/60 shadow-card"
        />
      </div>
    </div>
  </section>
);
