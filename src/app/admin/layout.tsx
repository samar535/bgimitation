'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Package, LayoutDashboard, FolderOpen, LogOut, Menu, X, User, TrendingUp, ShoppingCart } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Loader } from '@/components/ui/Loader';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    // { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
    // { href: '/admin/popular-searches', icon: TrendingUp, label: 'Popular Searches' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64 bg-dark text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="hidden text-xl font-bold">
              <span className="text-primary">BG</span>
              <span className="text-accent">i</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="hidden p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">Admin</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {/* <nav className="flex-1 p-4 space-y-2 overflow-y-auto"> */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-all w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 z-40 bg-white shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-bold text-lg">Admin Panel</h1>
          <div className="w-10"></div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}