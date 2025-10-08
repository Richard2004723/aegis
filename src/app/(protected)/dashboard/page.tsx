/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/dashboard/page.tsx

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteListing } from '@/lib/actions/product'; 
import CreateListingForm from '@/components/marketplace/CreateListingForm';
import Image from 'next/image'; 
// ... (fetchUserListings function remains the same)

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
            
            {/* Image Component */}
            <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                <Image 
                    src={product.image_url} 
                    alt={product.name} 
                    fill 
                    className="object-cover rounded" 
                    sizes="(max-width: 768px) 100vw, 50vw" 
                />
            </div>
            
            <div className="flex-1">
                <p className="font-bold">{product.name} - {product.price}</p>
                <p className="text-sm text-gray-500">Contact: {product.contact_info.whatsapp}</p>
            </div>
            
            {/* Using a server action directly in the button for deletion */}
            {/* FIX: Use @ts-expect-error syntax */}
            {/* @ts-expect-error Server Action return type mismatch is expected here */}
            <form action={deleteListing.bind(null, product.id)}>
                <button type="submit" className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}