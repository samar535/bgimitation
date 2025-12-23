'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';  
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();  // ← करंट पाथ पता करने के लिए
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const wishlistItems = useWishlistStore((state) => state.items.length);
  const cartItems = useCartStore((state) => state.getTotalItems());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };
  // Navigation items
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/category/bangles', label: 'Collections' },
    // { href: '/about', label: 'About' },
    // { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hidden flex items-center gap-2">
            <div className="text-3xl font-bold">
              <span className="text-primary">BG</span>
              <span className="text-secondary">i</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    isActive
                      ? 'text-secondary'  // active पेज पर secondary कलर
                      : 'text-gray-700 hover:text-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Icons - Desktop + Mobile */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search size={22} />
            </button>

            {/* Wishlist Icon - Desktop पर दिखाओ */}
            <Link href="/wishlist" className="hidden md:block relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart size={22} fill={wishlistItems > 0 ? '#8B5CF6' : 'none'} stroke={wishlistItems > 0 ? '#8B5CF6' : '#374151'} />
              {wishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistItems}
                </span>
              )}
            </Link>

            {/* Cart Icon - Desktop पर दिखाओ */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart size={22} />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-4">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewelry..."
                className="w-full px-5 py-4 pr-14 rounded-full border-2 border-gray-200 focus:border-secondary outline-none"
                autoFocus
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-secondary text-white rounded-full hover:bg-secondary-dark">
                <Search size={20} />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
};