import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // Use a different variable name to avoid any potential scope conflicts
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { prompt, userId } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    prompt: `Generate marketing copy for: ${prompt}`,
  });

  const responseText = await result.text;

  // Use 'db' instead of 'supabase'
  const { error } = await db
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