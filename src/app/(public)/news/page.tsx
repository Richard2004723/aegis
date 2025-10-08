// app/(public)/news/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Server Component for fetching public data
async function fetchPublicAnnouncements() {
  const supabase = createServerSupabaseClient();
  // RLS allows public SELECT here
  const { data, error } = await supabase
    .from('announcements')
    .select('headline, body, created_at') 
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching public news:', error);
    return [];
  }
  return data;
}

export default async function NewsPage() {
  const announcements = await fetchPublicAnnouncements();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Aegis News Center</h1>
      {announcements.length === 0 ? (
        <p>No official announcements available at this time.</p>
      ) : (
        <div className="space-y-8">
          {announcements.map((item: any) => (
            <div key={item.created_at} className="bg-white p-6 shadow-md rounded-lg border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold mb-2">{item.headline}</h2>
              <p className="text-sm text-gray-500 mb-4">Posted: {new Date(item.created_at).toLocaleDateString()}</p>
              <p className="whitespace-pre-line">{item.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}