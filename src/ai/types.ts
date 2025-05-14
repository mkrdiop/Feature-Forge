
/**
 * @fileOverview Shared Zod schemas and TypeScript types for AI flows.
 */
import {z} from 'genkit';

export const FeatureDetailSchema = z.object({
  name: z.string().describe('The concise name of the feature (e.g., "User Authentication", "AI Image Generation").'),
  description: z.string().describe('A brief (1-2 sentences) explanation of what the feature entails and its benefit.'),
  category: z.string().describe('A category for the feature (e.g., "Core Functionality", "User Interface", "AI-Powered", "Data & Analytics", "Monetization", "Security", "User Engagement").'),
  complexity: z.enum(['Low', 'Medium', 'High']).describe('An estimated complexity level (Low, Medium, or High) for implementing the feature.'),
});
export type FeatureDetail = z.infer<typeof FeatureDetailSchema>;

export const MonetizationStrategySchema = z.object({
  strategyName: z.string().describe("The common name of the monetization strategy (e.g., 'Subscription Model', 'Freemium', 'In-App Purchases', 'Advertising', 'One-Time Purchase')."),
  description: z.string().describe("A brief (1-2 sentences) explanation of how this monetization strategy works."),
  suitabilityRationale: z.string().describe("Why this strategy might be suitable for the described application, considering its features and potential user base. Be specific."),
  potentialDrawbacks: z.string().describe("Potential challenges or downsides of implementing this strategy for this specific app."),
  keyConsiderations: z.array(z.string()).describe("A list of 2-3 key factors or questions the developer should consider if they pursue this strategy (e.g., 'Pricing tiers', 'Ad placement strategy', 'Value proposition for premium features').")
});
export type MonetizationStrategy = z.infer<typeof MonetizationStrategySchema>;
