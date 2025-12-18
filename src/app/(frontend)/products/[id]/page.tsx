'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Phone, Heart, Star, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProduct, getProductsByCategory } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice, getWhatsAppURL, calculateDiscount } from '@/lib/utils';
import { useWishlistStore } from '@/store/useWishlistStore';
import toast from 'react-hot-toast';
import { CldImage } from 'next-cloudinary';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await getProduct(params.id as string);
        setProduct(productData);
        
        if (productData) {
          const related = await getProductsByCategory(productData.category || 'Necklaces');  // fallback
          setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleWishlist = () => {
    if (!product) return;
    
    if (inWishlist) {
      removeItem(product.id);
      toast.success('Removed from wishlist');
    } else {
      addItem(product.id);
      toast.success('Added to wishlist');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };
  
  const prevImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  useEffect(() => {
    if (!product || product.images.length <= 1) return;
  
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 4000);
  
    return () => clearInterval(interval);
  }, [product]);  // ← यहीं चेंज

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl text-gray-500 mb-4">Product not found</p>
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <FrontendLayout>
    <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-secondary">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-secondary">Products</a>
          <span>/</span>
          <span className="text-dark">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100 group">
            {/* smooth slide container */}
            <div 
              className="flex transition-transform duration-1000 ease-in-out h-full"
              style={{ transform: `translateX(-${selectedImage * 100}%)` }}
            >
              {product.images.map((img: string, idx: number) => (
                <div key={idx} className="w-full h-full flex-shrink-0">
                  <CldImage
                    width={800}
                    height={800}
                    src={img}
                    alt={`${product.name} - image ${idx + 1}`}
                    className="object-cover w-full h-full"
                    crop="fill"
                    gravity="auto"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </div>

            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full z-10">
                {discount}% OFF
              </div>
            )}

            {/* Navigation Buttons - होवर पर दिखें */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {product.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === selectedImage 
                        ? 'bg-white w-10' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-primary ring-2 ring-primary/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CldImage
                    width={200}
                    height={200}
                    src={img}
                    alt=""
                    className="object-cover"
                    crop="fill"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {product.tags?.map((tag: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-secondary text-white text-sm font-semibold rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold mb-4 text-dark font-serif">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.floor(product.rating) ? '#C9A961' : 'none'}
                  stroke={i < Math.floor(product.rating) ? '#C9A961' : '#ccc'}
                />
              ))}
              <span className="text-gray-600">
                {product.rating} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-secondary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-2xl text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              {product.description || 'Beautiful handcrafted jewelry piece perfect for any occasion.'}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={() => window.open(getWhatsAppURL(product), '_blank')}
                className="flex-1"
                size="lg"
              >
                <Phone size={20} />
                Order on WhatsApp
              </Button>
              <Button 
                variant="outline" 
                onClick={handleWishlist}
                size="lg"
              >
                <Heart 
                  size={20} 
                  fill={inWishlist ? '#8B3A62' : 'none'}
                  stroke={inWishlist ? '#8B3A62' : 'currentColor'}
                />
              </Button>
              <Button variant="outline" onClick={handleShare} size="lg">
                <Share2 size={20} />
              </Button>
            </div>

            {/* Product Details */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold mb-4">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-dark">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Availability</span>
                  <span className={product.inStock ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
                  </span>
                </div>
                {product.customizable && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Customization</span>
                    <span className="text-primary font-semibold">✨ Available</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Product ID</span>
                  <span className="font-mono text-xs text-gray-500">{product.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-dark font-serif">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </FrontendLayout>
  );
}