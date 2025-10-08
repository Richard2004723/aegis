// app/(protected)/dashboard/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createListing, deleteListing } from '@/lib/actions/product'; 
import CreateListingForm from '@/components/marketplace/CreateListingForm'; // FIX: Missing import

// Server Component to fetch the user's listings
async function fetchUserListings(userId: string) {
  const supabase = createServerSupabaseClient();
  // RLS ensures only the user's products are returned
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', userId) // Explicit filter for safety/efficiency
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching user listings:', error);
    return [];
  }
  return data;
}

export default async function UserDashboard() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Middleware should handle this, but it's a good safety fallback
    return <div>Redirecting to login...</div>;
  }

  const listings = await fetchUserListings(user.id);
  
  // Client component for the form and interactive parts
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}!</h1>
      <h2 className="text-2xl font-semibold mb-4">Your Product Listings</h2>
      
      <CreateListingForm />

      {/* Display Current Listings */}
      <div className="space-y-4 mt-8">
        {listings.map((product: any) => (
          <div key={product.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
            <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover mr-4" />
            <div className="flex-1">
                <p className="font-bold">{product.name} - {product.price}</p>
                <p className="text-sm text-gray-500">Contact: {product.contact_info.whatsapp}</p>
            </div>
            {/* Using a server action directly in the button for deletion */}
            <form action={deleteListing.bind(null, product.id)}>
                <button type="submit" className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

// TODO: Create a separate 'use client' component (CreateListingForm) 
// to handle the form inputs and call the createListing Server Action.