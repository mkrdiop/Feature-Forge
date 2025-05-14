'use server';
/**
 * @fileOverview AI-powered user persona generation for app ideas.
 *
 * - suggestUserPersonas - A function that takes an app description and returns a list of user personas.
 * - SuggestUserPersonasInput - The input type for the suggestUserPersonas function.
 * - SuggestUserPersonasOutput - The return type for the suggestUserPersonas function.
 * - UserPersonaSchema - The Zod schema for a single user persona.
 * - UserPersona - The TypeScript type for a single user persona.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUserPersonasInputSchema = z.object({
  appDescription: z
    .string()
    .describe('A description of the web or mobile application idea.'),
});
export type SuggestUserPersonasInput = z.infer<typeof SuggestUserPersonasInputSchema>;

const UserPersonaSchema = z.object({
  personaName: z.string().describe('A creative and descriptive name for the persona (e.g., "Tech-Savvy Tina", "Busy Parent Ben").'),
  ageRange: z.string().describe('An estimated age range for this persona (e.g., "25-35", "40-55").'),
  occupation: z.string().describe('The primary occupation or role of this persona (e.g., "Software Engineer", "Marketing Manager", "Stay-at-home Parent").'),
  briefBio: z.string().describe('A short, 1-2 paragraph narrative biography describing the persona, their lifestyle, and relevant background.'),
  keyGoals: z.array(z.string()).describe('A list of 2-4 key goals this persona hopes to achieve by using an application like the one described. These should be specific to the app concept.'),
  painPoints: z.array(z.string()).describe('A list of 2-4 pain points or frustrations this persona currently experiences with existing solutions or the lack thereof, related to the app\'s domain.'),
  motivationsForUsingApp: z.array(z.string()).describe('A list of 2-4 key motivations or reasons why this persona would be attracted to and use the described application. Focus on benefits and value propositions.'),
  techSavviness: z.enum(['Low', 'Medium', 'High']).describe('The general level of comfort and expertise this persona has with technology.'),
});
export type UserPersona = z.infer<typeof UserPersonaSchema>;

const SuggestUserPersonasOutputSchema = z.object({
  personas: z
    .array(UserPersonaSchema)
    .describe('A list of 2-3 distinct user personas relevant to the described application.'),
});
export type SuggestUserPersonasOutput = z.infer<typeof SuggestUserPersonasOutputSchema>;

export async function suggestUserPersonas(input: SuggestUserPersonasInput): Promise<SuggestUserPersonasOutput> {
  return suggestUserPersonasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUserPersonasPrompt',
  input: {schema: SuggestUserPersonasInputSchema},
  output: {schema: SuggestUserPersonasOutputSchema},
  prompt: `You are an expert UX Researcher and Product Strategist. Your task is to generate 2-3 distinct user personas based on the provided application description. These personas should help in understanding the target audience and guiding product development.

For each persona, you MUST provide:
1.  "personaName": A creative and descriptive name (e.g., "Eco-Conscious Emily", "Freelancer Frank").
2.  "ageRange": An estimated age range (e.g., "18-24", "35-50").
3.  "occupation": Their primary occupation or role.
4.  "briefBio": A short narrative (1-2 paragraphs) describing their lifestyle, background, values, and how they might interact with technology or products in the app's domain.
5.  "keyGoals": An array of 2-4 specific goals they aim to achieve by using an app like the one described. These should be actionable and related to the app's potential functionality.
6.  "painPoints": An array of 2-4 frustrations or problems they currently face that the app could solve. These should be specific and highlight unmet needs.
7.  "motivationsForUsingApp": An array of 2-4 key reasons or benefits that would compel them to use the described app.
8.  "techSavviness": Their general comfort level with technology, strictly as "Low", "Medium", or "High".

Application Description:
{{{appDescription}}}

Return the personas as an array under the "personas" key, strictly adhering to the defined output schema. Ensure the personas are diverse enough to represent different segments of potential users.
`,
});

const suggestUserPersonasFlow = ai.defineFlow(
  {
    name: 'suggestUserPersonasFlow',
    inputSchema: SuggestUserPersonasInputSchema,
    outputSchema: SuggestUserPersonasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
