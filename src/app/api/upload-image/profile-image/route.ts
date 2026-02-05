import { NextResponse, NextRequest } from "next/server";
import { uploadImage, deleteImage } from "@/lib/supabaseStorage";

const BUCKET_NAME = "profile-images";

export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;
        const oldImageUrl = formData.get("oldImageUrl") as string | null;

        if(!file) {
            return NextResponse.json(
                { error: "No image file provided" },
                { status: 400 }
            );
        }

        await deleteImage(BUCKET_NAME, oldImageUrl);

        const imageUrl = await uploadImage(BUCKET_NAME, file);

        return NextResponse.json({ imageUrl }, { status: 200 });
    }
    catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
            { error: "Image upload failed" },
            { status: 500 }
        );
    }
}