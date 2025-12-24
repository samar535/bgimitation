'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, Menu, X, Home, Package, User, Sparkles, Layers, Phone } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useRouter, usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/products', icon: Package, label: 'Products' },
    { href: '/category/bangles', icon: Layers, label: 'Collections' },
    { href: '/about', icon: User, label: 'About' },
    { href: '/contact', icon: Phone, label: 'Contact' },
    { href: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlistItems },
    { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartItems },
  ];
  

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className='flex gap-3'>
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <Menu size={26} />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="text-3xl font-bold">
                  <span className="text-primary">BG</span>
                  <span className="text-secondary">i</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.slice(0, 5).map((item) => (  // Wishlist/Cart को अलग रखा
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    pathname === item.href ? 'text-secondary' : 'text-gray-700 hover:text-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <Search size={22} />
              </button>
              
              {/* Wishlist (Desktop only) */}
              <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full">
                <Heart size={22} fill={wishlistItems > 0 ? '#8B3A62' : 'none'} />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
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
            <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
              <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jewelry..."
                  className="w-full px-5 py-4 pr-14 rounded-full border-2 border-gray-200 focus:border-secondary outline-none transition-all"
                  autoFocus
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-secondary text-white rounded-full hover:bg-secondary-dark transition-all">
                  <Search size={20} />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar */}
      <>
        {/* Backdrop */}
        <div className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="text-3xl font-bold">
                <span className="text-primary">BG</span>
                <span className="text-secondary">i</span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-secondary shadow-md'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={22} />
                    <span className="font-medium text-lg">{item.label}</span>
                  </div>

                  {item.badge != null && item.badge > 0 && (
                    <span className="bg-secondary text-white text-xs px-3 py-1 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>
      </>

    </>
  );
};