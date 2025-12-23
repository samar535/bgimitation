// Product Form Component
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from './ImageUploader';
import { addProduct, updateProduct, getCategories } from '@/lib/firestore';
import { Category, Product } from '@/types/product';
import toast from 'react-hot-toast';

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
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    category: product?.category || '',
    tags: product?.tags || [],
    inStock: product?.inStock ?? true,
    stockQuantity: product?.stockQuantity ?? 10,
    customizable: product?.customizable || false,
  });

  const [images, setImages] = useState<string[]>(product?.images || []);
  const [tagInput, setTagInput] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await getCategories();
        console.log('Fetched categories:', data); // Debug log
        
        // Handle if data is in different format
        if (data && Array.isArray(data)) {
          setCategories(data);
          
          // Set default category if none selected and categories exist
          if (!formData.category && data.length > 0 && !isEdit) {
            setFormData(prev => ({
              ...prev,
              category: data[0].name
            }));
          }
        } else {
          console.error('Categories data is not an array:', data);
          toast.error('Failed to load categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Only run once on mount

  // Update form when product changes (for edit mode)
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
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
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
    
    // Validation
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (formData.originalPrice < formData.price) {
      toast.error('Original price should be greater than or equal to current price');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...formData,
        images,
        rating: 4.5, // Default rating
        reviewCount: 0, // Default review count
      };

      if (isEdit && product?.id) {
        await updateProduct(product.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully!');
      }
      
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Images */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">Product Images</h3>
        {/* <ImageUploader 
          images={images}
          onImagesChange={setImages}
        /> */}
      </div>

      {/* Basic Info */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Premium Kundan Necklace Set"
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            {loadingCategories ? (
              <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-500">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="space-y-2">
                <div className="w-full px-4 py-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 text-sm">
                  ⚠️ No categories found. Please create categories first.
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/admin/categories')}
                  className="text-sm text-primary hover:underline"
                >
                  → Go to Categories Management
                </button>
              </div>
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
                    {cat.imageUrl} {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-colors"
            placeholder="Describe the product in detail..."
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">Pricing & Stock</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Input
              label="Current Price (₹) *"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="e.g., 1599"
            />
            <p className="text-xs text-gray-500 mt-1">
              Selling price for customers
            </p>
          </div>

          <div>
            <Input
              label="Original Price (₹) *"
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              required
              min="0"
              placeholder="e.g., 2499"
            />
            <p className="text-xs text-gray-500 mt-1">
              MRP (for discount calculation)
            </p>
          </div>

          <div>
            <Input
              label="Stock Quantity *"
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              required
              min="0"
              placeholder="e.g., 10"
            />
            <p className="text-xs text-gray-500 mt-1">
              Available units
            </p>
          </div>
        </div>

        {/* Discount Preview */}
        {formData.originalPrice > formData.price && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-800 font-semibold">
              💰 Discount: {Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% OFF
            </p>
            <p className="text-xs text-green-600 mt-1">
              Customer saves ₹{formData.originalPrice - formData.price}
            </p>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">Tags & Labels</h3>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag (e.g., New, Trending, Premium)"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-colors"
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add Tag
          </Button>
        </div>

        {/* Quick Tag Suggestions */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-2">Quick add:</p>
          <div className="flex gap-2 flex-wrap">
            {['New', 'Trending', 'Premium', 'Sale', 'Featured'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  if (!formData.tags.includes(tag)) {
                    setFormData(prev => ({
                      ...prev,
                      tags: [...prev.tags, tag]
                    }));
                  }
                }}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:border-secondary hover:text-secondary transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-secondary text-white rounded-full text-sm flex items-center gap-2 font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-300 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">Product Options</h3>
        
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={() => handleCheckboxChange('inStock')}
              className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
            />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              In Stock
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.customizable}
              onChange={() => handleCheckboxChange('customizable')}
              className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
            />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              Customizable
            </span>
          </label>
        </div>

        <div className="mt-3 text-xs text-gray-600">
          <p>• <strong>In Stock:</strong> Product is available for ordering</p>
          <p>• <strong>Customizable:</strong> Customer can request customizations</p>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
          disabled={categories.length === 0}
        >
          {isEdit ? '✓ Update Product' : '+ Add Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};