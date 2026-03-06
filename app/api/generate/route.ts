import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // 1. Initialize the client inside the function
  // Ensure SUPABASE_SERVICE_ROLE_KEY is added in Vercel Environment Variables
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { prompt, userId } = await req.json();

  // 2. Generate content
  const result = await streamText({
    model: google('gemini-1.5-flash'),
    prompt: `Generate marketing copy for: ${prompt}`,
  });

  const responseText = await result.text;

  // 3. Now 'supabase' is defined and accessible here
  const { error } = await supabase
    .from('posts')
    .insert([
      { 
        user_id: userId, 
        content: responseText, 
        created_at: new Date().toISOString() 
      }
    ]);

  if (error) {
    console.error("Supabase Save Error:", error);
    return new Response(JSON.stringify({ error: 'Database save failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({ text: responseText }));
}