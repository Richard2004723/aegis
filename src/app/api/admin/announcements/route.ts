// app/api/admin/announcements/route.ts
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/utils/auth'; // Reuses your existing security check

// 1. READ: Get all announcements (Admin view)
export async function GET() {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch announcements.' }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 2. CREATE: Post a new announcement
export async function POST(request: Request) {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { headline, body } = await request.json();

  if (!headline || !body) {
    return NextResponse.json({ error: 'Missing headline or body content.' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('announcements')
    .insert({ headline, body });

  if (error) {
    return NextResponse.json({ error: 'Failed to post announcement.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Announcement posted successfully.' }, { status: 201 });
}