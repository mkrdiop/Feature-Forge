
'use server';
/**
 * @fileOverview AI-powered Lean Canvas generation for app ideas.
 *
 * - suggestLeanCanvas - A function that takes an app description and features,
 *   and returns a structured Lean Canvas.
 * - SuggestLeanCanvasInput - The input type for the function.
 * - SuggestLeanCanvasOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FeatureDetail } from '@/ai/types';
import { FeatureDetailSchema, LeanCanvasSchema } from '@/ai/types';

const SuggestLeanCanvasInputSchema = z.object({
  appDescription: z
    .string()
    .describe('The original description of the web or mobile application.'),
  features: z
    .array(FeatureDetailSchema)
    .describe('The list of suggested features, including their name, description, category, and complexity. This provides context for the solution and UVP.'),
});
export type SuggestLeanCanvasInput = z.infer<typeof SuggestLeanCanvasInputSchema>;

// LeanCanvasSchema and LeanCanvasOutput are imported from '@/ai/types'
export type SuggestLeanCanvasOutput = z.infer<typeof LeanCanvasSchema>;


export async function suggestLeanCanvas(input: SuggestLeanCanvasInput): Promise<SuggestLeanCanvasOutput> {
  return suggestLeanCanvasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLeanCanvasPrompt',
  input: {schema: SuggestLeanCanvasInputSchema},
  output: {schema: LeanCanvasSchema},
  prompt: `You are an expert Business Strategist and Startup Coach specializing in the Lean Startup methodology.
Your task is to generate a Lean Canvas for the provided application idea.

App Description:
{{{appDescription}}}

Key Features (for context, especially for Solution and UVP):
{{#each features}}
- Name: {{name}}
  Description: {{description}}
{{/each}}

Based on the app description and features, fill out the following sections of the Lean Canvas.
For sections that ask for lists (e.g., Problem, Solution, Key Metrics, etc.), provide 1 to 3 distinct, concise points.

1.  **problem**: Identify the top 1-3 problems this application aims to solve for its target users.
2.  **customerSegments**: Define the specific target customer segments. Who are the early adopters?
3.  **uniqueValueProposition**: What is the single, clear, compelling message that states why this application is different and worth using/buying? What's the high-level concept (e.g., "X for Y")?
4.  **solution**: Outline the top 1-3 key features or aspects of the application that directly address the identified problems.
5.  **channels**: What are the primary pathways to reach and acquire these customer segments?
6.  **revenueStreams**: How will the application generate income? (e.g., subscriptions, ads, sales).
7.  **costStructure**: What are the major fixed and variable costs involved? (e.g., development, marketing, operations).
8.  **keyMetrics**: What are the key activities or numbers you will measure to track how the business is doing?
9.  **unfairAdvantage**: What is something about this application or business that cannot be easily copied or bought by competitors?

Ensure your output strictly adheres to the defined LeanCanvasSchema. Be concise and actionable for each section.
`,
});

const suggestLeanCanvasFlow = ai.defineFlow(
  {
    name: 'suggestLeanCanvasFlow',
    inputSchema: SuggestLeanCanvasInputSchema,
    outputSchema: LeanCanvasSchema, // This is SuggestLeanCanvasOutput
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

