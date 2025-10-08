// app/api/admin/wanted/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkAdminRole } from "@/lib/utils/auth";

export async function GET(request: NextRequest) {
  const { isAdmin, error: authError } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("wanted_posts")
    .select("*, submitted_by:users!submitted_by_id(username)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch pending posts." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
