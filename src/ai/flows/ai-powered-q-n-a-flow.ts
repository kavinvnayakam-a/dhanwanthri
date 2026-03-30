'use server';
/**
 * @fileOverview An AI agent for answering questions about the clinic's services based on provided content.
 *
 * - aiPoweredQnA - A function that handles the AI-powered Q&A process.
 * - AIPoweredQnAInput - The input type for the aiPoweredQnA function.
 * - AIPoweredQnAOutput - The return type for the aiPoweredQnA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredQnAInputSchema = z.object({
  question: z.string().describe('The user\'s question about the clinic\'s services or treatments.'),
  websiteContent: z.string().describe('The extensive content from the website to be used as the knowledge base for answering the question.'),
});
export type AIPoweredQnAInput = z.infer<typeof AIPoweredQnAInputSchema>;

const AIPoweredQnAOutputSchema = z.object({
  answer: z.string().describe('A concise and accurate answer to the user\'s question, strictly based on the provided website content.'),
});
export type AIPoweredQnAOutput = z.infer<typeof AIPoweredQnAOutputSchema>;

export async function aiPoweredQnA(input: AIPoweredQnAInput): Promise<AIPoweredQnAOutput> {
  return aiPoweredQnAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredQnAPrompt',
  input: {schema: AIPoweredQnAInputSchema},
  output: {schema: AIPoweredQnAOutputSchema},
  prompt: `You are a helpful assistant for Dhanwanthri Healing. Your task is to answer user questions about the clinic\'s services, treatments, or specific conditions.
You MUST ONLY use the provided website content to formulate your answer. Do not use any external knowledge.
If the answer is not explicitly available in the provided content, state that you cannot find the answer in the given information.
Keep the answer concise and accurate.

Website Content:
{{{websiteContent}}}

User Question:
{{{question}}}

Answer:`,
});

const aiPoweredQnAFlow = ai.defineFlow(
  {
    name: 'aiPoweredQnAFlow',
    inputSchema: AIPoweredQnAInputSchema,
    outputSchema: AIPoweredQnAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
