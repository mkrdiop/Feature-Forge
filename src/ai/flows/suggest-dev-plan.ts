
'use server';

/**
 * @fileOverview AI-powered development plan and calendar suggestion.
 *
 * - suggestDevPlan - A function that takes an app description and a list of features,
 *   and returns a structured development plan.
 * - SuggestDevPlanInput - The input type for the suggestDevPlan function.
 * - SuggestDevPlanOutput - The return type for the suggestDevPlan function.
 * - DevPlanPhase - The type for individual development phases.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FeatureDetail } from '@/ai/types'; // Updated import path
import { FeatureDetailSchema } from '@/ai/types'; // Updated import path

const SuggestDevPlanInputSchema = z.object({
  appDescription: z
    .string()
    .describe('The original description of the web or mobile application.'),
  features: z
    .array(FeatureDetailSchema)
    .describe('The list of suggested features, including their name, description, category, and complexity.'),
});
export type SuggestDevPlanInput = z.infer<typeof SuggestDevPlanInputSchema>;

const DevPlanPhaseSchema = z.object({
  phaseTitle: z.string().describe("Title of the development phase (e.g., 'Phase 1: Core Functionality & MVP', 'Sprint 2: User Profiles & Settings')."),
  phaseGoal: z.string().describe("A brief goal for this phase, explaining what will be achieved."),
  featuresToImplement: z.array(z.string()).describe("List of feature names (from the provided list of features) to be implemented in this phase. Refer to the complexities when assigning features."),
  estimatedDuration: z.string().describe("Estimated duration for this phase (e.g., '2-3 weeks', '1 month')."),
});
export type DevPlanPhase = z.infer<typeof DevPlanPhaseSchema>;

const SuggestDevPlanOutputSchema = z.object({
  projectName: z.string().describe("A suitable and concise name for the project, inferred from the app description."),
  executiveSummary: z.string().describe("A brief 1-2 sentence executive summary of the overall development plan and timeline."),
  phases: z.array(DevPlanPhaseSchema).describe("An array of development phases. Each phase should logically group features, considering their complexity and dependencies. Start with core, low-complexity features for an MVP if applicable."),
  overallTimeline: z.string().describe("A summary of the total estimated project timeline (e.g., 'Total estimated duration: 3-4 months')."),
  recommendations: z.array(z.string()).describe("Key recommendations or strategic considerations for the development process. This could include advice on technology choices (if inferable), testing strategies, deployment, user feedback loops, or potential challenges to watch out for. Provide at least 2-3 distinct recommendations."),
});
export type SuggestDevPlanOutput = z.infer<typeof SuggestDevPlanOutputSchema>;


export async function suggestDevPlan(input: SuggestDevPlanInput): Promise<SuggestDevPlanOutput> {
  return suggestDevPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDevPlanPrompt',
  input: {schema: SuggestDevPlanInputSchema},
  output: {schema: SuggestDevPlanOutputSchema},
  prompt: `You are an expert Project Manager and Lead Developer. Your task is to create a high-level development plan and indicative calendar for a new application based on its description and a list of suggested features (including their complexities).

App Description:
{{{appDescription}}}

Suggested Features (with name, description, category, complexity):
{{#each features}}
- Name: {{name}}
  Description: {{description}}
  Category: {{category}}
  Complexity: {{complexity}}
{{/each}}

Based on the above, provide the following in a structured format:

1.  **projectName**: A suitable and concise name for the project.
2.  **executiveSummary**: A brief 1-2 sentence executive summary of the plan.
3.  **phases**: An array of development phases.
    *   Each phase should have a phaseTitle, a phaseGoal, an estimatedDuration (e.g., "2-3 weeks", "1 month"), and a list of featuresToImplement (by name, from the provided list).
    *   Logically group features into phases. Consider feature complexities (Low, Medium, High) and dependencies. Typically, start with core functionality and lower complexity items for an MVP or initial release. More complex or supplementary features can come in later phases. Aim for 2-4 phases.
4.  **overallTimeline**: A summary of the total estimated project timeline.
5.  **recommendations**: At least 2-3 key recommendations or strategic considerations for development (e.g., "Prioritize building a robust user authentication system early," "Consider user testing after Phase 1 to gather feedback on core features," "For AI features, ensure data privacy and ethical considerations are addressed from the start.").

Ensure the output strictly adheres to the defined schema.
`,
});

const suggestDevPlanFlow = ai.defineFlow(
  {
    name: 'suggestDevPlanFlow',
    inputSchema: SuggestDevPlanInputSchema,
    outputSchema: SuggestDevPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
