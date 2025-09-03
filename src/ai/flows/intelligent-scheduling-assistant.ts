'use server';

/**
 * @fileOverview An AI-powered scheduling assistant flow.
 *
 * - intelligentSchedulingAssistant - A function that suggests optimal class times.
 * - IntelligentSchedulingAssistantInput - The input type for the intelligentSchedulingAssistant function.
 * - IntelligentSchedulingAssistantOutput - The return type for the intelligentSchedulingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentSchedulingAssistantInputSchema = z.object({
  professorAvailability: z
    .string()
    .describe('The availability of the professor for scheduling.'),
  resourceAllocation: z
    .string()
    .describe('Information about available classrooms and resources.'),
  classRequirements: z
    .string()
    .describe('Specific requirements for the class, such as duration and frequency.'),
});

export type IntelligentSchedulingAssistantInput = z.infer<
  typeof IntelligentSchedulingAssistantInputSchema
>;

const IntelligentSchedulingAssistantOutputSchema = z.object({
  suggestedSchedule: z
    .string()
    .describe('The suggested optimal schedule for the class.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested schedule.'),
});

export type IntelligentSchedulingAssistantOutput = z.infer<
  typeof IntelligentSchedulingAssistantOutputSchema
>;

export async function intelligentSchedulingAssistant(
  input: IntelligentSchedulingAssistantInput
): Promise<IntelligentSchedulingAssistantOutput> {
  return intelligentSchedulingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSchedulingAssistantPrompt',
  input: {schema: IntelligentSchedulingAssistantInputSchema},
  output: {schema: IntelligentSchedulingAssistantOutputSchema},
  prompt: `You are an AI scheduling assistant that is responsible for scheduling classes.

  Consider the following information to generate an optimal class schedule.

  Professor Availability: {{{professorAvailability}}}
  Resource Allocation: {{{resourceAllocation}}}
  Class Requirements: {{{classRequirements}}}

  Based on this information, suggest an optimal schedule and explain your reasoning.
  `,
});

const intelligentSchedulingAssistantFlow = ai.defineFlow(
  {
    name: 'intelligentSchedulingAssistantFlow',
    inputSchema: IntelligentSchedulingAssistantInputSchema,
    outputSchema: IntelligentSchedulingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
