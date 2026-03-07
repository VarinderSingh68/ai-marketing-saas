import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, tone } = await req.json();

  const result = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    prompt: `Write a marketing post about: ${prompt}. The tone should be: ${tone}.`,
  });

  // This is the correct method for the current version of the AI SDK
  return result.toDataStreamResponse();
}