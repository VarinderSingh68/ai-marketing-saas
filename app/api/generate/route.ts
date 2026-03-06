import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // Initialize INSIDE the function so it's defined
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  const { prompt, userId } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    prompt: `Generate marketing copy for: ${prompt}`,
  });

  const responseText = await result.text;

  // Now 'supabase' is defined and this will work
  const { error } = await supabase
    .from('posts')
    .insert([
      { 
        user_id: userId, 
        content: responseText, 
        created_at: new Date().toISOString() 
      }
    ]);

  // ... rest of your code
}