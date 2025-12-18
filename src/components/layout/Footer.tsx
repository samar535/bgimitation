import React from 'react';
import Link from 'next/link';
import { Instagram, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 bg-dark text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-primary">BG</span>
              <span className="text-accent">i</span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium quality imitation jewelry for every occasion.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Collections</Link></li>
              <li><Link href="/care-guide" className="hover:text-white transition-colors">Care Guide</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Return Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                <Phone size={16} />
                +91 98765 43210
              </a>
              <a href="mailto:info@bgjewelry.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                <Mail size={16} />
                info@bgjewelry.com
              </a>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-all hover:scale-110">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 BG Imitation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};