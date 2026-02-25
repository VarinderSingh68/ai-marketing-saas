import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt, tone } = await req.json(); // Catch the tone here

  const result = await streamText({
    model: google('gemini-2.0-flash'),
    prompt: `Write a ${tone} social media post about: ${prompt}. Use appropriate emojis.`,
  });

  return result.toDataStreamResponse();
}