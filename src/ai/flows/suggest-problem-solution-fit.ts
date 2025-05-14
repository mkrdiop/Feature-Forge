
'use server';
/**
 * @fileOverview AI-powered Problem/Solution Fit Analysis.
 *
 * - suggestProblemSolutionFit - A function that takes an app description and features,
 *   and returns an analysis of how well the app solves a perceived problem.
 * - SuggestProblemSolutionFitInput - The input type for the function.
 * - SuggestProblemSolutionFitOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FeatureDetail } from '@/ai/types';
import { FeatureDetailSchema } from '@/ai/types';

const SuggestProblemSolutionFitInputSchema = z.object({
  appDescription: z
    .string()
    .describe('The original description of the web or mobile application.'),
  features: z
    .array(FeatureDetailSchema)
    .describe('The list of suggested features, including their name, description, category, and complexity.'),
});
export type SuggestProblemSolutionFitInput = z.infer<typeof SuggestProblemSolutionFitInputSchema>;

const FeatureAlignmentSchema = z.object({
    featureName: z.string().describe("The name of one of the key suggested features."),
    alignmentNote: z.string().describe("A brief explanation of how this specific feature directly contributes to addressing the identified core problem or enhances the overall solution.")
});

const SuggestProblemSolutionFitOutputSchema = z.object({
  identifiedProblem: z
    .string()
    .describe("A concise (1-2 sentences) articulation of the core problem the application appears to solve, based on its description and features."),
  solutionOverview: z
    .string()
    .describe("A brief (2-3 sentences) overview of how the application, along with its key features, proposes to solve the identified problem."),
  featureAlignmentAnalysis: z
    .array(FeatureAlignmentSchema)
    .min(2).max(4) // Request 2-4 key feature alignments
    .describe("An analysis of how 2-4 key suggested features specifically align with solving the core problem or contribute to the solution's effectiveness."),
  overallAssessment: z
    .string()
    .describe("A concluding thought (1-2 sentences) on the potential problem/solution fit, possibly highlighting strengths or areas for further consideration to improve fit."),
});
export type SuggestProblemSolutionFitOutput = z.infer<typeof SuggestProblemSolutionFitOutputSchema>;

export async function suggestProblemSolutionFit(input: SuggestProblemSolutionFitInput): Promise<SuggestProblemSolutionFitOutput> {
  return suggestProblemSolutionFitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProblemSolutionFitPrompt',
  input: {schema: SuggestProblemSolutionFitInputSchema},
  output: {schema: SuggestProblemSolutionFitOutputSchema},
  prompt: `You are an expert Product Analyst and Strategist. Your task is to analyze the provided application description and its key features to articulate its problem/solution fit.

App Description:
{{{appDescription}}}

Key Features:
{{#each features}}
- Name: {{name}}
  Description: {{description}}
  Category: {{category}}
  Complexity: {{complexity}}
{{/each}}

Based on the above, provide the following in a structured format:

1.  **identifiedProblem**: Concisely state the primary problem (1-2 sentences) that this application aims to solve for its target users.
2.  **solutionOverview**: Briefly explain (2-3 sentences) how the application, leveraging its features, acts as a solution to this identified problem.
3.  **featureAlignmentAnalysis**: Select 2 to 4 of the most impactful features from the provided list. For each selected feature, provide:
    *   featureName: The name of the feature.
    *   alignmentNote: How this specific feature directly helps solve the identified problem or significantly contributes to the solution's value.
4.  **overallAssessment**: Offer a brief (1-2 sentences) concluding thought on the strength of the problem/solution fit. You might mention its potential or suggest areas for deeper validation.

Ensure your analysis is insightful and directly tied to the provided app description and features. Focus on clarity and conciseness.
`,
});

const suggestProblemSolutionFitFlow = ai.defineFlow(
  {
    name: 'suggestProblemSolutionFitFlow',
    inputSchema: SuggestProblemSolutionFitInputSchema,
    outputSchema: SuggestProblemSolutionFitOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

