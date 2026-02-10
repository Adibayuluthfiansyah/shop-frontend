import { create } from 'zustand';

interface CartState {
  totalItems: number;
  isOpen: boolean; 
  setTotalItems: (count: number) => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  totalItems: 0,
  isOpen: false,
  setTotalItems: (count) => set({ totalItems: count }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));