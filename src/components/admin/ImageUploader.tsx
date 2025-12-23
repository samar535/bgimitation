// ImageUploader
'use client';

import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { CldImage } from 'next-cloudinary';

interface ImageUploaderProps {
  images: string[];          // Existing Cloudinary URLs
  localFiles: File[];        // Newly selected files (preview only)
  onImagesChange: (images: string[]) => void;
  onLocalFilesChange: (files: File[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  localFiles = [],
  onImagesChange,
  onLocalFilesChange,
  maxImages = 5,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // localFiles चेंज होने पर preview URLs बनाओ
  useEffect(() => {
    const newPreviews = localFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);

    // Cleanup old URLs to avoid memory leak
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [localFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    const totalCurrent = images.length + localFiles.length;
    if (totalCurrent + selectedFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can add only ${maxImages - totalCurrent} more.`);
      return;
    }

    onLocalFilesChange([...localFiles, ...selectedFiles]);
  };

  const removeExistingImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeLocalFile = (index: number) => {
    const newFiles = localFiles.filter((_, i) => i !== index);
    onLocalFilesChange(newFiles);
    // previewUrls useEffect से ऑटो अपडेट हो जाएगा
  };

  const totalImages = images.length + localFiles.length;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Product Images ({totalImages}/{maxImages})
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Existing Cloudinary Images */}
        {images.map((url, index) => (
          <div
            key={`cloud-${index}`}
            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
          >
            <CldImage
              width={400}
              height={400}
              src={url}
              alt={`Product image ${index + 1}`}
              className="object-cover w-full h-full"
              crop="fill"
              gravity="auto"
            />
            <button
              type="button"
              onClick={() => removeExistingImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg transition-all 
                        opacity-100 md:opacity-0 md:group-hover:opacity-100 
                        hover:scale-110 hover:bg-red-600 cursor-pointer"
            >
              <X size={16} />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg shadow">
                Main
              </div>
            )}
          </div>
        ))}

        {/* Local File Previews */}
        {previewUrls.map((preview, index) => (
          <div
            key={`local-${index}`}
            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300"
          >
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={() => removeLocalFile(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg transition-all 
                        opacity-100 md:opacity-0 md:group-hover:opacity-100 
                        hover:scale-110 hover:bg-red-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      {totalImages < maxImages && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="text-gray-400 mb-3" size={32} />
            <p className="text-sm text-gray-600 font-medium">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};