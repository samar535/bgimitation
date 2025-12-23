'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice, calculateDiscount, getWhatsAppURL } from '@/lib/utils';
import { CldImage } from 'next-cloudinary';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isSoldOut = !(product.inStock && product.stockQuantity > 0);

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    window.open(getWhatsAppURL(product), '_blank');
  };

  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        isSoldOut 
          ? 'opacity-70 cursor-not-allowed' 
          : 'hover:shadow-xl hover:-translate-y-2 cursor-pointer'
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

      {/* Single Image - No Slider */}
      <div className="relative w-full aspect-square bg-gray-50">
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-white text-2xl font-bold">Sold Out</span>
          </div>
        )}

        {product.images[0] ? (
          <CldImage
            width={600}
            height={600}
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full h-full"
            crop="fill"
            gravity="auto"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">No Image</span>
          </div>
        )}

        {/* Link - Sold Out पर डिसेबल */}
        {!isSoldOut && (
          <Link href={`/products/${product.id}`} className="absolute inset-0 z-20" />
        )}
      </div>

      {/* Product Info */}
      <div className="p-2 md:p-4">
        <h3 className={`text-md md:text-lg font-semibold mb-1 line-clamp-2 ${isSoldOut ? 'text-gray-500' : 'text-gray-800 hover:text-secondary'}`}>
          {product.name}
        </h3>
        
        {/* Price + Discount*/}
        <div className="flex items-center gap-2 mb-0 sm:mb-3 flex-wrap">
          <span className="text-md md:text-2xl font-bold text-secondary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm md:text-base text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs md:text-sm font-bold text-green-600">
                (-{discount}%)
              </span>
            </>
          )}
        </div>
        
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppOrder}
          disabled={isSoldOut}
          className={`w-full py-2.5 rounded-lg font-medium text-white transition-all hidden sm:flex items-center justify-center gap-2 text-sm sm:text-base ${
            isSoldOut
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-secondary hover:bg-secondary-dark'
          }`}
        >
          <Phone className="w-4 sm:w-5 h-4 sm-h-5" />
          <span className="hidden xs:inline">
            {isSoldOut ? 'Sold Out' : 'Order on WhatsApp'}
          </span>
          <span className="xs:hidden">
            {isSoldOut ? 'Out' : 'WhatsApp'}
          </span>
        </button>
      </div>
    </div>
  );
};