import React from 'react';
import Link from 'next/link';
import { Instagram, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="px-4 bg-dark text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold mb-4">
              <span className="text-primary">BG</span>
              <span className="text-accent">i</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Quality imitation jewelry for every occasion, crafted with care and style for everyday and festive wear.            
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:grid-cols-2 lg:gap-12">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors block">About Us</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors block">Collections</Link></li>
                <li><Link href="/care-guide" className="hover:text-white transition-colors block">Care Guide</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Customer Care</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/contact" className="hover:text-white transition-colors block">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors block">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors block">Return Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold mb-4 text-lg">Get in Touch</h4>
            <div className="space-y-4">
              <a href="tel:+919876543210" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <Phone size={18} />
                +91 98765 43210
              </a>
              <a href="mailto:info@bgjewelry.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <Mail size={18} />
                info@bgjewelry.com
              </a>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
          <p>© 2025 BG Imitation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};