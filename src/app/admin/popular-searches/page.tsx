'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { getPopularSearches, addPopularSearch, updatePopularSearch, deletePopularSearch } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import toast from 'react-hot-toast';

interface PopularSearch {
    id: string;
    term: string;
    order: number;
}

export default function PopularSearchesPage() {
  const [searches, setSearches] = useState<PopularSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSearch, setEditingSearch] = useState<PopularSearch | null>(null);

  const [formData, setFormData] = useState({
    term: '',
    order: 0,
  });

  const fetchSearches = async () => {
    setLoading(true);
    try {
      const data = await getPopularSearches();  // अब ये PopularSearch[] लौटाएगा
      setSearches(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    }));
  };

  const resetForm = () => {
    setFormData({ term: '', order: 0 });
    setEditingSearch(null);
    setShowModal(false);
  };

  const handleSave = async () => {
    if (!formData.term.trim()) {
      toast.error('Search term is required');
      return;
    }

    try {
      if (editingSearch) {
        await updatePopularSearch(editingSearch.id, formData.term, formData.order);
        toast.success('Updated successfully!');
      } else {
        await addPopularSearch(formData.term.trim(), formData.order);
        toast.success('Added successfully!');
      }
      resetForm();
      fetchSearches();
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this search term?')) return;
    
    try {
      await deletePopularSearch(id);  // do id pass
      toast.success('Deleted successfully!');
      fetchSearches();  // referesh
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (search: PopularSearch) => {
    setEditingSearch(search);
    setFormData({
      term: search.term,
      order: search.order,
    });
    setShowModal(true);
  };

  if (loading) {
    return <Loader size="lg" />;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Popular Searches Management</h1>
          <p className="text-gray-600 mt-1">Manage trending search terms shown on search page</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add Search Term
        </Button>
      </div>

      {searches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">No Popular Searches Yet</h2>
          <p className="text-gray-600 mb-6">Add trending terms to help customers discover products</p>
          <Button onClick={() => setShowModal(true)}>
            Add First Term
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searches.map((search) => (
            <div key={search.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">{search.term}</p>
                <span className="text-sm text-gray-500">Order: {search.order}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(search)}
                  className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(search.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingSearch ? 'Edit' : 'Add'} Popular Search
            </h2>
            <div className="space-y-4">
              <Input
                label="Search Term"
                name="term"
                value={formData.term}
                onChange={handleInputChange}
                placeholder="e.g., Kundan Necklace"
                required
              />
              <Input
                label="Display Order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="flex gap-4 mt-8">
              <Button onClick={handleSave} className="flex-1">
                <Save size={18} />
                Save
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}