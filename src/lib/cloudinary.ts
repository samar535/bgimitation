// src/lib/cloudinary.ts
import { Cloudinary } from "@cloudinary/url-gen";

// Cloudinary instance (optional, for advanced use)
export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});

// Simple upload function using unsigned preset (फ्री में काम करता है)
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_uploads"); // हम ये बनाएंगे

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error("Upload failed");
  }
};

// Multiple images upload
export const uploadMultipleToCloudinary = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(uploadToCloudinary);
  return Promise.all(uploadPromises);
};