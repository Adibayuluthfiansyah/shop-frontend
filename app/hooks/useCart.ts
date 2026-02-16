import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCartStore, CartItem as StoreCartItem } from "@/app/store/useCartStore"; 
import { CartResponse } from "@/types/cart"; 
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export const useCart = () => {
  const { data: session } = useSession();
  const setCart = useCartStore((state) => state.setCart);
  const { data, isLoading, error } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart"); 
      return data;
    },
    enabled: !!session?.user, 
  });

  useEffect(() => {
    if (data && data.items && Array.isArray(data.items)) {
      const mappedItems: StoreCartItem[] = data.items.map((item) => ({
        id: item.product.id,       
        cartItemId: item.id,          
        name: item.product.name,
        price: typeof item.product.price === 'string' 
          ? parseFloat(item.product.price) 
          : Number(item.product.price),
        image: item.product.imageUrl || "https://placehold.co/400x400",
        quantity: item.quantity,
      }));
      setCart(mappedItems);
    }
  }, [data, setCart]);

  return { data, isLoading, error };
};