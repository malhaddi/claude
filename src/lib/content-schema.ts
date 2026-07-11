import { z } from "zod";

/**
 * Schemas for the marketing-site content defined in `content.ts`.
 * Content is parsed at module load, so a malformed entry fails the build
 * and the test suite instead of rendering broken UI.
 */

export const navLinkSchema = z.object({
  href: z
    .string()
    .min(1)
    .regex(/^[/#]/, "nav links must be internal (start with / or #)"),
  label: z.string().min(1),
});

export const stepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const templateExampleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  hookExample: z.string().min(1),
  description: z.string().min(1),
  bestFor: z.string().min(1),
});

export const benefitSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const faqItemSchema = z.object({
  question: z
    .string()
    .min(1)
    .regex(/\?$/, "FAQ questions must end with a question mark"),
  answer: z.string().min(1),
});

export const pricingPlanSchema = z.object({
  name: z.string().min(1),
  priceMonthlyEur: z.number().int().positive(),
  description: z.string().min(1),
  features: z.array(z.string().min(1)).min(3),
  note: z.string().min(1),
});

export type NavLink = z.infer<typeof navLinkSchema>;
export type Step = z.infer<typeof stepSchema>;
export type TemplateExample = z.infer<typeof templateExampleSchema>;
export type Benefit = z.infer<typeof benefitSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type PricingPlan = z.infer<typeof pricingPlanSchema>;
