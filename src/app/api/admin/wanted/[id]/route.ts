import { NextResponse, NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/utils/auth';

// Fix: Use the standard Next.js type structure for dynamic handlers
interface RouteContext {
    params: {
        id: string;
    };
}

// 1. Handles POST to approve or deny a specific post
export async function POST(request: NextRequest, context: RouteContext) {
    const { isAdmin, error: authError } = await checkAdminRole();
    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 403 });
    }

    const { status } = await request.json(); 
    const postId = context.params.id; 

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
// FINAL FIX: We disable the unused variable warning here since Next.js requires these arguments.
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(request: NextRequest, context: RouteContext) {
    const { isAdmin, error: authError } = await checkAdminRole();
    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 403 });
    }

    const supabase = createServerSupabaseClient();
    
    // Fetch only posts where status is 'pending'
    const { data, error } = await supabase
        // Fix: Select the submitted_by_id and link it to the username from the 'users' table
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