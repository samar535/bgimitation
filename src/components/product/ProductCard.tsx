'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Phone, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice, calculateDiscount, getWhatsAppURL } from '@/lib/utils';
import { CldImage } from 'next-cloudinary';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const isSoldOut = !(product.inStock && product.stockQuantity > 0);

  // Auto slide
  useEffect(() => {
    if (product.images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [product.images.length, isHovered]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product.id);
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

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    window.open(getWhatsAppURL(product), '_blank');
  };

  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <div
      className={`group relative bg-white/95 rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${
        isSoldOut ? 'opacity-70' : 'hover:shadow-xl hover:-translate-y-1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tags */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {product.tags?.map((tag, idx) => (
          <span 
            key={idx}
            className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
              tag === 'New' ? 'bg-accent' : 'bg-secondary'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Wishlist + Cart Icons */}
      <div className="absolute top-3 right-2 z-10 grid gap-2">
        <button
          onClick={handleWishlist}
          className="p-2 bg-white rounded-full shadow-md hover:scale-110 transition-all"
        >
          <Heart 
            size={18} 
            fill={inWishlist ? '#8B3A62' : 'none'}
            stroke={inWishlist ? '#8B3A62' : '#2C1810'}
          />
        </button>
        {!isSoldOut && (
          <button
            onClick={handleAddToCart}
            className="p-2 bg-white rounded-full shadow-md hover:scale-110 transition-all"
          >
            <ShoppingCart size={18} className="text-gray-700" />
          </button>
        )}
      </div>

      {/* Image Slider - Sold Out पर Link नहीं */}
      <div className="relative w-full h-auto sm:h-80 md:h-96 lg:h-[420px] bg-gray-50">
        {isSoldOut ? (
          // Sold Out Overlay
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-white text-3xl font-bold">Sold Out</span>
          </div>
        ) : (
          // Active पर पूरा div Link में रैप
          <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" />
        )}

        {/* स्लाइडर — हमेशा दिखेगा */}
        <div 
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {product.images.map((img: string, idx: number) => (
            <div key={idx} className="w-full h-full flex-shrink-0">
              <CldImage
                width={600}
                height={600}
                src={img}
                alt={`${product.name} - image ${idx + 1}`}
                className="object-cover w-full h-full"
                crop="fill"
                gravity="auto"
              />
            </div>
          ))}
        </div>

        {/* Left/Right Buttons - hover पर */}
        {product.images.length > 1 && isHovered && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all z-20"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all z-20"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots Indicator - हमेशा दिखेगा, z-20 से ऊपर */}
        {product.images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 z-20">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  idx === currentImage 
                    ? 'bg-white w-8' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info - Responsive & Compact */}
      <div className="p-2 md:p-4">
        {/* Name */}
        <Link href={`/products/${product.id}`} className={isSoldOut ? 'pointer-events-none' : ''}>
          <h3 className="text-base md:text-lg font-serif font-medium text-gray-900 mb-1 line-clamp-2 hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price + Discount*/}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-lg md:text-2xl font-bold text-secondary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm md:text-base text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs md:text-sm font-bold text-green-600 px-2 py-1 rounded-full">
                (-{discount}%)
              </span>
            </>
          )}
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppOrder}
          disabled={isSoldOut}
          className={`w-full py-2.5 md:py-3 rounded-full font-medium text-white transition-all flex items-center justify-center gap-2 text-sm md:text-base ${
            isSoldOut
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-secondary hover:bg-secondary-dark shadow-md'
          }`}
        >
          <Phone className="text-md sm:text-2xl" />
          <span className="hidden sm:inline">
            {isSoldOut ? 'Sold Out' : 'Order on WhatsApp'}
          </span>
          <span className="sm:hidden">
            {isSoldOut ? 'Sold Out' : 'WhatsApp'}
          </span>
        </button>
      </div>
    </div>
  );
};