// // src/lib/cloudinary.ts
// import { Cloudinary } from "@cloudinary/url-gen";

// // Cloudinary instance (optional, for advanced use)
// export const cld = new Cloudinary({
//   cloud: {
//     cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   },
// });

// // Simple upload function using unsigned preset (फ्री में काम करता है)
// export const uploadToCloudinary = async (file: File): Promise<string> => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", "unsigned_uploads"); // हम ये बनाएंगे

//   const response = await fetch(
//     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   const data = await response.json();
//   if (data.secure_url) {
//     return data.secure_url;
//   } else {
//     throw new Error("Upload failed");
//   }
// };

// // Multiple images upload
// export const uploadMultipleToCloudinary = async (files: File[]): Promise<string[]> => {
//   const uploadPromises = files.map(uploadToCloudinary);
//   return Promise.all(uploadPromises);
// };


// src/lib/cloudinary.ts — frontend upload और util के लिए

// Unsigned upload (frontend से यूज़ होता है)
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'unsigned_uploads'); // तुम्हारा preset नाम

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Upload failed: ${data.error?.message || JSON.stringify(data)}`);
  }

  if (data.secure_url) {
    return data.secure_url;
  }

  throw new Error('Upload failed: No secure_url returned');
};

// Multiple upload — ProductForm में यूज़ हो रहा है
export const uploadMultipleToCloudinary = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(uploadToCloudinary);
  return Promise.all(uploadPromises);
};

// Extract public_id from Cloudinary URL (API route में यूज़ होगा)
export const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  const versionIndex = parts.findIndex(part => part.startsWith('v'));
  if (versionIndex === -1) return '';

  const publicIdParts = parts.slice(versionIndex + 1);
  const filename = publicIdParts[publicIdParts.length - 1].split('.')[0];
  publicIdParts[publicIdParts.length - 1] = filename;
  return publicIdParts.join('/');
};