
'use server';

/**
 * @fileOverview AI-powered development plan and calendar suggestion,
 * including conceptual Genkit prompts for AI features.
 *
 * - suggestDevPlan - A function that takes an app description and a list of features,
 *   and returns a structured development plan with Genkit prompt ideas.
 * - SuggestDevPlanInput - The input type for the suggestDevPlan function.
 * - SuggestDevPlanOutput - The return type for the suggestDevPlan function.
 * - DevPlanPhase - The type for individual development phases.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FeatureDetail } from '@/ai/types'; 
import { FeatureDetailSchema } from '@/ai/types'; 

const SuggestDevPlanInputSchema = z.object({
  appDescription: z
    .string()
    .describe('The original description of the web or mobile application.'),
  features: z
    .array(FeatureDetailSchema)
    .describe('The list of suggested features, including their name, description, category, and complexity.'),
});
export type SuggestDevPlanInput = z.infer<typeof SuggestDevPlanInputSchema>;

const GenkitPromptSuggestionSchema = z.object({
  featureName: z.string().describe("The name of the feature this prompt relates to."),
  suggestedPrompt: z.string().describe("A high-level conceptual starter Genkit prompt for implementing this feature with AI. This should be a natural language instruction for an AI model, not Genkit-specific code."),
});

const DevPlanPhaseSchema = z.object({
  phaseTitle: z.string().describe("Title of the development phase (e.g., 'Phase 1: Core Functionality & MVP', 'Sprint 2: User Profiles & Settings')."),
  phaseGoal: z.string().describe("A brief goal for this phase, explaining what will be achieved."),
  featuresToImplement: z.array(z.string()).describe("List of feature names (from the provided list of features) to be implemented in this phase. Refer to the complexities when assigning features."),
  estimatedDuration: z.string().describe("Estimated duration for this phase (e.g., '2-3 weeks', '1 month')."),
  genkitPromptSuggestions: z.array(GenkitPromptSuggestionSchema).optional().describe("Example conceptual Genkit prompts for AI-powered features in this phase. This should only be populated if there are relevant AI features in this phase."),
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
  prompt: `You are an expert Project Manager and Lead Developer. Your task is to create a high-level development plan and indicative calendar for a new application based on its description and a list of suggested features (including their complexities). You should also suggest how AI, using tools like Firebase Genkit, can be leveraged.

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
    *   For features within a phase that are categorized as 'AI-Powered' or could significantly benefit from AI (e.g., using Firebase Genkit), include **genkitPromptSuggestions**.
        *   Each suggestion in this list should have a 'featureName' (matching one from 'featuresToImplement') and a 'suggestedPrompt'.
        *   The 'suggestedPrompt' should be a high-level conceptual instruction for an AI model, suitable as a starting point for a developer to write a Genkit prompt. For example, for a feature 'AI-powered story generation', a suggestedPrompt might be: 'Generate a short story based on a user-provided theme and character names.'
        *   **Crucially, do NOT include Genkit-specific code syntax like 'ai.definePrompt(...)' or 'z.object(...)' in the 'suggestedPrompt'. It should be a plain, natural language instruction for the AI's task.** Only include this 'genkitPromptSuggestions' array if there are relevant AI features in the phase.
4.  **overallTimeline**: A summary of the total estimated project timeline.
5.  **recommendations**: At least 2-3 key recommendations or strategic considerations for development (e.g., "Prioritize building a robust user authentication system early," "Consider user testing after Phase 1 to gather feedback on core features," "For AI features, ensure data privacy and ethical considerations are addressed from the start. Evaluate Firebase Genkit for rapid AI feature prototyping.").

Ensure the output strictly adheres to the defined schema.
If no AI-powered features are suitable for Genkit prompt suggestions in a phase, omit the 'genkitPromptSuggestions' field for that phase.
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

