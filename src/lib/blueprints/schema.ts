import { z } from "zod";

import { imagery, type ImageAsset, type ImageryKey } from "../imagery";

export const mediaSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().min(1),
  height: z.number().min(1),
  aspect: z.enum(["16:9", "4:3", "1:1"]).default("16:9"),
});

export const sectionBackgroundSchema = z
  .enum(["white", "wash", "gradient"])
  .default("white");

export const actionSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "ghost"]).default("primary"),
});

const cardSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  body: z.string(),
  cta: actionSchema.optional(),
});

type GridCard = z.infer<typeof cardSchema>;

const timelineStepSchema = z.object({
  label: z.string(),
  description: z.string(),
});

const statSchema = z.object({
  label: z.string(),
  value: z.string(),
  helper: z.string().optional(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const processStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  helper: z.string().optional(),
});

const partnerLogoSchema = z.object({
  name: z.string(),
  logo: z.string(),
  alt: z.string(),
  href: z.string().url().optional(),
});

const betaStatusSchema = z.object({
  label: z.string(),
  tone: z.enum(["default", "success", "warning"]).default("default"),
});

const comparisonRowSchema = z.object({
  label: z.string(),
  useCase: z.string(),
  fit: z.string(),
  status: z.string(),
});

const sectionBaseSchema = z.object({
  id: z.string(),
  eyebrow: z.string().optional(),
  title: z.string(),
  body: z.string(),
  copy: z.array(z.string()).optional(),
  background: sectionBackgroundSchema.optional(),
});

const heroSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("hero"),
  media: mediaSchema,
  actions: z.array(actionSchema).min(1).max(2),
});

const gridSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("grid"),
  cards: z.array(cardSchema).min(3),
  detailNav: z.array(actionSchema).optional(),
  logos: z.array(partnerLogoSchema).optional(),
});

const timelineSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("timeline"),
  steps: z.array(timelineStepSchema).min(3),
  media: mediaSchema.optional(),
});

const detailNavSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("detail-nav"),
  links: z.array(actionSchema).min(3),
});

const ctaSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("cta"),
  actions: z.array(actionSchema).min(1).max(2),
});

const statsSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("stats"),
  stats: z.array(statSchema).min(3),
});

const faqSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("faq"),
  faqs: z.array(faqSchema).min(3),
});

const processSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("process"),
  steps: z.array(processStepSchema).min(3),
});

const partnerLogosSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("partner-logos"),
  logos: z.array(partnerLogoSchema).min(3),
});

const betaHighlightSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("beta-highlight"),
  status: betaStatusSchema,
  actions: z.array(actionSchema).min(1).max(2),
});

const betaProgramSchema = z.object({
  name: z.string(),
  description: z.string(),
  bullets: z.array(z.string()).min(2),
  action: actionSchema,
  status: betaStatusSchema.optional(),
});

const betaProgramsSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("beta-programs"),
  programs: z.array(betaProgramSchema).min(2),
});

const comparisonSectionSchema = sectionBaseSchema.extend({
  kind: z.literal("comparison"),
  rows: z.array(comparisonRowSchema).min(3),
});

export const sectionSchema = z.discriminatedUnion("kind", [
  heroSectionSchema,
  gridSectionSchema,
  timelineSectionSchema,
  detailNavSectionSchema,
  ctaSectionSchema,
  statsSectionSchema,
  faqSectionSchema,
  processSectionSchema,
  partnerLogosSectionSchema,
  betaHighlightSectionSchema,
  betaProgramsSectionSchema,
  comparisonSectionSchema,
]);

export const pageBlueprintSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  sections: z.array(sectionSchema).min(3),
});

export type Section = z.infer<typeof sectionSchema>;
export type PageBlueprint = z.infer<typeof pageBlueprintSchema>;
export type SectionAction = z.infer<typeof actionSchema>;

const imageFrom = (key: ImageryKey): ImageAsset => {
  const asset = imagery[key];
  if (!asset) {
    throw new Error(`Missing imagery asset for ${key}`);
  }
  return asset;
};

interface HeroOptions {
  readonly eyebrow?: string;
  readonly title: string;
  readonly body: string;
  readonly media: ImageryKey;
  readonly actions: ReadonlyArray<SectionAction>;
  readonly background?: z.infer<typeof sectionBackgroundSchema>;
}

export const buildHeroSection = (
  id: string,
  options: HeroOptions,
): Extract<Section, { kind: "hero" }> => ({
  id,
  kind: "hero" as const,
  eyebrow: options.eyebrow,
  title: options.title,
  body: options.body,
  media: imageFrom(options.media),
  actions: [...options.actions],
  background: options.background,
});

export const buildAction = (
  label: string,
  href: string,
  variant: z.infer<typeof actionSchema>["variant"] = "primary",
): SectionAction => ({ label, href, variant });

export const buildCards = (
  cards: Array<{
    icon?: string;
    title: string;
    body: string;
    cta?: {
      label: string;
      href: string;
      variant?: "primary" | "secondary" | "ghost";
    };
  }>,
): GridCard[] =>
  cards.map((card) => ({
    icon: card.icon,
    title: card.title,
    body: card.body,
    cta: card.cta
      ? buildAction(card.cta.label, card.cta.href, card.cta.variant ?? "ghost")
      : undefined,
  }));

export const buildDetailNavLinks = (
  items: Array<{ label: string; href: string }>,
): SectionAction[] =>
  items.map((item) => buildAction(item.label, item.href, "ghost"));
