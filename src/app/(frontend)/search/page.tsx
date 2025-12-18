'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts, getCategories, getPopularSearches } from '@/lib/firestore';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Loader } from '@/components/ui/Loader';
import { Search, ArrowLeft, Filter, SortAsc, X, Sliders, TrendingUp, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
  
        setAllProducts(productsData);
  
        // डायनामिक कैटेगरी लोड करो
        const categoryNames = categoriesData.map(cat => cat.name);
        setCategories(['All', ...categoryNames]);
  
        // प्राइस रेंज ऑटो सेट करो
        const prices = productsData.map(p => p.price || 0);
        const minPrice = Math.min(...prices, 0);
        const maxPrice = Math.max(...prices, 1000);
        setPriceRange({ min: minPrice, max: maxPrice });
  
        // सर्च क्वेरी से फिल्टर (अगर है तो)
        let results = productsData;
        if (query) {
          const lowerQuery = query.toLowerCase();
          results = results.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
          );
        }
  
        setFilteredProducts(results);

        const popularData = await getPopularSearches();
        setPopularSearches(popularData.map(search => search.term));

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (query) setSearchTerm(query);
    fetchData();
  }, [query]);

  useEffect(() => {
    let results = [...allProducts];

    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description?.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery) ||
          product.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    if (selectedCategory !== 'All') {
      results = results.filter((p) => p.category === selectedCategory);
    }

    results = results.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    if (sortBy === 'priceLow') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'popular') {
      results.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(results);
  }, [searchTerm, allProducts, selectedCategory, sortBy, priceRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange({ min: 0, max: 10000 });
    setSortBy('relevance');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader size="lg" />
      </div>
    );
  }

  

  return (
    <FrontendLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Search Section */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-accent py-8 md:py-16 overflow-hidden">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Back Button - Compact */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="text-center">
            {/* Badge - Smaller */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4 text-white">
              <Sparkles size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider">Premium Collection</span>
            </div>

            {/* Heading - Tight Spacing */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 font-serif drop-shadow-md">
              Find Your Perfect Piece
            </h1>

            {/* Subtitle - Compact */}
            <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Discover handcrafted imitation jewelry for every occasion
            </p>

            {/* Search Bar - Slimmer */}
            <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={22} />
                
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search necklaces, earrings, bridal sets..."
                  className="w-full pl-14 pr-36 py-4 rounded-full text-base text-gray-900 bg-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                  autoFocus
                />
                
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-7 py-3 bg-dark text-white rounded-full hover:bg-dark/90 transition-all font-semibold text-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular Searches - Compact Grid */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-primary" />
                  <h3 className="text-lg font-bold text-dark">
                    Popular Searches
                  </h3>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchTerm(term);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                      }}
                      className="px-4 py-2.5 bg-gray-50 hover:bg-primary/10 rounded-lg text-sm font-medium text-gray-700 hover:text-secondary transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Results Header */}
        <div className="mb-8">
          {query && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Search results for:</p>
                  <h2 className="text-2xl font-bold text-dark">"{query}"</h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Found <span className="font-bold text-secondary">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Sliders size={18} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-dark flex items-center gap-2">
                  <Filter size={20} />
                  Filters & Sorting
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-secondary transition-colors flex items-center gap-1"
                >
                  <X size={16} />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                    <Filter size={16} />
                    Category
                  </label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3 cursor-pointer rounded-xl font-medium transition-all ${
                          selectedCategory === cat
                            ? 'bg-secondary text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-4 block">
                    Price Range: ₹{priceRange.min} - ₹{priceRange.max}
                  </label>
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs text-gray-600 mb-2 block">Min Price: ₹{priceRange.min}</label>
                      <input
                        type="range"
                        min="30"
                        max="700"
                        step="10"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                        className="w-full accent-secondary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-2 block">Max Price: ₹{priceRange.max}</label>
                      <input
                        type="range"
                        min="30"
                        max="700"
                        step="10"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                        className="w-full accent-secondary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[100, 300, 500, 1000].map((price) => (
                        <button
                          key={price}
                          onClick={() => setPriceRange({ min: 0, max: price })}
                          className="px-3 py-2 bg-gray-50 cursor-pointer hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Under ₹{price}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                    <SortAsc size={16} />
                    Sort By
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'relevance', label: 'Relevance', icon: Star },
                      { value: 'newest', label: 'Newest First', icon: TrendingUp },
                      { value: 'popular', label: 'Most Popular', icon: Star },
                      { value: 'priceLow', label: 'Price: Low to High', icon: SortAsc },
                      { value: 'priceHigh', label: 'Price: High to Low', icon: SortAsc },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl font-medium transition-all ${
                          sortBy === option.value
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <option.icon size={16} />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {searchTerm || query ? (
          filteredProducts.length > 0 ? (
            <>
              <ProductGrid products={filteredProducts} loading={false} />
              
              {/* Load More (Optional) */}
              {filteredProducts.length > 12 && (
                <div className="text-center mt-12">
                  <p className="text-gray-600 mb-4">
                    Showing {Math.min(12, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                </div>
              )}
            </>
          ) : (
            /* No Results */
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Search size={64} className="text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3 font-serif">
                No Results Found
              </h2>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                We couldn't find any products matching "{query}". Try different keywords or browse all products.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={clearFilters} className='cursor-pointer'>
                  Clear Filters
                </Button>
                <Link href="/products">
                  <Button variant="outline" className='cursor-pointer'>
                    Browse All Products
                  </Button>
                </Link>
              </div>
            </div>
          )
        ) : (
          /* Initial State */
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Search size={64} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3 font-serif">
              What are you looking for?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Start searching to discover beautiful jewelry pieces
            </p>
          </div>
        )}

        {/* Categories Quick Links */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-dark font-serif">
              Browse by Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.filter(c => c !== 'All').map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all text-center group"
                >
                  <p className="font-semibold text-dark group-hover:text-secondary transition-colors">
                    {cat}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </FrontendLayout>
  );
}