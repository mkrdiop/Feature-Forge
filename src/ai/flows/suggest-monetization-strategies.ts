'use server';
/**
 * @fileOverview AI-powered monetization strategy suggestions for app ideas.
 *
 * - suggestMonetizationStrategies - A function that takes an app description and features,
 *   and returns a list of potential monetization strategies.
 * - SuggestMonetizationStrategiesInput - The input type for the function.
 * - SuggestMonetizationStrategiesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FeatureDetail } from '@/ai/types';
import { FeatureDetailSchema, MonetizationStrategySchema } from '@/ai/types';

const SuggestMonetizationStrategiesInputSchema = z.object({
  appDescription: z
    .string()
    .describe('The original description of the web or mobile application.'),
  features: z
    .array(FeatureDetailSchema)
    .describe('The list of suggested features, including their name, description, category, and complexity.'),
});
export type SuggestMonetizationStrategiesInput = z.infer<typeof SuggestMonetizationStrategiesInputSchema>;

const SuggestMonetizationStrategiesOutputSchema = z.object({
  strategies: z
    .array(MonetizationStrategySchema)
    .describe('A list of 2-3 potential monetization strategies relevant to the described application and its features.'),
});
export type SuggestMonetizationStrategiesOutput = z.infer<typeof SuggestMonetizationStrategiesOutputSchema>;

export async function suggestMonetizationStrategies(input: SuggestMonetizationStrategiesInput): Promise<SuggestMonetizationStrategiesOutput> {
  return suggestMonetizationStrategiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMonetizationStrategiesPrompt',
  input: {schema: SuggestMonetizationStrategiesInputSchema},
  output: {schema: SuggestMonetizationStrategiesOutputSchema},
  prompt: `You are an expert Business Strategist and App Monetization Consultant.
Your task is to analyze the provided application description and its key features, and then suggest 2-3 distinct and relevant monetization strategies.

App Description:
{{{appDescription}}}

Key Features:
{{#each features}}
- Name: {{name}}
  Description: {{description}}
  Category: {{category}}
  Complexity: {{complexity}}
{{/each}}

For each suggested monetization strategy, you MUST provide:
1.  "strategyName": The common name of the strategy (e.g., "Subscription Model", "Freemium with Ad Support", "In-App Purchases for Premium Content", "One-Time Purchase", "Data Monetization (Aggregated & Anonymized)", "Affiliate Marketing").
2.  "description": A brief (1-2 sentences) explanation of how this monetization strategy works in general.
3.  "suitabilityRationale": A specific explanation (2-3 sentences) detailing why this strategy is a good fit for *this particular application*, considering its described purpose and the listed features. Connect the strategy to the app's potential value proposition.
4.  "potentialDrawbacks": One or two key potential challenges or downsides of implementing this strategy for this specific app.
5.  "keyConsiderations": An array of 2-3 important questions or factors the developer should consider if they choose to pursue this strategy (e.g., "What will be the core value offered in the premium tier?", "How to balance ad frequency with user experience?", "What digital goods or features would users pay for?").

Return the strategies as an array under the "strategies" key, strictly adhering to the defined output schema. Ensure the strategies are diverse and practical for the given app concept.
`,
});

const suggestMonetizationStrategiesFlow = ai.defineFlow(
  {
    name: 'suggestMonetizationStrategiesFlow',
    inputSchema: SuggestMonetizationStrategiesInputSchema,
    outputSchema: SuggestMonetizationStrategiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
