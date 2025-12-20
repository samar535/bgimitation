'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Package, TrendingUp, Grid3x3, Upload } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import toast from 'react-hot-toast';
import { CldImage } from 'next-cloudinary';
import { Category } from '@/types/product';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',  
    order: 0,
  });

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data as unknown as Category[]);
    setLoading(false);
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

  const resetForm = () => {
    setFormData({ name: '', imageUrl: '', order: 0 });
    setEditingCategory(null);
    setShowAddModal(false);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
        toast.error('Category name is required');
        return;
    }

    try {
      const slug = generateSlug(formData.name);
      await addCategory({
        name: formData.name.trim(),
        slug,
        imageUrl: formData.imageUrl || '',
        productCount: 0,
        order: formData.order || categories.length,
      });
      
      toast.success('Category added successfully!');
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;

    try {
        const slug = generateSlug(formData.name || editingCategory.name);
        await updateCategory(editingCategory.id, {
          name: formData.name || editingCategory.name,
          slug,
          imageUrl: formData.imageUrl || editingCategory.imageUrl,
          order: formData.order ?? editingCategory.order,
        });
      
      toast.success('Category updated successfully!');
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}" category?\nThis action cannot be undone.`)) {
      return;
    }
  
    try {
      await deleteCategory(categoryId);
      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      imageUrl: category.imageUrl || '',  // ← ये ऐड करो
      order: category.order ?? 0,
    });
    setShowAddModal(true);
  };

  // Stats
  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark mb-2 font-serif">
                Categories <span className='hidden sm:inline'>Management</span>
              </h1>
              <p className="text-gray-600 hidden sm:inline">Organize your products into categories</p>
              <p className="text-gray-600 inline sm:hidden">manage categories</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} size="lg">
              <Plus size={20} />
              Add Category
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-3 sm:p-6 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Total Categories</p>
                <p className="text-4xl font-bold">{categories.length}</p>
              </div>
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Grid3x3 className="w-5 sm:w-7 h-5 sm-h-7" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary to-secondary-dark text-white rounded-2xl p-3 sm:p-6 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Total Products</p>
                <p className="text-4xl font-bold">{totalProducts}</p>
              </div>
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Package className="w-5 sm:w-7 h-5 sm-h-7" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-3 sm:p-6 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Avg per Category</p>
                <p className="text-4xl font-bold">
                  {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
                </p>
              </div>
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 sm:w-7 h-5 sm-h-7" />
              </div>
            </div>
          </div>
        </div>

        <div className='hidden lg:block'>
        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Category Header */}
                <div className="relative h-64 rounded-t-2xl overflow-hidden border-b-4 border-primary">
                    {category.imageUrl ? (
                        <CldImage
                        width={400}
                        height={256}
                        src={category.imageUrl}
                        alt={category.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        crop="fill"
                        gravity="auto"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No image</p>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white text-center">
                        {category.name}
                        </h3>
                        <p className="text-sm text-white/80 text-center font-mono">
                        /{category.slug}
                        </p>
                    </div>
                </div>

                {/* Category Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-secondary">
                        {category.productCount || 0}
                      </p>
                      <p className="text-xs text-gray-600">Products</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-primary">
                        #{category.order}
                      </p>
                      <p className="text-xs text-gray-600">Order</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                        onClick={() => startEdit(category)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
                    >
                        <Edit size={16} />
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                        <Trash2 size={18} className="text-red-600" />
                    </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Grid3x3 size={64} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3 font-serif">
              No Categories Yet
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Create your first category to start organizing your beautiful jewelry collection
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setShowAddModal(true)} size="lg">
                <Plus size={20} />
                Add First Category
              </Button>
            </div>
          </div>
        )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex gap-4 p-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  {category.imageUrl ? (
                    <CldImage
                      width={96}
                      height={96}
                      src={category.imageUrl}
                      alt={category.name}
                      crop="fill"
                    />
                  ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                      </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{category.slug}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                      <p className="text-xl font-bold text-secondary">
                        {category.productCount || 0}
                      </p>
                      <p className="text-xs text-gray-600">Products</p>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                      <p className="text-xl font-bold text-primary">
                        #{category.order}
                      </p>
                      <p className="text-xs text-gray-600">Order</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 pt-0 flex gap-3">
                <Button
                  onClick={() => startEdit(category)}
                  variant="outline" className="w-full border-green-300! text-green-700! px-4! sm:px-6! py-2! sm:py-3!">
                    <Edit size={18} />
                    Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-200 px-4! sm:px-6! py-2! sm:py-3! border-red-700! text-red-700! hover:bg-red-50"
                  onClick={() => handleDelete(category.id, category.name)}
                >
                  <Trash2 size={18} />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
        {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                    {editingCategory ? 'Update category information' : 'Create a new product category'}
                    </p>
                </div>
                <button
                    onClick={resetForm}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
                </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-8">
                <div className="space-y-6">
                    {/* Category Name */}
                    <div>
                    <Input
                        label="Category Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Necklaces, Earrings"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Slug: <span className="font-mono text-primary">{generateSlug(formData.name || 'category-name')}</span>
                    </p>
                    </div>

                    {/* Category Image Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Category Image
                      </label>

                      <div className="flex flex-row gap-4 sm:gap-8 items-start">
                        {/* Left: Preview */}
                        <div className="">
                          <p className="text-xs text-gray-500 mb-2">Preview</p>
                          {formData.imageUrl ? (
                            <div className="relative w-full max-w-md h-[138px] aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                              <CldImage
                                width={138}
                                height={138}
                                src={formData.imageUrl}
                                alt="Category preview"
                                className="object-cover"
                                crop="fill"
                              />
                              <button
                                onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-full h-[138px] max-w-md aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <p className="text-gray-500 text-center px-4">No image uploaded yet</p>
                            </div>
                          )}
                        </div>

                        {/* Right: Upload Button */}
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-2">Upload New Image</p>
                          <label className="flex flex-col items-center justify-center w-full h-[138px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors bg-gray-50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="text-gray-400 mb-3" size={40} />
                              <p className="text-sm text-gray-600 font-medium">
                                Click to upload or drag & drop
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Recommended: 800x800 PNG/JPG
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const formDataUpload = new FormData();
                                formDataUpload.append("file", file);
                                formDataUpload.append("upload_preset", "unsigned_uploads");

                                try {
                                  const res = await fetch(
                                    `https://api.cloudinary.com/v1_1/dpdh4zuqy/image/upload`,  // तुम्हारा cloud name
                                    {
                                      method: "POST",
                                      body: formDataUpload,
                                    }
                                  );
                                  const data = await res.json();
                                  if (data.secure_url) {
                                    setFormData({ ...formData, imageUrl: data.secure_url });
                                    toast.success('Image uploaded!');
                                  }
                                } catch (error) {
                                  toast.error('Upload failed');
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Display Order */}
                    <div>
                    <Input
                        label="Display Order"
                        name="order"
                        type="number"
                        value={formData.order}
                        onChange={handleInputChange}
                        placeholder="0"
                        required
                        min="0"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Lower numbers appear first (0, 1, 2...)
                    </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <Button
                    onClick={editingCategory ? handleUpdate : handleAdd}
                    className="flex-1 px-4! sm:px-8! py-2! sm:py-3!"
                    size="lg"
                    >
                      <Save size={20} />
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </Button>
                    <Button
                    variant="outline"
                    onClick={resetForm}
                    size="lg"
                    className='px-4! sm:px-8! py-2! sm:py-3!'
                    >
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