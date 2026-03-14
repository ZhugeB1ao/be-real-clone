import { File } from "expo-file-system";
import { supabase } from "@/lib/supabase/client";

export const uploadProfileImage = async (userId: string, imageUri: string) => {
    try {
        // Extract the file extension from the image URI
        // This assumes the image URI has a file extension, e.g., "file:///path/to/image.jpg"
        // If the URI does not have an extension, you can default to "jpg" or handle it as needed
        const fileExtension = imageUri.split('.').pop() || 'jpg';

        // Create a unique file name using the user ID and current timestamp
        const fileName = `${userId}/profile.${fileExtension}`;

        // Create a File object from the image URI
        const file = new File(imageUri);

        // Read the file as bytes
        const bytes = await file.bytes();

        // Upload the file to Supabase Storage
        const { error } = await supabase.storage.from('profiles').upload(fileName, bytes, {
            contentType: `image/${fileExtension}`,
            upsert: true, // Set to true to overwrite existing file with the same name
        });

        if (error) {
            throw error;
        }

        // Get the public URL of the uploaded image
        const { data } = await supabase.storage.from('profiles').getPublicUrl(fileName);
        
        return `${data.publicUrl}?${Date.now()}`; // Append timestamp to URL to prevent caching issues
    } catch (error) {
        console.error("Error uploading profile image:", error);
        throw error;
    }

} 

export const uploadPostImage = async (userId: string, imageUri: string) => {
    try {
        // Extract the file extension from the image URI
        // This assumes the image URI has a file extension, e.g., "file:///path/to/image.jpg"
        // If the URI does not have an extension, you can default to "jpg" or handle it as needed
        const fileExtension = imageUri.split('.').pop() || 'jpg';

        // Create a unique file name using the user ID and current timestamp
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}.${fileExtension}`;

        // Create a File object from the image URI
        const file = new File(imageUri);

        // Read the file as bytes
        const bytes = await file.bytes();

        // Upload the file to Supabase Storage
        const { error } = await supabase.storage.from('posts').upload(fileName, bytes, {
            contentType: `image/${fileExtension}`,
            upsert: false,
        });

        if (error) {
            throw error;
        }

        // Get the public URL of the uploaded image
        const { data } = await supabase.storage.from('posts').getPublicUrl(fileName);
        return data.publicUrl;

    } catch (error) {
        console.error("Error uploading post image:", error);
        throw error;
    }

} 