'use server';

/**
 * @fileOverview AI-powered feature suggestion for web/mobile app ideas.
 *
 * - suggestFeatures - A function that takes an app description and returns a list of feature suggestions.
 * - SuggestFeaturesInput - The input type for the suggestFeatures function.
 * - SuggestFeaturesOutput - The return type for the suggestFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFeaturesInputSchema = z.object({
  appDescription: z
    .string()
    .describe('A description of the desired web or mobile application.'),
});
export type SuggestFeaturesInput = z.infer<typeof SuggestFeaturesInputSchema>;

const SuggestFeaturesOutputSchema = z.object({
  features: z
    .array(z.string())
    .describe('A list of possible features for the described application.'),
});
export type SuggestFeaturesOutput = z.infer<typeof SuggestFeaturesOutputSchema>;

export async function suggestFeatures(input: SuggestFeaturesInput): Promise<SuggestFeaturesOutput> {
  return suggestFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFeaturesPrompt',
  input: {schema: SuggestFeaturesInputSchema},
  output: {schema: SuggestFeaturesOutputSchema},
  prompt: `You are an AI-powered app idea generator. Given a description of an application a user wants to build, you will return a list of possible features for that application, including simple features and AI-powered features.

Description: {{{appDescription}}}

Features:`,
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
