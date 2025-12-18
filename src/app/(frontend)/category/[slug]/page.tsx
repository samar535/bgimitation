// Category Page (Products by Category)

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductsByCategory } from '@/lib/firestore';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Loader } from '@/components/ui/Loader';
import { ArrowLeft, SortAsc } from 'lucide-react';
import { Product } from '@/types/product';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    
    const [products, setProducts] = useState<Product[]>([]); 
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); 
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');

  // Convert slug to category name
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory(categoryName);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Sort products
  useEffect(() => {
    let sorted = [...products];
    
    if (sortBy === 'priceLow') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } 
    // else if (sortBy === 'popular') {
    //   sorted.sort((a, b) => b.rating - a.rating);
    // }

    setFilteredProducts(sorted);
  }, [sortBy, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <FrontendLayout>
    <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-secondary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-secondary">Products</Link>
          <span>/</span>
          <span className="text-dark font-semibold">{categoryName}</span>
        </div>

        {/* Back Button */}
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          All Products
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-dark font-serif">
            {categoryName}
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our beautiful collection of {categoryName.toLowerCase()}
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white rounded-2xl p-4 shadow-md">
          {/* Results Count */}
          <div className="text-gray-600">
            <span className="font-semibold text-dark">{filteredProducts.length}</span> products found
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <SortAsc size={20} className="text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary outline-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} loading={false} />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No products found in this category
            </h2>
            <p className="text-gray-600 mb-6">
              Check back soon for new arrivals!
            </p>
            <Link 
              href="/products"
              className="inline-block px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary-dark transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Category Info (Optional) */}
        {filteredProducts.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-dark font-serif">
              About {categoryName}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our {categoryName.toLowerCase()} collection features handcrafted pieces that blend 
              traditional elegance with contemporary design. Each piece is carefully curated 
              to ensure the highest quality and style. Perfect for weddings, festivals, 
              and special occasions.
            </p>
          </div>
        )}
      </div>
    </div>
    </FrontendLayout>
  );
}