import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, tone } = await req.json();

  try {
    const result = await streamText({
      // Use the standard model identifier provided by the SDK
      model: google('gemini-1.5-flash'),
      prompt: `Write a marketing post about: ${prompt}. The tone should be: ${tone}.`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Generation Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate content" }), { 
      status: 500 
    });
  }
}