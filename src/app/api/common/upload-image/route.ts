import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "profile-images";

export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;
        const oldImageUrl = formData.get("oldImageUrl") as string | null;

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        // Delete old image if it exists
        if (oldImageUrl) {
            try {
                // Extract filename from URL
                const urlParts = oldImageUrl.split('/');
                const oldFileName = urlParts[urlParts.length - 1];
                
                if (oldFileName && !oldFileName.includes('default-avatar')) {
                    // console.log("Deleting old image:", oldFileName);
                    const { error: deleteError } = await supabase.storage
                        .from(BUCKET_NAME)
                        .remove([oldFileName]);
                    
                    if (deleteError) {
                        console.warn("Failed to delete old image:", deleteError.message);
                    } else {
                        // console.log("Old image deleted successfully");
                    }
                }
            } catch (err) {
                console.warn("Error during old image deletion:", err);
            }
        }

        // Upload new image
        const fileName = `${Date.now()}_${file.name}`;
        // console.log("Uploading file:", fileName);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file.stream(), {
                contentType: file.type,
                upsert: true,
            });

        // console.log("Upload response data:", data);
        // console.log("Upload response error:", error);

        if (error) {
            return NextResponse.json({ message: "Image upload failed", error: error.message }, { status: 500 });
        }

        const imageUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName).data.publicUrl;
        // console.log("Image uploaded successfully:", imageUrl);
        
        return NextResponse.json({ imageUrl });
    } catch (error: any) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ 
            message: "An unexpected error occurred", 
            error: error.message 
        }, { status: 500 });
    }
}