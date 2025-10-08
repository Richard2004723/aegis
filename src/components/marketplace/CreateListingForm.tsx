'use client';
import { createListing } from '@/lib/actions/product';
import { useRef } from 'react';

export default function CreateListingForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        // Use the Server Action to handle the creation and image upload
        const result = await createListing(formData); 

        if (result?.error) {
            alert(`Listing failed: ${result.error}`);
        } else if (result?.success) {
            alert('Listing created successfully! Refreshing dashboard...');
            formRef.current?.reset(); // Clear the form on success
            // NOTE: You'll need to refresh the parent page data after this success
            window.location.reload(); 
        }
    };

    return (
        <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-medium mb-4">Create New Product Listing</h3>
            
            {/* The 'action' attribute points to the Server Action */}
            <form ref={formRef} action={handleSubmit} className="space-y-4">
                
                {/* Product Details */}
                <input type="text" name="name" placeholder="Product Name" required className="p-2 border rounded w-full" />
                <textarea name="description" placeholder="Description" required rows={3} className="p-2 border rounded w-full"></textarea>
                <input type="text" name="price" placeholder="Price (or 'DM for price')" required className="p-2 border rounded w-full" />
                
                {/* Contact Info */}
                <h4 className="font-semibold pt-2">Seller Contact Info:</h4>
                <input type="text" name="contact_whatsapp" placeholder="WhatsApp Handle/Link" className="p-2 border rounded w-full" />
                <input type="text" name="contact_instagram" placeholder="Instagram Handle" className="p-2 border rounded w-full" />
                <input type="text" name="contact_telegram" placeholder="Telegram Handle/Link" className="p-2 border rounded w-full" />

                {/* Image Upload */}
                <h4 className="font-semibold pt-2">Product Image:</h4>
                <input type="file" name="image" accept="image/*" required className="p-2 border rounded w-full" />
                
                <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 w-full">
                    Create Listing
                </button>
            </form>
        </div>
    );
}