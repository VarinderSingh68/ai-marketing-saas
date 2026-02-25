"use server"
import { createClient } from "@/utils/supabase";
import { auth } from "@clerk/nextjs/server"; // Import Clerk Auth

export async function savePostToDatabase(content: string, tone: string) {
  const { userId } = await auth(); // Get the ID of the logged-in user
  
  if (!userId) throw new Error("Unauthorized");

  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .insert([{ 
        content, 
        tone, 
        user_id: userId // Save the user ID with the post
    }]);

  return { success: !error };
}