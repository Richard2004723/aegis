import { NextResponse, NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/utils/auth';

// CRITICAL FIX: Define the context with a Promise-wrapped params to satisfy the compiler bug.
interface RouteContext {
    params: Promise<{ id: string }>; 
}

// 1. Handles POST to approve or deny a specific post
export async function POST(
    request: NextRequest, 
    context: RouteContext 
) {
    const { isAdmin, error: authError } = await checkAdminRole();
    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 403 });
    }

    const { status } = await request.json(); 
    const { id: postId } = await context.params; // FIX: Must AWAIT context.params
    
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

    return NextResponse.json({ message: `Post successfully ${status}.` });
}


// 2. Handles GET for a specific post (ID-based fetch)
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(
    request: NextRequest, 
    context: RouteContext // Using Promise-wrapped type here
) {
    const { isAdmin, error: authError } = await checkAdminRole();
    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 403 });
    }

    const { id: postId } = await context.params; // FIX: Must AWAIT context.params
    const supabase = createServerSupabaseClient();
    
    // Fetch a SINGLE post by ID
    const { data, error } = await supabase
        .from('wanted_posts')
        .select('*, submitted_by:users!submitted_by_id(username)')
        .eq('id', postId)
        .single(); 

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch post.' }, { status: 500 });
    }
    
    return NextResponse.json(data);
}
/* eslint-enable @typescript-eslint/no-unused-vars */