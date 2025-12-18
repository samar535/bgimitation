import Link from 'next/link';
import { Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-pink-50 to-purple-50 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8 relative">
          <h1 className="text-[180px] md:text-[240px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent leading-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl animate-bounce">💎</div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark font-serif">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for seems to have wandered off. 
          Let's get you back to browsing beautiful jewelry!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary-dark transition-all hover:scale-105 shadow-lg"
          >
            <Home size={20} />
            Back to Home
          </Link>
          
          <Link 
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-secondary border-2 border-secondary rounded-xl font-semibold hover:bg-secondary hover:text-white transition-all hover:scale-105 shadow-lg"
          >
            <ShoppingBag size={20} />
            Browse Products
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-gray-500 text-sm mt-8">
          If you believe this is a mistake, please{' '}
          <Link href="/contact" className="text-primary hover:underline font-semibold">
            contact us
          </Link>
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-10 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
    </div>
  );
}