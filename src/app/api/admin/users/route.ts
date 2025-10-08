// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/utils/auth';

// GET: Fetch all users (Admin view)
export async function GET() {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, role, created_at');

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST/PUT: Update a user's role (or other fields)
export async function POST(request: Request) {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { user_id, new_role } = await request.json();

  if (!user_id || !['user', 'admin'].includes(new_role)) {
    return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('users')
    .update({ role: new_role })
    .eq('id', user_id);

  if (error) {
    return NextResponse.json({ error: 'Failed to update user role.' }, { status: 500 });
  }
  
  return NextResponse.json({ message: `User ${user_id} role updated to ${new_role}.` });
}