'use client';

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { CldImage } from 'next-cloudinary';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const handleWhatsApp = () => {
    if (items.length === 0) return;
  
    let message = "Hi! I'd like to place an order 🙏\n\n";
    message += "*My Order Details:*\n\n";
  
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Price: ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}\n`;
      message += `   🔗 View Image: ${item.image}\n\n`;  // ← URL यहाँ, क्लिक करने पर इमेज खुलेगी
    });
  
    message += `🧾 *Total Amount: ₹${getTotalPrice()}*\n\n`;
    message += "Please confirm availability and delivery details.\n";
    message += "Thank you! 😊";
  
    const whatsappUrl = `https://wa.me/919024684467?text=${encodeURIComponent(message)}`;  // अपना नंबर डालो
    window.open(whatsappUrl, '_blank');
  
    toast.success('Order sent to WhatsApp! Customer can click links to see images.');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-dark font-serif">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Add some beautiful jewelry to get started!
          </p>
          <Link href="/products">
            <Button size="lg" className='cursor-pointer'>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FrontendLayout>
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-dark font-serif">
          Your Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
            <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some beautiful jewelry to get started!</p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-4 md:p-8">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-6 py-6 border-b last:border-0">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md">
                    <CldImage
                      width={128}
                      height={128}
                      src={item.image}
                      alt={item.name}
                      className="object-cover"
                      crop="fill"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">₹{item.price} each</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-600 hover:text-dark">
                          <Minus size={18} />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-600 hover:text-dark">
                          <Plus size={18} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}

              <div className="mt-12 pt-8 border-t-4 border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-8">
                  <p className="text-2xl font-semibold">Total</p>
                  <p className="text-4xl font-bold text-secondary">₹{getTotalPrice()}</p>
                </div>

                <Button 
                  onClick={handleWhatsApp} 
                  size="lg" 
                  className="w-full px-4! md:px-8! py-3! md:py-6! text-lg font-bold flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700"
                >
                  <Phone size={24} />
                  Send Order to WhatsApp
                </Button>
              </div>
          </div>
        )}
      </div>
    </div>
    </FrontendLayout>
  );
}