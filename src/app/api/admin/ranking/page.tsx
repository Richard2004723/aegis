// app/admin/ranking/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function RankingManagerPage() {
  const [rankings, setRankings] = useState([]);
  const [formData, setFormData] = useState({ 
      rank: '', 
      display_name: '', 
      profile_link: '', 
      custom_stat: '' 
  });

  const fetchRankings = async () => {
    // This calls your secure GET API route
    const res = await fetch('/api/admin/ranking'); 
    if (res.ok) {
      setRankings(await res.json());
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Rank added successfully!');
      fetchRankings(); // Refresh list
    } else {
      const error = await res.json();
      alert(`Error: ${error.error}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Manual Top Individuals Manager</h2>
      
      {/* 1. Add New Rank Form */}
      <div className="bg-white p-6 shadow rounded-lg mb-8">
        <h3 className="text-xl font-medium mb-4">Add New Individual</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4">
          <input 
            type="number" 
            name="rank" 
            placeholder="Rank #" 
            value={formData.rank} 
            onChange={(e) => setFormData({...formData, rank: e.target.value})} 
            required 
            className="p-2 border rounded"
          />
          {/* ... Add other input fields for display_name, profile_link, custom_stat ... */}
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Rank</button>
        </form>
      </div>

      {/* 2. Current Ranking List (Read) */}
      <h3 className="text-xl font-medium mb-4">Current Top Individuals</h3>
      <ul className="space-y-2">
        {rankings.map((item: any) => (
          <li key={item.id} className="flex justify-between items-center p-3 bg-white shadow rounded">
            <span>#{item.rank} - {item.display_name} ({item.custom_stat})</span>
            {/* TODO: Add Edit and Delete buttons here */}
          </li>
        ))}
      </ul>
    </div>
  );
}