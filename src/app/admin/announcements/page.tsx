// app/admin/announcements/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';

export default function AnnouncementManagerPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ headline: '', body: '' });

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/admin/announcements'); 
    if (res.ok) {
      setAnnouncements(await res.json());
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Announcement posted successfully!');
      setFormData({ headline: '', body: '' }); // Clear form
      fetchAnnouncements(); // Refresh list
    } else {
      const error = await res.json();
      alert(`Error posting announcement: ${error.error}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Announcements & News Manager</h2>
      
      {/* 1. New Announcement Form */}
      <div className="bg-white p-6 shadow rounded-lg mb-8">
        <h3 className="text-xl font-medium mb-4">Post New Headline</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="headline" 
            placeholder="Headline (Visible on Homepage)" 
            value={formData.headline} 
            onChange={(e) => setFormData({...formData, headline: e.target.value})} 
            required 
            className="p-3 border rounded w-full"
          />
          <textarea 
            name="body" 
            placeholder="Full announcement body..." 
            value={formData.body} 
            onChange={(e) => setFormData({...formData, body: e.target.value})} 
            required 
            rows={4}
            className="p-3 border rounded w-full"
          />
          <button type="submit" className="bg-green-600 text-white p-3 rounded hover:bg-green-700 w-full">Post Announcement</button>
        </form>
      </div>

      {/* 2. Current Announcements List (Admin View) */}
      <h3 className="text-xl font-medium mb-4">Current Announcements</h3>
      {announcements.map((item: any) => (
        <div key={item.id} className="p-4 bg-white shadow rounded mb-2">
          <p className="font-bold">{item.headline}</p>
          <p className="text-sm text-gray-600">Posted: {new Date(item.created_at).toLocaleDateString()}</p>
          {/* TODO: Add Edit and Delete functionality here */}
        </div>
      ))}
    </div>
  );
}