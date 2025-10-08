// lib/actions/product.ts
'use server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid'; // Use a UUID generator for unique file names

// 1. UPLOAD IMAGE AND CREATE LISTING
export async function createListing(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Authentication required.' };
  }
  
  const imageFile = formData.get('image') as File;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  
  // Extract contact info
  const contact_whatsapp = formData.get('contact_whatsapp') as string;
  const contact_instagram = formData.get('contact_instagram') as string;
  const contact_telegram = formData.get('contact_telegram') as string;

  // 1. Upload Image to Supabase Storage
  const fileExt = imageFile.name.split('.').pop();
  const filePath = `${user.id}/${uuidv4()}.${fileExt}`; // e.g., userId/uniqueId.jpg

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error(uploadError);
    return { error: 'Image upload failed.' };
  }

  // Get the public URL for the database
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  // 2. Insert Listing Data into the 'products' table
  const { error: insertError } = await supabase
    .from('products')
    .insert({
      seller_id: user.id, // RLS check uses this
      name,
      description,
      price,
      image_url: publicUrl,
      contact_info: { 
          whatsapp: contact_whatsapp, 
          instagram: contact_instagram, 
          telegram: contact_telegram 
      },
    });

  if (insertError) {
    return { error: 'Failed to create listing in database.' };
  }

  return { success: true };
}

// 2. DELETE LISTING (Requires RLS to be configured for DELETE on products table)
export async function deleteListing(productId: string) {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Authentication required.' };
    }

    // Supabase RLS ensures the user can only delete their own product.
    // The DELETE policy created in Phase 1 handles ownership.
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

    if (error) {
        // This error could be due to RLS if the user isn't the owner
        return { error: 'Failed to delete listing (Permission Denied or Data Error).' };
    }

    // TODO: Implement image deletion from Supabase Storage as a cleanup step

    return { success: true };
}
// You would also implement an updateListing function here.