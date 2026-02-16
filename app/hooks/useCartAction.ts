"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/app/service/cartService";
import { useCartStore, CartItem } from "@/app/store/useCartStore";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const useCartActions = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const store = useCartStore();

  const isLoggedIn = !!session?.user;
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) => {
      return cartService.updateCart(cartItemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => toast.error("Gagal update keranjang"),
  });

  const removeItemMutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      return cartService.removeFromCart(cartItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item dihapus");
    },
    onError: () => toast.error("Gagal hapus item"),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return cartService.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      store.clearCart(); // Clear local juga
      toast.success("Keranjang dikosongkan");
    },
  });


  const handleUpdateQuantity = (item: CartItem, newQty: number) => {
    if (newQty < 1) return;

    if (isLoggedIn && item.cartItemId) {
      updateQuantityMutation.mutate({ cartItemId: item.cartItemId, quantity: newQty });
    } else {
      const diff = newQty - item.quantity;
      if (diff > 0) {
         store.addItem({ ...item, quantity: diff });
      } else {
         store.removeItem(item.id); 
         if(newQty > 0) store.addItem({ ...item, quantity: newQty });
      }
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    if (isLoggedIn && item.cartItemId) {
      removeItemMutation.mutate(item.cartItemId);
    } else {
      store.removeItem(item.id); 
      toast.success("Item removed");
    }
  };

  const handleClearCart = () => {
    if (isLoggedIn) {
        clearCartMutation.mutate();
    } else {
        store.clearCart();
    }
  }

  return {
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
    isUpdating: updateQuantityMutation.isPending || removeItemMutation.isPending
  };
};