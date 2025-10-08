// app/api/admin/ranking/route.ts
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/utils/auth';

// 1. READ: Get all ranked individuals (for the Admin List)
export async function GET() {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('top_individuals')
    .select('*')
    .order('rank', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch rankings.' }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 2. CREATE: Add a new individual to the ranking list
export async function POST(request: Request) {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { rank, display_name, profile_link, custom_stat } = await request.json();

  if (!rank || !display_name || !profile_link) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('top_individuals')
    .insert({ rank, display_name, profile_link, custom_stat });

  if (error) {
    return NextResponse.json({ error: 'Failed to create ranking entry.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Ranking entry created successfully.' }, { status: 201 });
}