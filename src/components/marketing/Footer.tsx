import Image from 'next/image';
import Link from 'next/link';
import { type ReactElement } from 'react';

import { Separator } from '@/components/ui/separator';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/raven-air-blast', label: 'Raven Air Blast' },
];

/**
 * Global footer with contact info, navigation, and legal copy.
 */
export const Footer = (): ReactElement => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-heading text-white">
      <div className="mx-auto max-w-6xl px-4 py-15">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <Image
              src="/assets/img/ct/logo-white.png"
              alt="Coastal PASS"
              width={180}
              height={42}
            />
            <p className="text-sm text-white/80">
              We deliver precision agriculture hardware, connectivity, and service workflows that keep specialty crops running on time and on target.
            </p>
            <div className="text-sm text-white/80">
              <p>
                <strong>Phone:</strong> <Link href="tel:+18316127277" className="hover:text-brand-accent">831-612-PASS (7277)</Link>
              </p>
              <p>
                <strong>Email:</strong> <Link href="mailto:hello@coastalpass.services" className="hover:text-brand-accent">hello@coastalpass.services</Link>
              </p>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">Navigation</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-brand-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator className="my-10 border-white/20" />
        <div className="flex flex-col gap-4 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} CoManaged Technology Solutions LLC. All rights reserved.</p>
          <p className="text-white/60">Designed for the Coastal PASS marketing site rebuild.</p>
        </div>
      </div>
    </footer>
  );
};
