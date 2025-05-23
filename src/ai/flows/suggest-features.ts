
'use server';

/**
 * @fileOverview AI-powered feature suggestion for web/mobile app ideas.
 *
 * - suggestFeatures - A function that takes an app description and returns a list of detailed feature suggestions.
 * - SuggestFeaturesInput - The input type for the suggestFeatures function.
 * - SuggestFeaturesOutput - The return type for the suggestFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FeatureDetail } from '@/ai/types'; // Import FeatureDetail type
import { FeatureDetailSchema } from '@/ai/types'; // Import FeatureDetailSchema

const SuggestFeaturesInputSchema = z.object({
  appDescription: z
    .string()
    .describe('A description of the desired web or mobile application.'),
});
export type SuggestFeaturesInput = z.infer<typeof SuggestFeaturesInputSchema>;

// FeatureDetailSchema and FeatureDetail are now imported from '@/ai/types'

const SuggestFeaturesOutputSchema = z.object({
  features: z
    .array(FeatureDetailSchema)
    .describe('A list of detailed feature suggestions for the described application.'),
});
export type SuggestFeaturesOutput = z.infer<typeof SuggestFeaturesOutputSchema>;

export async function suggestFeatures(input: SuggestFeaturesInput): Promise<SuggestFeaturesOutput> {
  return suggestFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFeaturesPrompt',
  input: {schema: SuggestFeaturesInputSchema},
  output: {schema: SuggestFeaturesOutputSchema},
  prompt: `You are an AI-powered app idea consultant. Given a description of an application a user wants to build, you will return a list of possible features for that application.

For each feature, you MUST provide:
1.  "name": A concise name for the feature (e.g., "User Authentication", "AI Chatbot Support").
2.  "description": A brief (1-2 sentences) explanation of what the feature entails and its benefit to the user or business.
3.  "category": Classify the feature into one of the following categories or a similar relevant one: "Core Functionality", "User Interface", "AI-Powered", "Data & Analytics", "Monetization", "Security", "User Engagement", "Accessibility", "Performance & Scalability".
4.  "complexity": Estimate the implementation complexity strictly as "Low", "Medium", or "High".

Description of the application:
{{{appDescription}}}

Return the features in the structured format as an array under the "features" key.
`,
});

const suggestFeaturesFlow = ai.defineFlow(
  {
    name: 'suggestFeaturesFlow',
    inputSchema: SuggestFeaturesInputSchema,
    outputSchema: SuggestFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
