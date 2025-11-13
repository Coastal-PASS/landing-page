"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactElement } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { primaryNav, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Primary marketing navigation with CTA and mobile sheet menu.
 */
const isActive = (pathname: string, href: string): boolean => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

const DesktopNavItem = ({
  item,
  pathname,
}: {
  readonly item: NavItem;
  readonly pathname: string;
}): ReactElement => {
  const [open, setOpen] = useState(false);
  const active = isActive(pathname, item.href);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          "text-sm font-semibold transition",
          active
            ? "text-brand-primary"
            : "text-brand-heading hover:text-brand-primary",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-sm font-semibold",
          active ? "text-brand-primary" : "text-brand-heading",
        )}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.label}
        <span aria-hidden>▾</span>
      </button>
      {open ? (
        <div className="absolute left-0 top-full mt-3 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex flex-col gap-3">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "text-sm font-semibold",
                  isActive(pathname, child.href)
                    ? "text-brand-primary"
                    : "text-brand-heading hover:text-brand-primary",
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const DesktopNav = ({
  pathname,
}: {
  readonly pathname: string;
}): ReactElement => (
  <ul className="flex items-center gap-6">
    {primaryNav.map((item) => (
      <li key={item.href}>
        <DesktopNavItem item={item} pathname={pathname} />
      </li>
    ))}
  </ul>
);

const MobileNav = ({
  pathname,
  onNavigate,
}: {
  readonly pathname: string;
  readonly onNavigate: () => void;
}): ReactElement => (
  <div className="space-y-4">
    {primaryNav.map((item) => (
      <div key={item.href}>
        <Link
          href={item.href}
          className={cn(
            "text-base font-semibold",
            isActive(pathname, item.href)
              ? "text-brand-primary"
              : "text-brand-heading hover:text-brand-primary",
          )}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
        {item.children ? (
          <div className="mt-2 space-y-2 pl-4">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "text-sm",
                  isActive(pathname, child.href)
                    ? "text-brand-primary"
                    : "text-brand-heading hover:text-brand-primary",
                )}
                onClick={onNavigate}
              >
                {child.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    ))}
  </div>
);

export const Navbar = (): ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  return (
    <header className="sticky inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 lg:h-24">
        <Link
          className="flex items-center gap-3"
          href="/"
          aria-label="Coastal PASS home"
        >
          <Image
            src="/assets/img/ct/logo.png"
            alt="Coastal PASS"
            width={230}
            height={60}
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-4 lg:flex">
            <nav aria-label="Primary navigation">
              <DesktopNav pathname={pathname} />
            </nav>
            <Button asChild size="sm">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
          <Button
            asChild
            size="sm"
            className="inline-flex sm:hidden"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 lg:hidden",
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
                <SheetDescription className="sr-only">
                  Primary navigation links
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="mt-6 space-y-4">
                <MobileNav
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
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
