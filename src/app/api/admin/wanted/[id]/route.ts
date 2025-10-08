import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkAdminRole } from "@/lib/utils/auth";

// GET one post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { id } = params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("wanted_posts")
    .select("*, submitted_by:users!submitted_by_id(username)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to fetch post." }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST update post status (approve/deny)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { id } = params;
  const { status } = await request.json();

  if (!["approved", "denied"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("wanted_posts")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update post status." }, { status: 500 });
  }

  return NextResponse.json({ message: `Post ${id} successfully ${status}.` });
}
