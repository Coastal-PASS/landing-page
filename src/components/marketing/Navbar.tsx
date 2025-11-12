'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface NavLink {
  readonly href: string;
  readonly label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/raven-air-blast', label: 'Raven' },
];

const renderLinks = (onNavigate?: () => void): ReactElement => (
  <ul className="flex flex-col gap-4 text-lg font-semibold text-brand-heading lg:flex-row lg:items-center lg:gap-8">
    {navLinks.map(({ href, label }) => (
      <li key={href}>
        <Link
          className="transition hover:text-brand-primary"
          href={href}
          onClick={(_event): void => {
            onNavigate?.();
          }}
        >
          {label}
        </Link>
      </li>
    ))}
  </ul>
);

/**
 * Primary marketing navigation with CTA and mobile sheet menu.
 */
export const Navbar = (): ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link className="flex items-center gap-3" href="/" aria-label="Coastal PASS home">
          <Image
            src="/assets/img/ct/logo.png"
            alt="Coastal PASS"
            width={156}
            height={40}
            priority
          />
        </Link>

        <nav aria-label="Primary navigation" className="hidden lg:block">
          {renderLinks()}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 lg:hidden',
              )}
            >
              <span className="sr-only">Open navigation</span>
              <div className="space-y-1">
                <span className="block h-0.5 w-6 bg-brand-heading" />
                <span className="block h-0.5 w-6 bg-brand-heading" />
                <span className="block h-0.5 w-6 bg-brand-heading" />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">Primary navigation links</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="mt-6">
                {renderLinks(() => setMobileOpen(false))}
              </nav>
              <Button asChild className="mt-8 w-full">
                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                  Contact Us
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
