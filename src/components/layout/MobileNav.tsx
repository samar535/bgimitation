// Update Mobile Navigation (Optional)
'use client';

import Link from 'next/link';
import { Home, ShoppingBag, Heart, User, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore'; 

export const MobileNav = () => {
  const pathname = usePathname();
  const wishlistItems = useWishlistStore((state) => state.items);
  const cartItems = useCartStore((state) => state.getTotalItems());

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/products', icon: ShoppingBag, label: 'Shop' },
    { href: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlistItems.length },
    { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartItems },
    { href: '/about', icon: User, label: 'About' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? 'text-secondary' : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <item.icon size={24} />
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};