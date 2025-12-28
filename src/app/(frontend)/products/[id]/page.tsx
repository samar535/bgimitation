'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Phone, Heart, ChevronDown, ChevronUp, Share2, ChevronLeft, ChevronRight, ShoppingCart, X } from 'lucide-react';
import { getProduct, getProductsByCategory } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice, getWhatsAppURL, calculateDiscount } from '@/lib/utils';
import { useWishlistStore } from '@/store/useWishlistStore';
import toast from 'react-hot-toast';
import { CldImage } from 'next-cloudinary';
import { FrontendLayout } from '@/components/layout/FrontendLayout';
import { useCartStore } from '@/store/useCartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;
  const [touchStart, setTouchStart] = useState<number | null>(null);
const [touchEnd, setTouchEnd] = useState<number | null>(null);

const minSwipeDistance = 50;
const [galleryOpen, setGalleryOpen] = useState(false);
const [galleryIndex, setGalleryIndex] = useState(0);

const openGallery = (index: number) => {
  setGalleryIndex(index);
  setGalleryOpen(true);
};

const closeGallery = () => {
  setGalleryOpen(false);
};

const prevGalleryImage = (e: React.MouseEvent) => {
  e.stopPropagation();
  setGalleryIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
};

const nextGalleryImage = (e: React.MouseEvent) => {
  e.stopPropagation();
  setGalleryIndex((prev) => (prev + 1) % product.images.length);
};

const onTouchStart = (e: React.TouchEvent) => {
  setTouchEnd(null);
  setTouchStart(e.targetTouches[0].clientX);
};

const onTouchMove = (e: React.TouchEvent) => {
  setTouchEnd(e.targetTouches[0].clientX);
};

const onTouchEnd = () => {
  if (!touchStart || !touchEnd) return;
  const distance = touchStart - touchEnd;
  const isLeftSwipe = distance > minSwipeDistance;
  const isRightSwipe = distance < -minSwipeDistance;

  if (isLeftSwipe) nextImage();
  if (isRightSwipe) prevImage();
};

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    useCartStore.getState().addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    toast.success('Added to cart!');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    } catch {
      // fallback execCommand
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast.success('Link copied!');
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 mb-20">
          {/* Images - Only Main Slider on Main Page */}
          <div>
            <button
              type="button"
              onClick={() => openGallery(selectedImage)}
              className="block w-full focus:outline-none"
            >
              <div 
                className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-gray-100 group cursor-zoom-in"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-700 ease-out h-full"
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

                {/* Click Hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center pointer-events-none">
                  <span className="bg-white/90 px-6 py-3 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Tap to view full gallery ({product.images.length} images)
                  </span>
                </div>

                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full z-10 shadow-lg">
                    {discount}% OFF
                  </div>
                )}

                {/* Navigation Buttons */}
                {product.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-1 md:p-3 bg-white/90 rounded-full shadow-lg hover:bg-white z-10 md:opacity-0 md:group-hover:opacity-100 transition-all"
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 md:p-3 bg-white/90 rounded-full shadow-lg hover:bg-white z-10 md:opacity-0 md:group-hover:opacity-100 transition-all"
                    >
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {product.images.map((_: string, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(idx);
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          idx === selectedImage ? 'bg-white w-10' : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Full Screen Gallery Modal - With Thumbnails at Bottom */}
          {galleryOpen && (
            <div 
              className="fixed inset-0 bg-black z-50 flex flex-col"
              onClick={closeGallery}
            >
              {/* Close Button */}
              <button 
                onClick={closeGallery}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full transition-all z-20"
              >
                <X size={28} />
              </button>

              {/* Main Gallery Image */}
              <div className="flex-1 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                <div className="relative max-w-5xl w-full">
                  <CldImage
                    width={1200}
                    height={1200}
                    src={product.images[galleryIndex]}
                    alt={`${product.name} - full view`}
                    className="object-contain w-full h-full max-h-[80vh] rounded-2xl"
                    crop="fit"
                  />

                  {/* Gallery Navigation */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevGalleryImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-1 md:p-4 bg-white/80 hover:bg-white rounded-full transition-all"
                      >
                        <ChevronLeft size={36} />
                      </button>
                      <button
                        onClick={nextGalleryImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 md:p-4 bg-white/80 hover:bg-white rounded-full transition-all"
                      >
                        <ChevronRight size={36} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnails in Gallery - Bottom Strip */}
              {product.images.length > 1 && (
                <div className="px-4 md:px-8 pb-8 max-w-5xl mx-auto w-full">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {product.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setGalleryIndex(idx);
                        }}
                        className={`flex-shrink-0 w-16 md:w-24 h-16 md:h-24 rounded-lg overflow-hidden border-3 transition-all ${
                          idx === galleryIndex ? 'border-white' : 'border-white/30 hover:border-white/70'
                        }`}
                      >
                        <CldImage
                          width={60}
                          height={60}
                          src={img}
                          alt=""
                          className="object-cover w-full h-full"
                          crop="fill"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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

            <h1 className="text-2xl md:text-4xl font-bold mb-4 text-dark font-serif">
              {product.name}
            </h1>
            
            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl md:text-4xl font-bold text-secondary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl md:text-2xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>                
                  <span className="text-md font-bold text-green-600">
                  (-{discount}%)
                  </span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex gap-4 order-1 md:order-2 justify-center">
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

                <Button
                  variant="outline" 
                  onClick={handleAddToCart}
                  size="lg"
                >
                  <ShoppingCart size={18} />
                </Button>

                <Button variant="outline" onClick={handleShare} size="lg">
                  <Share2 size={20} />
                </Button>
              </div>
              <Button
                onClick={() => window.open(getWhatsAppURL(product), '_blank')}
                className="flex-1 order-2 md:order-1"
                size="lg"
              >
                <Phone size={20} />
                Order on WhatsApp
              </Button>
            </div>

            {/* Product Details */}
            <div className="bg-gray-50 rounded-2xl p-3 sm:p-6 space-y-4">
              <h3 className="text-xl font-bold mb-4">Product Details</h3>
              <div className="space-y-3 text-sm">
              
                <div className="border-b border-gray-200 py-4">
                  <button
                    onClick={() => setDescriptionOpen(!descriptionOpen)}
                    className="w-full flex justify-between items-center text-left group focus:outline-none"
                  >
                    <span className="text-gray-800">Description</span>
                    <div className={`p-1 rounded-full transition-all duration-300 ${
                      descriptionOpen ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-600'
                    } group-hover:bg-secondary/20`}>
                      {descriptionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  <div className={`transition-all duration-700 ease-out overflow-hidden ${
                    descriptionOpen 
                      ? 'max-h-96 opacity-100 translate-y-0' 
                      : 'max-h-0 opacity-0 -translate-y-4'
                  }`}>
                    <p className="text-dark">
                      {product.description || 'Exquisite handcrafted imitation jewelry made with premium materials. Lightweight, skin-friendly, and designed to last. Perfect for daily wear, parties, weddings, or gifting. Each piece tells a story of elegance and tradition.'}
                    </p>
                  </div>
                </div>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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