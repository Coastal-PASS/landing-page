import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { type ReactElement } from "react";

import { Separator } from "@/components/ui/separator";
import { productSummaries, serviceSummaries } from "@/lib/pageBlueprints";

/**
 * Global footer with contact info, navigation, and legal copy.
 */
export const Footer = (): ReactElement => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-heading text-white">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-16">
        <div className="space-y-6 text-center">
          <Image
            src="/assets/img/ct/logo-white.png"
            alt="Coastal PASS"
            width={300}
            height={72}
            className="mx-auto h-auto w-[300px]"
          />
          <div className="space-y-4 text-sm text-white/80">
            <p>
              We are dedicated to transforming the agricultural industry
              through innovative precision technology. Our mission is to enhance
              efficiency, productivity, and sustainability on farms around the
              world. With a strong focus on delivering top-quality equipment and
              developing cutting-edge software solutions, we aim to empower
              farmers and agricultural businesses to achieve greater success.
            </p>
            <p className="text-white/70">
              Join us as we pave the way for a more efficient and sustainable
              future in agriculture.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm font-semibold sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="tel:+18316127277"
              className="inline-flex items-center gap-2 text-white transition hover:text-brand-highlight"
            >
              <Phone className="h-4 w-4 text-brand-highlight" aria-hidden />
              831-612-PASS (7277)
            </Link>
            <Link
              href="mailto:hello@coastalpass.services"
              className="inline-flex items-center gap-2 text-white transition hover:text-brand-highlight"
            >
              <Mail className="h-4 w-4 text-brand-highlight" aria-hidden />
              hello@coastalpass.services
            </Link>
          </div>
        </div>
        <div className="grid gap-6 text-center text-sm text-white/90 sm:grid-cols-2 sm:text-left">
          <FooterLinkGroup
            title="Services"
            links={serviceSummaries.map((service) => ({
              label: service.title,
              href: `/services/${service.slug}`,
            }))}
          />
          <FooterLinkGroup
            title="Products"
            links={productSummaries.map((product) => ({
              label: product.title,
              href: `/products/${product.slug}`,
            }))}
          />
        </div>
        <Separator className="w-full border-white/10" />
        <div className="flex flex-col items-start gap-2 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} CoManaged Technology Solutions LLC. All rights
            reserved.
          </p>
          <Link
            href="/privacy"
            className="text-white/70 underline-offset-2 hover:text-white hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkGroupProps {
  readonly title: string;
  readonly links: ReadonlyArray<{ label: string; href: string }>;
}

const FooterLinkGroup = ({
  title,
  links,
}: FooterLinkGroupProps): ReactElement => (
  <div className="text-left">
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
      {title}
    </p>
    <div className="mt-3 flex flex-wrap gap-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-white transition hover:text-brand-highlight"
        >
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);
