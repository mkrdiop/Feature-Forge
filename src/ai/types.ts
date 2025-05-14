
'use server';
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
