'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Loader2, Grid3x3 } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import toast from 'react-hot-toast';
import { CldImage } from 'next-cloudinary';
import { Category } from '@/types/product';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // लोकल इमेज और preview
  const [localImageFile, setLocalImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '', // पुरानी इमेज (edit के केस में)
    order: 0,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data as Category[]);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // इमेज चुनने पर preview बनाओ
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({ name: '', imageUrl: '', order: 0 });
    setLocalImageFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    let finalImageUrl = formData.imageUrl;

    try {
      // नई इमेज अपलोड करो
      if (localImageFile) {
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 10;
          });
        }, 300);

        finalImageUrl = await uploadToCloudinary(localImageFile);

        clearInterval(interval);
        setUploadProgress(100);
        toast.success('Image uploaded!');
      }

      const slug = generateSlug(formData.name);
      const categoryData = {
        name: formData.name.trim(),
        slug,
        imageUrl: finalImageUrl,
        order: Number(formData.order) || categories.length,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
        toast.success('Category updated!');
      } else {
        await addCategory({ ...categoryData, productCount: 0 });
        toast.success('Category added!');
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" category? This cannot be undone.`)) return;

    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      imageUrl: cat.imageUrl || '',
      order: cat.order ?? 0,
    });
    setLocalImageFile(null);
    setPreviewUrl(cat.imageUrl || '');
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark font-serif">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <Button onClick={() => setShowModal(true)} className='cursor-pointer px-2! sm:px-8! py-2! sm:py-4 text-md sm:text-lg'>
          <Plus size={20} />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-6 shadow-lg">
          <p className="text-white/80 text-sm mb-1">Total Categories</p>
          <p className="text-4xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-gradient-to-br from-secondary to-secondary-dark text-white rounded-2xl p-6 shadow-lg">
          <p className="text-white/80 text-sm mb-1">Total Products</p>
          <p className="text-4xl font-bold">
            {categories.reduce((sum, c) => sum + (c.productCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-64">
                {cat.imageUrl ? (
                  <CldImage
                    width={400}
                    height={256}
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="object-cover w-full h-full"
                    crop="fill"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-4">
                  <h3 className="text-xl font-bold text-white text-center">{cat.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-secondary">{cat.productCount || 0}</span>
                  <span className="text-sm text-gray-500">Products</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit(cat)} variant="outline" className="flex-1">
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(cat.id, cat.name)} variant="outline" className="text-red-600">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
          <div className="text-9xl mb-6 flex justify-center"><Grid3x3 size={64} className="text-primary" /></div>
          <h2 className="text-3xl font-bold mb-4">No Categories Yet</h2>
          <p className="text-gray-600 mb-8">Create your first category to organize products</p>
          <Button onClick={() => setShowModal(true)} size="lg" className='cursor-pointer'>
            <Plus size={20} />
            Add First Category
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-white/20 rounded-full">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <Input
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Necklaces"
                required
              />
              <p className="text-xs text-gray-500">
                Slug: <span className="font-mono text-primary">{generateSlug(formData.name)}</span>
              </p>

              {/* Category Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category Image
                </label>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                  {/* Preview */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Preview</p>
                    <div className="relative h-[138px] md:aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                        {(previewUrl || formData.imageUrl) ? (
                        <>
                            <img
                            src={previewUrl || formData.imageUrl}
                            alt="Category preview"
                            className="object-cover w-full h-full"
                            />
                            <button
                            onClick={() => {
                                setLocalImageFile(null);
                                setPreviewUrl('');
                                setFormData(prev => ({ ...prev, imageUrl: '' }));  // ← ये ऐड करो
                            }}
                            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
                            >
                            <X size={18} />
                            </button>
                        </>
                        ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p className="text-center">No image selected</p>
                        </div>
                        )}
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Choose Image</p>
                    <label className="block cursor-pointer ">
                      <div className={`border-2 border-dashed h-[138px] rounded-xl p-2 text-center transition-all ${uploading ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}>
                        {uploading ? (
                          <div className="space-y-4">
                            <Loader2 className="mx-auto animate-spin text-primary" size={40} />
                            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto mb-2 sm:mb-4 text-gray-400" size={40} />
                            <p className="text-sm sm:text-lg font-medium">Click to select image</p>
                            <p className="text-xs text-gray-500 mt-1">800x800 recommended</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <Input
                label="Display Order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />

              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={uploading}
                  loading={uploading}
                  className="flex-1 cursor-pointer px-4! sm:px-8! py-2! sm:py-3!"
                  size="lg"
                >
                  <Save size={20} />
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1 cursor-pointer px-4! sm:px-8! py-2! sm:py-3!" size="lg">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}