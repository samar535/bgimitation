// Image Uploader Component
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
// import { uploadMultipleImages } from '@/lib/storage';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';
import toast from 'react-hot-toast';
import { CldImage } from 'next-cloudinary'

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    try {
    //   const urls = await uploadMultipleImages(files, 'products');
    const urls = await uploadMultipleToCloudinary(files);
      onImagesChange([...images, ...urls]);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Product Images ({images.length}/{maxImages})
      </label>
      
      {/* Image Preview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((url, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
            <CldImage
              width={400}
              height={400}
              src={url}
              alt={`Product ${index + 1}`}
              className="object-cover"
              crop="fill"
              gravity="auto"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded">
                Main
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upload Button */}
      {images.length < maxImages && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : (
              <>
                <Upload className="text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG up to 5MB
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
};