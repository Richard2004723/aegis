import { NextResponse, NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkAdminRole } from "@/lib/utils/auth";

interface RouteContext {
  params: { id: string };
}

// Update a post’s status
export async function POST(request: NextRequest, context: RouteContext) {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { status } = await request.json();
  const postId = context.params.id;

  if (status !== "approved" && status !== "denied") {
    return NextResponse.json(
      { error: "Invalid status provided." },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("wanted_posts")
    .update({ status })
    .eq("id", postId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update post status." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: `Post successfully ${status}.` });
}

// Fetch a single post by ID
export async function GET(request: NextRequest, context: RouteContext) {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const postId = context.params.id;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("wanted_posts")
    .select("*, submitted_by:users!submitted_by_id(username)")
    .eq("id", postId)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch post." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
