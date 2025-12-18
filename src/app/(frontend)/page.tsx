'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/firestore';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/product';
import { Category } from '@/types/product';
import { CldImage } from 'next-cloudinary';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData.slice(0, 8)); // First 8 products
      setCategories(categoriesData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <FrontendLayout>
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-light via-pink-50 to-light">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-primary/20 text-secondary">
            <Sparkles size={18} />
            <span className="text-sm font-semibold">Premium Quality Guaranteed</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-dark font-serif">
            Elegance Meets
            <br />
            <span className="text-secondary">Tradition</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our exquisite collection of handcrafted imitation jewelry.
            Perfect for every occasion, designed with love.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/products">
              <Button size="lg">
                Shop Now
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg">
                View Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-dark font-serif">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories
              .sort((a, b) => (a.order || 0) - (b.order || 0))  // ← order के हिसाब से सॉर्ट
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3"
                >
                  {/* Category Image */}
                  <div className="aspect-square relative">
                    {cat.imageUrl ? (
                      <CldImage
                        width={400}
                        height={400}
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        crop="fill"
                        gravity="auto"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-2">💎</div>
                          <p className="text-sm text-gray-600 font-medium">No Image</p>
                        </div>
                      </div>
                    )}

                    {/* Overlay with Name */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-6">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-dark font-serif">
            Trending Now
          </h2>
          <ProductGrid products={products} loading={loading} />

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </FrontendLayout>
  );
}