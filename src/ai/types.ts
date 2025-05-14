
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

export const LeanCanvasSchema = z.object({
  problem: z.array(z.string()).min(1).max(3).describe("Top 1-3 problems the application solves for its users."),
  solution: z.array(z.string()).min(1).max(3).describe("Key features or aspects of the application that directly address the identified problems."),
  keyMetrics: z.array(z.string()).min(1).max(3).describe("The key activities or numbers to measure that indicate how well the business is doing."),
  uniqueValueProposition: z.string().describe("A single, clear, compelling message that states why the application is different and worth using. Include a high-level concept or X for Y analogy if applicable."),
  unfairAdvantage: z.array(z.string()).min(1).max(3).describe("Something that cannot be easily copied or bought by competitors (e.g., insider information, a strong community, a unique patent)."),
  channels: z.array(z.string()).min(1).max(3).describe("The primary pathways to reach and acquire target customers (e.g., social media, app stores, content marketing)."),
  customerSegments: z.array(z.string()).min(1).max(3).describe("The specific target groups of users or customers the application aims to serve. List early adopters if relevant."),
  costStructure: z.array(z.string()).min(1).max(3).describe("The major fixed and variable costs associated with running the application (e.g., development, marketing, hosting, salaries)."),
  revenueStreams: z.array(z.string()).min(1).max(3).describe("The primary ways the application will generate income (e.g., subscriptions, advertising, one-time sales, data licensing)."),
});
export type LeanCanvasOutput = z.infer<typeof LeanCanvasSchema>;

