"use server";

import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function savePostToDatabase(content: string, tone: string) {
  // 1. Get the current user from Clerk
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  // 2. Initialize the Supabase server client
  const supabase = await createClient();

  // 3. Insert the data into your 'posts' table
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        user_id: userId,
        content: content,
        tone: tone,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Database Insert Error:", error);
    return { error: "Failed to save to database" };
  }

  return { success: true, data };
}