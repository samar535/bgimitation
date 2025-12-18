// Wishlist Page
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProduct } from '@/lib/firestore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Loader } from '@/components/ui/Loader';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        const productPromises = items.map(id => getProduct(id));
        const productsData = await Promise.all(productPromises);
        setProducts(productsData.filter(p => p !== null));
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (items.length > 0) {
      fetchWishlistProducts();
    } else {
      setLoading(false);
    }
  }, [items]);

  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
      setProducts([]);
      toast.success('Wishlist cleared');
    }
  };

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
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Heart size={24} className="text-secondary" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-dark font-serif">
                  My Wishlist
                </h1>
                <p className="text-gray-600">
                  {items.length} {items.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearWishlist}
                className="hidden md:flex"
              >
                <Trash2 size={18} />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart size={48} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Save your favorite products here to easily find them later
            </p>
            <Link href="/products">
              <Button size="lg">
                <ShoppingBag size={20} />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Clear Button */}
            <div className="md:hidden mb-6">
              <Button
                variant="outline"
                onClick={handleClearWishlist}
                className="w-full"
              >
                <Trash2 size={18} />
                Clear All
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-3 text-dark">
                Ready to order?
              </h3>
              <p className="text-gray-700 mb-6">
                Contact us on WhatsApp to place your order for these beautiful pieces
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg"
                  onClick={() => window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`, '_blank')}
                >
                  Order via WhatsApp
                </Button>
                <Link href="/products">
                  <Button variant="outline" size="lg">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Info Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">💚</span>
            </div>
            <h4 className="font-bold text-lg mb-2">Save Favorites</h4>
            <p className="text-sm text-gray-600">
              Keep track of products you love
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl">🔔</span>
            </div>
            <h4 className="font-bold text-lg mb-2">Get Notified</h4>
            <p className="text-sm text-gray-600">
              We'll alert you about price drops
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h4 className="font-bold text-lg mb-2">Easy Access</h4>
            <p className="text-sm text-gray-600">
              Access your wishlist anytime
            </p>
          </div>
        </div>
      </div>
    </div>
    </FrontendLayout>
  );
}