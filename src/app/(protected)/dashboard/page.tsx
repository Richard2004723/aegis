/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/dashboard/page.tsx

import { createServerSupabaseClient } from '@/lib/supabase/server';
// FIX: Only import deleteListing, as createListing is used in the child component.
import { deleteListing } from '@/lib/actions/product'; 
import CreateListingForm from '@/components/marketplace/CreateListingForm';
// FIX: Need to import the Next.js Image component
import Image from 'next/image'; 

// Server Component to fetch the user's listings
async function fetchUserListings(userId: string) {
// ... (fetchUserListings function remains the same)
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
    return <div>Redirecting to login...</div>;
  }

  const listings = await fetchUserListings(user.id);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}!</h1>
      <h2 className="text-2xl font-semibold mb-4">Your Product Listings</h2>
      
      <CreateListingForm />

      {/* Display Current Listings */}
      <div className="space-y-4 mt-8">
        {listings.map((product: any) => (
          <div key={product.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
            {/* FIX: Use the optimized Image component */}
            <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                <Image 
                    src={product.image_url} 
                    alt={product.name} 
                    fill 
                    className="object-cover rounded" 
                    sizes="(max-width: 768px) 100vw, 50vw" // Add necessary sizing props
                />
            </div>
            
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