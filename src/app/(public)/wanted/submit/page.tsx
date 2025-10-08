// app/(public)/wanted/submit/page.tsx
'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WantedSubmissionPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const target_name = formData.get('target_name') as string;
    const reason = formData.get('reason') as string;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to submit a wanted post.");
      setLoading(false);
      return;
    }
    
    // Insert into the wanted_posts table with default status 'pending'
    const { error } = await supabase
      .from('wanted_posts')
      .insert({
        submitted_by_id: user.id, // Links the post to the user
        target_name: target_name,
        reason: reason,
        // Status defaults to 'pending' as per your Supabase schema
      });

    setLoading(false);

    if (error) {
      alert(`Submission failed: ${error.message}`);
    } else {
      alert("Wanted post submitted! It will appear publicly after Admin review.");
      router.push('/');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Submit a Wanted Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg">
        <input 
          type="text" 
          name="target_name" 
          placeholder="Target Name/Handle" 
          required 
          className="p-3 border rounded w-full"
        />
        <textarea 
          name="reason" 
          placeholder="Detailed Reason for the Wanted Post" 
          required 
          rows={5}
          className="p-3 border rounded w-full"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-red-700 text-white p-3 rounded w-full hover:bg-red-800 disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}