import { NextResponse, NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/utils/auth';

// 1. Handles POST to approve or deny a specific post
export async function POST(
    request: NextRequest, 
    { params }: { params: { id: string } } // FIX: Use destructuring for simple, clean access
) {
    const { isAdmin, error: authError } = await checkAdminRole();
    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 403 });
    }

    const { status } = await request.json(); 
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

    return NextResponse.json({ message: `Post successfully ${status}.` });
}


// 2. Handles GET to fetch all PENDING wanted posts
// FIX: Using destructuring { params } satisfies the compiler's requirements.
// The 'request' parameter is unused here, so we disable the warning for clean deployment.
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(
    request: NextRequest, 
    { params }: { params: { id: string } }
) {
    const { isAdmin, error: authError } = await checkAdminRole();
    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 403 });
    }

    const supabase = createServerSupabaseClient();
    
    // Fetch only posts where status is 'pending'
    const { data, error } = await supabase
        // The column alias for linking the username:
        .from('wanted_posts')
        .select('*, submitted_by:users!submitted_by_id(username)') 
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch pending posts.' }, { status: 500 });
    }
    
    return NextResponse.json(data);
}
/* eslint-enable @typescript-eslint/no-unused-vars */