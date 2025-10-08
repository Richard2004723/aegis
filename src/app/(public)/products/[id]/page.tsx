// app/(public)/products/[id]/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Server Component to fetch the product details
async function fetchProduct(productId: string) {
  const supabase = createServerSupabaseClient();
  // RLS allows public SELECT here
  const { data: product, error } = await supabase
    .from('products')
    .select('name, description, price, image_url, contact_info, created_at, seller_id')
    .eq('id', productId)
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error);
    return null;
  }
  return product;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);

  if (!product) {
    notFound(); // Display a Next.js 404 page if the product isn't found
  }

  const contact = product.contact_info as { whatsapp?: string, instagram?: string, telegram?: string };
  
  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-96 w-full">
            <Image 
                src={product.image_url} 
                alt={product.name} 
                fill 
                className="object-cover rounded-lg"
            />
        </div>

        {/* Product Details and Contact */}
        <div>
          <h1 className="text-4xl font-extrabold mb-2">{product.name}</h1>
          <p className="text-2xl text-green-600 font-semibold mb-6">{product.price}</p>
          
          <h2 className="text-xl font-bold border-b pb-1 mb-3">Description</h2>
          <p className="text-gray-700 mb-8">{product.description}</p>

          <h2 className="text-xl font-bold border-b pb-1 mb-3">Contact Seller</h2>
          <p className="mb-4 text-sm text-gray-600">Contact the seller directly using one of the methods below:</p>
          
          <div className="space-y-3">
            {contact.whatsapp && (
                <Link href={`https://wa.me/${contact.whatsapp}`} target="_blank" className="flex items-center bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition">
                    💬 Contact via WhatsApp
                </Link>
            )}
            {contact.instagram && (
                <Link href={`https://instagram.com/${contact.instagram}`} target="_blank" className="flex items-center bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition">
                    📸 Contact via Instagram
                </Link>
            )}
            {contact.telegram && (
                <Link href={`https://t.me/${contact.telegram}`} target="_blank" className="flex items-center bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">
                    ✈️ Contact via Telegram
                </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}