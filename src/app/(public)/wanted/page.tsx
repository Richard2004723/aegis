// app/(public)/wanted/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Server Component to fetch APPROVED wanted posts
async function fetchApprovedWantedPosts() {
  const supabase = createServerSupabaseClient();
  
  // RLS allows public SELECT only on posts where status = 'approved'
  const { data, error } = await supabase
    .from('wanted_posts')
    .select('target_name, reason, created_at')
    .order('created_at', { ascending: false }); 

  if (error) {
    console.error('Error fetching approved posts:', error);
    return [];
  }
  return data;
}

export default async function PublicWantedPage() {
  const posts = await fetchApprovedWantedPosts();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-red-700 text-center">Aegis Wanted Board 🚨</h1>
      
      <p className="text-center text-sm text-gray-600 mb-8">
        These posts have been reviewed and approved by Aegis Administration. To submit a post, use the "Submit" link.
      </p>

      {posts.length === 0 ? (
        <p className="text-center p-6 bg-gray-100 rounded">The board is currently clear.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post: any) => (
            <div key={post.created_at} className="bg-white p-6 shadow-xl rounded-lg border-l-4 border-red-700">
              <h2 className="text-2xl font-semibold mb-2">WANTED: {post.target_name}</h2>
              <p className="text-sm text-gray-500 mb-4">Posted: {new Date(post.created_at).toLocaleDateString()}</p>
              <p className="whitespace-pre-line">{post.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}