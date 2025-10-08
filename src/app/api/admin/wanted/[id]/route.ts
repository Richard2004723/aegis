import { NextResponse, NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/utils/auth';

// Define the arguments structure for clarity, but use the simplified signature below
interface RouteContext {
    params: {
        id: string;
    };
}

// 1. Handles POST to approve or deny a specific post
export async function POST(
    request: NextRequest, 
    context: RouteContext // Keep the simple context type for internal use
) {
    const { isAdmin, error: authError } = await checkAdminRole();
    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 403 });
    }

    const { status } = await request.json(); 
    const postId = context.params.id; // Access the ID from context.params

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
// We must disable the unused variable warning here since Next.js requires these arguments.
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(
    request: NextRequest, 
    context: RouteContext // Final fix: Use the custom interface for internal consistency
) {
    const { isAdmin, error: authError } = await checkAdminRole();
    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 403 });
    }

    // This route does not use context.params.id, but the signature must be correct.
    const supabase = createServerSupabaseClient();
    
    // Fetch only posts where status is 'pending'
    const { data, error } = await supabase
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