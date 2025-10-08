// app/(public)/leaderboard/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';

async function fetchTopIndividuals() {
  const supabase = createServerSupabaseClient();
  // RLS allows public SELECT here
  const { data, error } = await supabase
    .from('top_individuals')
    .select('rank, display_name, profile_link, custom_stat')
    .order('rank', { ascending: true }); // Ordered by your manual rank

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return data;
}

export default async function LeaderboardPage() {
  const individuals = await fetchTopIndividuals();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Aegis Top Individuals Ranking 🏆</h1>
      
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Showcase Stat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {individuals.map((person, index) => (
              <tr key={index} className={index < 3 ? 'bg-yellow-50 font-semibold' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                    {person.rank} {index === 0 && '🥇'} {index === 1 && '🥈'} {index === 2 && '🥉'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{person.display_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.custom_stat || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={person.profile_link} target="_blank" className="text-indigo-600 hover:text-indigo-900">
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}