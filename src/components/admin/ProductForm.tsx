'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from './ImageUploader';
import { addProduct, updateProduct, getCategories } from '@/lib/firestore';
import { Category, Product } from '@/types/product';
import toast from 'react-hot-toast';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Initialize with product data if editing
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 1,
    originalPrice: product?.originalPrice || 1,
    category: product?.category || '',
    tags: product?.tags || [],
    inStock: product?.inStock ?? true,
    stockQuantity: product?.stockQuantity ?? 10,
    customizable: product?.customizable || false,
    // rating: product?.rating || 4.5,
    // reviewCount: product?.reviewCount || 0,
  });
  const [images, setImages] = useState<string[]>(product?.images || []);  // Cloudinary URLs
  const [localFiles, setLocalFiles] = useState<File[]>([]);  // नई फाइल्स
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        category: product.category || '',
        tags: product.tags || [],
        inStock: product.inStock ?? true,
        stockQuantity: product.stockQuantity ?? 10,
        customizable: product.customizable || false,
      });
      setImages(product.images || []);
    }
  }, [product]);  // जब product लोड हो जाए तो formData अपडेट हो जाएगा

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (images.length + localFiles.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
  
    setLoading(true);
    try {
      let finalImages = [...images];
  
      // नई फाइल्स अपलोड करो (Save पर ही)
      if (localFiles.length > 0) {
        const uploadedUrls = await uploadMultipleToCloudinary(localFiles);
        finalImages = [...finalImages, ...uploadedUrls];
      }
  
      const productData = {
        ...formData,
        images: finalImages,
      };
  
      if (isEdit && product?.id) {
        await updateProduct(product.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully!');
      }
  
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg w-full mx-auto">
      <div className="p-4 sm:p-8 space-y-8">
      {/* Images */}
      <div>
        <ImageUploader 
          images={images}
          localFiles={localFiles}
          onImagesChange={setImages}
          onLocalFilesChange={setLocalFiles}
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="e.g., Premium Kundan Necklace Set"
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          {loadingCategories ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-colors"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          //rows={4}  
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-colors resize-none min-h-[90px] md:min-h-[120px] lg:min-h-[150px]"
          placeholder="Describe the product in detail..."
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <Input
          label="Current Price (₹)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
          min="1"
          placeholder="1599"
        />

        <Input
          label="Original Price (₹)"
          type="number"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleInputChange}
          required
          min="0"
          placeholder="2499"
        />

        <Input
          label="Stock Quantity"
          type="number"
          name="stockQuantity"
          value={formData.stockQuantity}
          onChange={handleInputChange}
          required
          min="0"
          placeholder="50"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-row gap-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag (e.g., New, Trending)"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-colors"
          />
          <Button type="button" onClick={addTag} className="sm:w-auto px-3 sm:px-6 py-3">
            Add Tag
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-secondary text-white rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col sm:flex-row gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={() => handleCheckboxChange('inStock')}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
          <span className="text-base font-medium">In Stock</span>
        </label>

        {/* <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.customizable}
            onChange={() => handleCheckboxChange('customizable')}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
          <span className="text-base font-medium">Customizable</span>
        </label> */}
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-row gap-4 pt-6">
        <Button
          type="submit"
          loading={loading}
          className="flex-1 cursor-pointer order-1 sm:order-none px-3! sm:px-6!"
        >
          {isEdit ? 'Update Product' : 'Add Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 cursor-pointer px-3! sm:px-6!"
        >
          Cancel
        </Button>
      </div>
      </div>
    </form>
  );
};
