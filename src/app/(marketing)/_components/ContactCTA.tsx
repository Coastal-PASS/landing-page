import Link from "next/link";
import { type ReactElement } from "react";

import { ContactForm } from "@/features/contact/components/ContactForm";

import { Section } from "./Section";

interface ContactCTAProps {
  readonly title?: string;
  readonly body?: string;
  readonly context?: string;
}

/**
 * Shared contact band that embeds the ContactForm with contextual copy.
 */
export const ContactCTA = ({
  title = "Ready to get in touch?",
  body = "Call, email, or use the form and our precision ag specialists will respond within one business day.",
  context = "general",
}: ContactCTAProps): ReactElement => (
  <Section id={`contact-${context}`} background="gradient">
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
          Let&apos;s talk
        </p>
        <h3 className="text-3xl font-semibold">{title}</h3>
        <p className="text-lg text-white/80">{body}</p>
        <div className="space-y-2">
          <Link className="block text-lg font-semibold" href="tel:+18316127277">
            Phone: 831-612-PASS (7277)
          </Link>
          <Link
            className="block text-lg font-semibold"
            href="mailto:hello@coastalpass.services"
          >
            Email: hello@coastalpass.services
          </Link>
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <ContactForm
          variant="embedded"
          context={context}
          successCopy="Thanks! We usually reply within one business day."
        />
      </div>
    </div>
  </Section>
);
