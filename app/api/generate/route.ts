import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
export const runtime = 'edge';
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    prompt: prompt,
  });

  // Example: Saving to Supabase after getting AI response
  const { data, error } = await supabase
    .from('posts')
    .insert([
    { 
      user_id: userId, 
      content: generatedContent, 
      created_at: new Date().toISOString() 
    }
  ]);

  // Use toTextStreamResponse for simple text generation
  return result.toTextStreamResponse();
}