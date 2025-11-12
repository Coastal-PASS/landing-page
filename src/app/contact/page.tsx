import type { Metadata } from "next";
import Link from "next/link";
import { type ReactElement } from "react";

import { Footer, Navbar } from "@/components/marketing";
import { ContactForm } from "@/features/contact/components/ContactForm";

const contactMethods = [
  {
    label: "Call Us",
    value: "831-612-PASS (7277)",
    href: "tel:+18316127277",
  },
  {
    label: "Email Us",
    value: "hello@coastalpass.services",
    href: "mailto:hello@coastalpass.services",
  },
  {
    label: "Visit Us",
    value: "10 Harris Pl, Salinas, CA 93901",
    href: "https://maps.apple.com/?q=10+Harris+Pl+Salinas+CA",
  },
];

export const metadata: Metadata = {
  title: "Contact Coastal PASS",
  description:
    "Reach out to the Coastal PASS team for precision agriculture hardware, installs, and service.",
};

const ContactPage = (): ReactElement => (
  <>
    <Navbar />
    <main className="bg-surface-muted py-25">
      <div className="mx-auto max-w-5xl space-y-12 px-4">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
            Let&apos;s talk
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-brand-heading">
            Tell us about your fleet or project
          </h1>
          <p className="mt-4 text-brand-body">
            Whether you need a single upgrade or a multi-location deployment,
            our precision ag specialists can help scope, install, and support
            the right solution.
          </p>
        </header>
        <section className="grid gap-6 md:grid-cols-3">
          {contactMethods.map((method) => (
            <div
              key={method.label}
              className="rounded-3xl border border-white/60 bg-white p-5 text-center shadow-card"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
                {method.label}
              </p>
              <Link
                href={method.href}
                className="mt-2 block text-lg font-semibold text-brand-heading hover:text-brand-accent"
              >
                {method.value}
              </Link>
            </div>
          ))}
        </section>
        <section className="rounded-3xl border border-white/60 bg-white p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-brand-heading">
            Send us a message
          </h2>
          <p className="mt-2 text-brand-body">
            We respond within one business day.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </>
);

export default ContactPage;
