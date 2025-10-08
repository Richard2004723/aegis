// lib/actions/auth.ts (or an API route, e.g., /api/auth/profile)
'use server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function createProfile({ userId, username, email }: { userId: string, username: string, email: string }) {
  const supabase = createServerSupabaseClient(); // Uses cookie/session data

  // IMPORTANT: Use the SERVICE ROLE KEY client here if this logic were in a separate file, 
  // to ensure data is inserted even before the user confirms their email.
  // For simplicity, we use the server client here, but ensure the RLS policy allows authenticated INSERT.

  const { error } = await supabase
    .from('users')
    .insert({
      id: userId,
      username: username,
      email: email,
      // Role defaults to 'user'—only manually changed by Admin
      role: 'user', 
    });

  return error;
}