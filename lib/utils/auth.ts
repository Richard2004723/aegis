// lib/utils/auth.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function checkAdminRole(): Promise<{ isAdmin: boolean, error?: string }> {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, error: 'User not authenticated.' };
  }

  // Fetch the user's role from your custom 'users' table
  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Database error fetching user role:', error);
    return { isAdmin: false, error: 'Database lookup failed.' };
  }
  
  if (userData?.role !== 'admin') {
    return { isAdmin: false, error: 'Permission denied: Not an Admin.' };
  }

  return { isAdmin: true, error: undefined };
}