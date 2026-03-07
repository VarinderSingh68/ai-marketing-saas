import { StreamingTextResponse, streamText } from 'ai';
// ... other imports

export async function POST(req: Request) {
  const { prompt, tone } = await req.json();

  const result = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    prompt: `Write a marketing post about: ${prompt}. The tone should be: ${tone}.`,
  });

  // Use this instead if toDataStreamResponse() is causing an error
  return new StreamingTextResponse(result.toAIStream());
}