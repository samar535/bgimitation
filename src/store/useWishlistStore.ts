import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[]; // Product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (productId) => {
        set((state) => ({
          items: [...state.items, productId],
        }));
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },
      
      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'bg-jewelry-wishlist',
    }
  )
);