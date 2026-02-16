import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  cartItemId?: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  setCart: (items: CartItem[]) => void; 
  toggleCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === newItem.id);
        let updatedItems;

        if (existingItem) {
          updatedItems = items.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedItems = [...items, { ...newItem, quantity: 1 }];
        }
        

        const total = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
        set({ items: updatedItems, totalItems: total, isOpen: true });
      },

      removeItem: (id) => {
        const { items } = get();
        const updatedItems = items.filter((item) => item.id !== id);
        const total = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
        set({ items: updatedItems, totalItems: total });
      },

      setCart: (newItems) => {
        const total = newItems.reduce((acc, item) => acc + item.quantity, 0);
        set({ items: newItems, totalItems: total });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearCart: () => set({ items: [], totalItems: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);