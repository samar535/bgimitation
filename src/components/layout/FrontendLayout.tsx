import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { Phone } from 'lucide-react';

export const FrontendLayout = ({ children }: { children: React.ReactNode }) => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919024684467';
  
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 lg:bottom-6 w-16 h-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform"
      >
        <Phone size={28} color="white" />
      </a>

      <MobileNav />
    </>
  );
};