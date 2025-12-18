// Format price to Indian currency
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Calculate discount percentage
  export const calculateDiscount = (original: number, current: number): number => {
    return Math.round(((original - current) / original) * 100);
  };
  
  // Generate WhatsApp message
  export const generateWhatsAppMessage = (product: any): string => {
    const message = `Hi! I'm interested in ordering:
  
  *${product.name}*
  Price: ₹${product.price}
  Category: ${product.category}
  
  Please confirm availability and delivery details.`;
    
    return encodeURIComponent(message);
  };
  
  // Get WhatsApp URL
  export const getWhatsAppURL = (product: any): string => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919024684467';
    const message = generateWhatsAppMessage(product);
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };
  
  // Truncate text
  export const truncateText = (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };
  
  // Convert string to slug
  export const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };