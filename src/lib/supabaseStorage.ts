import { supabase } from "./supabase";

export async function deleteImage(
    bucket: string,
    imageUrl?: string | null
) {
    if (!imageUrl) return;
    // console.log("Deleting image:", imageUrl);

    try {
        const fileName = imageUrl.split('/').pop();
        if (!fileName || fileName.includes('default-avatar')) return;

        const { error } = await supabase.storage
            .from(bucket)
            .remove([fileName]);

        if (error) {
            console.warn("Failed to delete image:", error.message);
        }
    }
    catch (err) {
        console.warn("Error during image deletion:", err);
    }
}

export async function uploadImage(
    bucket: string,
    file: File
) {
    const fileName = `${Date.now()}_${file.name}`;
    // console.log("Uploading image:", fileName);

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.stream(), {
            contentType: file.type,
            upsert: true,
        });

    if (error) {
        console.error("Image upload failed:", error.message);
        throw new Error("Image upload failed");
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    // console.log("Image uploaded successfully:", data.publicUrl);
    return data.publicUrl;
}