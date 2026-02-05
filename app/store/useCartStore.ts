"use client"
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}


export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (newItem) => set((state) => {
        //check if item already exists in cart

        const existingItem = state.items.find((i) => i.productId === newItem.productId);
        if (existingItem) {
          // if exists, update quantity
          return {
            items: state.items.map((i) =>   
              i.productId === newItem.productId
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            ),
          };
        }
        
        // if not exists, add as new item
        return { items: [...state.items, newItem] };

      }),
      removeFromCart: (id) => set((state) => ({
        items: state.items.filter((i) => i.productId !== id),
      })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'shopping-cart-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);