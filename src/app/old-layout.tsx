import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

import { Phone } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BG Imitation - Premium Jewelry Collection',
  description: 'Discover exquisite handcrafted imitation jewelry for every occasion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919024684467';
  
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.className}`}>  {/* ← यही चेंज */}
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
        
        {/* WhatsApp Floating Button */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-16 h-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform"
        >
          <Phone size={28} color="white" />
        </a>

        <MobileNav />
      </body>
    </html>
  );
}