import { z } from "zod";

/**
 * Schemas for the marketing-site content defined in `content.ts`.
 * Content is parsed at module load, so a malformed entry fails the build
 * and the test suite instead of rendering broken UI.
 */

/** Availability of a feature/template: shipping at launch vs. planned. */
export const availabilitySchema = z.enum(["launch", "soon"]);
export type Availability = z.infer<typeof availabilitySchema>;

export const navLinkSchema = z.object({
  href: z
    .string()
    .min(1)
    .regex(/^[/#]/, "nav links must be internal (start with / or #)"),
  label: z.string().min(1),
});

/** A call-to-action link. `href` may be null for a disabled/waitlist CTA. */
export const ctaSchema = z.object({
  label: z.string().min(1),
  href: z
    .string()
    .regex(/^[/#]/, "CTA links must be internal (start with / or #)")
    .nullable(),
});

export const heroSchema = z.object({
  badge: z.string().min(1),
  headline: z.string().min(1),
  promise: z.string().min(1),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
  noCardNote: z.string().min(1),
  previewLabel: z.string().min(1),
});

export const problemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const workflowStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const templateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  bestFor: z.string().min(1),
  funnelStage: z.string().min(1),
  structure: z.array(z.string().min(1)).min(3),
  availability: availabilitySchema,
});

export const capabilitySchema = z.object({
  label: z.string().min(1),
  availability: availabilitySchema,
});

export const differentiatorSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const pricingPlanSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    /** Whole-euro monthly price; 0 means free. */
    priceMonthlyEur: z.number().int().nonnegative(),
    tagline: z.string().min(1),
    features: z.array(z.string().min(1)).min(3),
    badge: z.string().min(1).nullable(),
    cta: ctaSchema,
    /** Recommended (highlighted) plan. */
    recommended: z.boolean(),
    /** Whether the plan can be started today. Growth is not yet available. */
    available: z.boolean(),
  })
  .refine((plan) => plan.available || plan.cta.href === null, {
    message: "an unavailable plan must not link to an actionable CTA",
    path: ["cta", "href"],
  });

export const comparisonApproachSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** Highlight the Publy column. */
  highlight: z.boolean(),
});

export const comparisonRowSchema = z.object({
  dimension: z.string().min(1),
  /** One value per approach id, keyed by approach id. */
  values: z.record(z.string(), z.string().min(1)),
});

export const faqItemSchema = z.object({
  question: z
    .string()
    .min(1)
    .regex(/\?$/, "FAQ questions must end with a question mark"),
  answer: z.string().min(1),
});

export const finalCtaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  cta: ctaSchema,
});

export const footerGroupSchema = z.object({
  title: z.string().min(1),
  links: z.array(navLinkSchema).min(1),
});

export type NavLink = z.infer<typeof navLinkSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type Problem = z.infer<typeof problemSchema>;
export type WorkflowStep = z.infer<typeof workflowStepSchema>;
export type Template = z.infer<typeof templateSchema>;
export type Capability = z.infer<typeof capabilitySchema>;
export type Differentiator = z.infer<typeof differentiatorSchema>;
export type PricingPlan = z.infer<typeof pricingPlanSchema>;
export type ComparisonApproach = z.infer<typeof comparisonApproachSchema>;
export type ComparisonRow = z.infer<typeof comparisonRowSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type FinalCta = z.infer<typeof finalCtaSchema>;
export type FooterGroup = z.infer<typeof footerGroupSchema>;
