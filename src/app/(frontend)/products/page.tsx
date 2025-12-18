// admin product page/management

'use client';

import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '@/lib/firestore';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Loader } from '@/components/ui/Loader';
import { Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/product';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

const PRODUCTS_PER_PAGE = 10;

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        // newest first
        productsData.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setAllProducts(productsData);

        const categoryNames = categoriesData.map(cat => cat.name);
        setCategories(['All', ...categoryNames]);

        // initial
        applyFilterAndSort(productsData, 'All', 'newest');
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyFilterAndSort = (products: Product[], category: string, sort: string) => {
    let filtered = [...products];

    if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (sort === 'priceLow') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceHigh') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    setFilteredProducts(filtered);
    setDisplayedProducts(filtered.slice(0, PRODUCTS_PER_PAGE));
  };

  useEffect(() => {
    applyFilterAndSort(allProducts, selectedCategory, sortBy);
  }, [selectedCategory, sortBy, allProducts]);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const more = filteredProducts.slice(currentLength, currentLength + PRODUCTS_PER_PAGE);
      setDisplayedProducts([...displayedProducts, ...more]);
      setLoadingMore(false);
    }, 600);
  };

  const hasMore = displayedProducts.length < filteredProducts.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <FrontendLayout>
    <div className="py-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-dark font-serif">
            All Products
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our complete collection of exquisite jewelry
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={20} className="text-gray-600" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SortAsc size={20} className="text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 font-semibold">
          Showing {displayedProducts.length} of {filteredProducts.length} products
        </div>

        {/* Products Grid */}
        <ProductGrid products={displayedProducts} loading={false} />

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <Button 
              onClick={loadMore} 
              loading={loadingMore}
              size="lg"
            >
              Load More ({filteredProducts.length - displayedProducts.length} remaining)
            </Button>
          </div>
        )}

        {!hasMore && displayedProducts.length > 0 && (
          <div className="text-center mt-12 text-gray-600">
            You've seen all products!
          </div>
        )}
      </div>
    </div>
    </FrontendLayout>
  );
}