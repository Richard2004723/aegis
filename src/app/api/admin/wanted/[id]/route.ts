import { NextResponse, NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/utils/auth';

// Define the expected context type for dynamic segments
interface RouteContext {
    params: {
        id: string;
    };
}

// 1. Handles POST to approve or deny a specific post (e.g., /api/admin/wanted/post-id)
// FIX: Changed 'request: Request' to 'request: NextRequest' and used the context parameter correctly.
export async function POST(request: NextRequest, context: RouteContext) {
    const { isAdmin, error: authError } = await checkAdminRole();
    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 403 });
    }

    const { status } = await request.json(); // Expected: "approved" or "denied"
    const postId = context.params.id; // Correctly accessing the ID from context

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


// 2. Handles GET to fetch all PENDING wanted posts
// NOTE: This route should ideally not be dynamic, but since it's located in the [id] folder, 
// we must accept the parameter and fetch the pending list (not based on ID).
// We primarily use this route to fetch the list of *all* pending posts for the admin UI.
// FIX: Added NextRequest and context to the signature to resolve the type error.
export async function GET(request: NextRequest, context: RouteContext) {
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