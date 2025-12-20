// Products Management Page
'use client';
//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
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { getProducts, getCategories, deleteProduct } from '@/lib/firestore';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import toast from 'react-hot-toast';
import { CldImage } from 'next-cloudinary';

const PRODUCTS_PER_PAGE = 10;

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setAllProducts(productsData);

      const categoryNames = categoriesData.map(cat => cat.name);
      setCategories(['All', ...categoryNames]);

      filterAndDisplay(productsData, 'All', '');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterAndDisplay = (products: Product[], category: string, search: string) => {
    let filtered = products;

    if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerSearch) ||
        p.category.toLowerCase().includes(lowerSearch)
      );
    }

    setDisplayedProducts(filtered.slice(0, PRODUCTS_PER_PAGE));
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const filtered = allProducts.filter(p => 
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (searchQuery === '' || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      const more = filtered.slice(currentLength, currentLength + PRODUCTS_PER_PAGE);
      setDisplayedProducts(prev => [...prev, ...more]);
      setLoadingMore(false);
    }, 500);
  };

  useEffect(() => {
    filterAndDisplay(allProducts, selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery, allProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const totalFiltered = allProducts.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    (searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).length;

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">
            Total: <span className="font-bold text-dark">{totalFiltered}</span> products
          </p>
        </div>
        <Link href="/admin/products/add">
          <Button>
            <Plus size={20} />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {displayedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <CldImage
                        width={64}
                        height={64}
                        src={product.images[0]}
                        alt={product.name}
                        crop="fill"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 font-semibold">₹{product.price}</td>
                <td className="px-6 py-4">
                  {product.inStock && product.stockQuantity > 0 ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {product.stockQuantity} in stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <button className="p-2 hover:bg-blue-50 rounded-lg">
                        <Edit size={18} className="text-blue-600" />
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden grid gap-4">
        {displayedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex gap-4 p-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <CldImage
                  width={96}
                  height={96}
                  src={product.images[0]}
                  alt={product.name}
                  crop="fill"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <div className="flex justify-between">
                  <p className="text-xl font-bold text-secondary">₹{product.price}</p>
                  <div>
                    {product.inStock && product.stockQuantity > 0 ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {product.stockQuantity} in stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 pt-0 flex gap-3">
              <Link href={`/admin/products/edit/${product.id}`} className="flex-1">
                <Button variant="outline" className="w-full border-green-300! text-green-700! px-4! sm:px-6! py-2! sm:py-3!">
                  <Edit size={18} />
                  Edit
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="flex-1 border-red-200 px-4! sm:px-6! py-2! sm:py-3! border-red-700! text-red-700! hover:bg-red-50"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 size={18} />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {displayedProducts.length < totalFiltered && (
        <div className="text-center mt-12">
          <Button onClick={loadMore} loading={loadingMore} size="lg">
            Load More ({totalFiltered - displayedProducts.length} remaining)
          </Button>
        </div>
      )}

      {displayedProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500 text-xl">
          No products found
        </div>
      )}
    </div>
  );
}