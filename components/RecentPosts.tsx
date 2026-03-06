import { createClient } from '@/utils/supabase/server'; 

export default async function RecentPosts() {
  const supabase = await createClient();
  
  // Try-Catch block to catch database connection errors
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error("Supabase Error:", error.message);
      return <p className="text-red-500">Error loading your history.</p>;
    }

    if (!posts || posts.length === 0) {
      return <p>No posts found. Generate your first one!</p>;
    }

    return (
      <div className="space-y-4 mt-10">
        <h2 className="text-xl font-bold">Your Recent Generations</h2>
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <p className="text-gray-800">{post.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    );
  } catch (err) {
    return <p>Database unreachable.</p>;
  }
}