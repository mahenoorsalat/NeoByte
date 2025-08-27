import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";

import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
    try {
// const auth = getAuth(request);
const { userId } = await auth();
        console.log("Auth userId:", userId);
  if (!userId) {
            return NextResponse.json({ success: false, message: "Not authenticated" });
        }
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const category = formData.get("category");
        const price = formData.get("price");
        const offerPrice = formData.get("offerPrice");

        // ✅ Handle multiple images correctly
        const files = formData.getAll("images");

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: "No files uploaded" });
        }

        // ✅ Upload files to Cloudinary
        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(buffer);
                });
            })
        );

        const image = result.map((r) => r.secure_url);

        await connectDB();
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image,
            date: Date.now()
        });

        return NextResponse.json({ success: true, message: "Upload successful", newProduct });
    } catch (error) {
        console.error(error);
         return NextResponse.json({
            success: false,
            message: "Something went wrong while uploading"
        });
    }
}