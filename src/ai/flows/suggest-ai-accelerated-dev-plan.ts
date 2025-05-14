
'use server';

/**
 * @fileOverview AI-powered development plan optimized for AI-assisted coding,
 * providing suggested prompts for AI developer tools for each feature.
 *
 * - suggestAiAcceleratedDevPlan - A function that takes an app description and features,
 *   and returns a development plan assuming heavy use of AI developer tools.
 * - SuggestAiAcceleratedDevPlanInput - The input type for the function.
 * - SuggestAiAcceleratedDevPlanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FeatureDetail } from '@/ai/types';
import { FeatureDetailSchema } from '@/ai/types';

const SuggestAiAcceleratedDevPlanInputSchema = z.object({
  appDescription: z
    .string()
    .describe('The original description of the web or mobile application.'),
  features: z
    .array(FeatureDetailSchema)
    .describe('The list of suggested features, including their name, description, category, and complexity.'),
});
export type SuggestAiAcceleratedDevPlanInput = z.infer<typeof SuggestAiAcceleratedDevPlanInputSchema>;

const AiAcceleratedFeatureImplementationSchema = z.object({
  featureName: z.string().describe("The name of the feature from the provided list."),
  aiDevelopmentNotes: z.string().describe("Brief notes on how AI developer tools (e.g., in-IDE code assistants, UI generators) can specifically accelerate the implementation of this feature."),
  suggestedCodingAssistantPrompt: z.string().describe("A concrete, actionable prompt that a developer could give to an AI coding assistant (like Gemini in an IDE or GitHub Copilot) to help generate code, components, or logic for this specific feature. This is for development-time assistance, not a runtime Genkit prompt."),
});

const AiAcceleratedDevPlanPhaseSchema = z.object({
  phaseTitle: z.string().describe("Title of the development phase (e.g., 'Phase 1: AI-Assisted Core Setup & MVP')."),
  phaseGoal: z.string().describe("A brief goal for this phase, emphasizing AI-driven efficiency."),
  featuresToImplement: z.array(AiAcceleratedFeatureImplementationSchema).describe("List of features to be implemented in this phase, each with AI development notes and a coding assistant prompt."),
  estimatedDurationWithAiSupport: z.string().describe("Estimated duration for this phase, considering the acceleration provided by AI developer tools (e.g., '1-2 weeks', '3 sprints')."),
});

const SuggestAiAcceleratedDevPlanOutputSchema = z.object({
  projectName: z.string().describe("A suitable name for the project, consistent with the initial plan if available."),
  executiveSummary: z.string().describe("A brief 1-2 sentence executive summary of this AI-accelerated development plan, highlighting speed and modern tooling."),
  phases: z.array(AiAcceleratedDevPlanPhaseSchema).describe("An array of development phases, structured for AI-assisted development. Features should be grouped logically, and each should include AI-specific implementation guidance."),
  overallTimelineWithAiSupport: z.string().describe("A summary of the total estimated project timeline, reflecting AI-assisted efficiencies (e.g., 'Total estimated duration: 2-3 months with AI dev tools')."),
  generalAiToolingRecommendations: z.array(z.string()).describe("Key general recommendations for leveraging AI developer tools throughout the project (e.g., 'Utilize an in-IDE AI assistant for boilerplate code and unit tests', 'Explore AI-powered UI design tools for rapid prototyping', 'Employ Firebase Genkit for backend AI logic integration if applicable to features themselves'). Provide at least 2-3 distinct recommendations."),
});
export type SuggestAiAcceleratedDevPlanOutput = z.infer<typeof SuggestAiAcceleratedDevPlanOutputSchema>;


export async function suggestAiAcceleratedDevPlan(input: SuggestAiAcceleratedDevPlanInput): Promise<SuggestAiAcceleratedDevPlanOutput> {
  return suggestAiAcceleratedDevPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAiAcceleratedDevPlanPrompt',
  input: {schema: SuggestAiAcceleratedDevPlanInputSchema},
  output: {schema: SuggestAiAcceleratedDevPlanOutputSchema},
  prompt: `You are an expert Software Architect and Lead Developer specializing in AI-accelerated software development methodologies.
Your task is to create a high-level development plan for a new application, assuming the development team will heavily utilize AI developer tools (e.g., in-IDE code assistants like Gemini in IDE or GitHub Copilot, AI for UI generation, automated testing tools, etc.) to maximize speed and efficiency for implementing ALL features.

App Description:
{{{appDescription}}}

Previously Suggested Features (with name, description, category, complexity):
{{#each features}}
- Name: {{name}}
  Description: {{description}}
  Category: {{category}}
  Complexity: {{complexity}}
{{/each}}

Based on the above, provide the following in a structured format:

1.  **projectName**: A suitable name for the project (try to be consistent if a name was implied previously).
2.  **executiveSummary**: A brief 1-2 sentence executive summary for THIS AI-accelerated plan.
3.  **phases**: An array of development phases (aim for 2-4 phases).
    *   Each phase should have a phaseTitle, phaseGoal, estimatedDurationWithAiSupport (reflecting AI tool usage), and featuresToImplement.
    *   For each feature listed under featuresToImplement in a phase, you MUST provide:
        *   featureName: The exact name of the feature from the input list.
        *   aiDevelopmentNotes: Brief, practical notes (1-2 sentences) on *how* AI developer tools can specifically accelerate the development of *this* feature. (e.g., "Use AI code assistant to generate boilerplate for API endpoints," "Leverage AI UI generator for initial component structure").
        *   suggestedCodingAssistantPrompt: A concrete, actionable prompt a developer could directly use with an AI coding assistant (like Gemini in IDE, Copilot, or similar) to generate code, components, or logic for *this specific feature*. This is a prompt for *code generation during development*, not a runtime AI prompt (like for Genkit).
            Example prompt: "Generate a React functional component for a user login form with email and password fields using ShadCN UI components and Tailwind CSS. Include client-side validation for email format and password length."
            Another example: "Create a Python FastAPI GET endpoint at /items/{item_id} that retrieves an item from a PostgreSQL database table named 'products' using SQLAlchemy ORM."
    *   Logically group features into phases. Consider how AI tools might change the order or grouping compared to a traditional plan.
4.  **overallTimelineWithAiSupport**: A summary of the total estimated project timeline, explicitly stating it's with AI tool assistance.
5.  **generalAiToolingRecommendations**: At least 2-3 key, general recommendations for leveraging AI developer tools effectively throughout the project lifecycle (beyond specific feature prompts). Examples: "Adopt an AI pair programmer in your IDE for all developers to assist with code completion, refactoring, and documentation.", "Use AI-powered tools for generating initial unit test skeletons.", "Explore AI-driven project management tools for task breakdown and progress tracking."

Ensure the output strictly adheres to the defined schema. Focus on practical, actionable advice for a team embracing AI-assisted development.
The suggestedCodingAssistantPrompt should be specific enough to be useful.
`,
});

const suggestAiAcceleratedDevPlanFlow = ai.defineFlow(
  {
    name: 'suggestAiAcceleratedDevPlanFlow',
    inputSchema: SuggestAiAcceleratedDevPlanInputSchema,
    outputSchema: SuggestAiAcceleratedDevPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

