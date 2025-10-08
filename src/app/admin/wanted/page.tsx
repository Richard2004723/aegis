// app/admin/wanted/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';

export default function WantedModerationPage() {
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);

  const fetchPendingPosts = async () => {
    // Calls the secure GET API route
    const res = await fetch('/api/admin/wanted'); 
    if (res.ok) {
      setPendingPosts(await res.json());
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const handleAction = async (postId: string, status: 'approved' | 'denied') => {
    const res = await fetch(`/api/admin/wanted/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      alert(`Post ${status} successfully!`);
      fetchPendingPosts(); // Refresh the list
    } else {
      const error = await res.json();
      alert(`Error performing action: ${error.error}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Wanted Section Moderation ({pendingPosts.length} pending)</h2>
      
      {pendingPosts.length === 0 ? (
        <p className="p-4 bg-green-100 rounded">No new posts require moderation. ✅</p>
      ) : (
        <div className="space-y-4">
          {pendingPosts.map((post) => (
            <div key={post.id} className="bg-white p-6 shadow rounded-lg border-l-4 border-yellow-500">
              <p className="font-bold text-lg">Target: {post.target_name}</p>
              <p className="text-sm text-gray-600 mb-3">Submitted by: {post.users ? post.users.username : 'Unknown User'}</p>
              <p className="whitespace-pre-line mb-4">{post.reason}</p>
              
              <div className="space-x-4">
                <button 
                  onClick={() => handleAction(post.id, 'approved')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve (Go Public)
                </button>
                <button 
                  onClick={() => handleAction(post.id, 'denied')}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Deny & Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}