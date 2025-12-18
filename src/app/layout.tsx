// src/app/layout
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
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
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.className}`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}