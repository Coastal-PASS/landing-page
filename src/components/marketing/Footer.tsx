import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { type ReactElement } from "react";

import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/raven-air-blast", label: "Raven Air Blast" },
];

/**
 * Global footer with contact info, navigation, and legal copy.
 */
export const Footer = (): ReactElement => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-heading text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 py-20 text-center">
        <Image
          src="/assets/img/ct/logo-white.png"
          alt="Coastal PASS"
          width={300}
          height={72}
          className="mx-auto"
        />
        <div className="space-y-4 text-base text-white/85">
          <p>
            We are dedicated to transforming the agricultural industry through
            innovative precision technology. Our mission is to enhance
            efficiency, productivity, and sustainability on farms around the
            world. With a strong focus on delivering top-quality equipment and
            developing cutting-edge software solutions, we aim to empower
            farmers and agricultural businesses to achieve greater success.
          </p>
          <p className="text-white/75">
            Join us as we pave the way for a more efficient and sustainable
            future in agriculture.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 text-sm font-semibold sm:flex-row sm:gap-10">
          <Link
            href="tel:+18316127277"
            className="inline-flex items-center gap-2 text-white transition hover:text-brand-highlight"
          >
            <Phone className="h-5 w-5 text-brand-highlight" aria-hidden />
            831-612-PASS (7277)
          </Link>
          <Link
            href="mailto:hello@coastalpass.services"
            className="inline-flex items-center gap-2 text-white transition hover:text-brand-highlight"
          >
            <Mail className="h-5 w-5 text-brand-highlight" aria-hidden />
            hello@coastalpass.services
          </Link>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wide text-white/70">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Separator className="w-full border-white/10" />
        <div className="text-xs text-white/70">
          <p>&copy; {year} CoManaged Technology Solutions LLC. All rights reserved.</p>
          <p className="text-white/60">
            Designed for the Coastal PASS marketing site rebuild.
          </p>
        </div>
      </div>
    </footer>
  );
};
