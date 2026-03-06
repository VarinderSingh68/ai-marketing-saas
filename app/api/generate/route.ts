import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    prompt: prompt,
  });

  // Use toTextStreamResponse for simple text generation
  return result.toTextStreamResponse();
}