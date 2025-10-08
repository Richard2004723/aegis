// app/api/admin/wanted/[id]/route.ts
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/utils/auth';

// Handles POST to approve or deny a post
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { status } = await request.json(); // Expected: "approved" or "denied"
  const postId = params.id;

  if (status !== 'approved' && status !== 'denied') {
    return NextResponse.json({ error: 'Invalid status provided.' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  
  // Update the status of the specific wanted post
  const { error } = await supabase
    .from('wanted_posts')
    .update({ status: status })
    .eq('id', postId);

  if (error) {
    return NextResponse.json({ error: 'Failed to update post status.' }, { status: 500 });
  }

  // If denied, we can optionally delete the post entirely instead of setting status 'denied'
  // If (status === 'denied') { await supabase.from('wanted_posts').delete().eq('id', postId); }
  
  return NextResponse.json({ message: `Post successfully ${status}.` });
}

// Handles GET to fetch all pending wanted posts
export async function GET() {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  
  // Fetch only posts where status is 'pending'
  const { data, error } = await supabase
    .from('wanted_posts')
    .select('*, users(username)') // Fetch the submitted_by_user's username
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch pending posts.' }, { status: 500 });
  }
  
  return NextResponse.json(data);
}