import { productSummaries, serviceSummaries } from "./pageBlueprints";

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly children?: ReadonlyArray<NavItem>;
}

const serviceChildren: NavItem[] = serviceSummaries.map((service) => ({
  label: service.title,
  href: `/services/${service.slug}`,
}));

const productChildren: NavItem[] = productSummaries.map((product) => ({
  label: product.title,
  href: `/products/${product.slug}`,
}));

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", children: serviceChildren },
  { label: "Products", href: "/products", children: productChildren },
  { label: "Dealership Partner Program", href: "/partner-program" },
];

export const footerNav: NavItem[] = primaryNav.filter(
  (item) => item.label !== "Home",
);
