import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCartStore, CartItem } from "@/app/store/useCartStore";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

interface BackendCartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string | number; 
    image?: string;
    imageUrl?: string; 
  };
}

export const useCart = () => {
  const { data: session } = useSession();
  const setCart = useCartStore((state) => state.setCart);

  const { data, isLoading, error } = useQuery<BackendCartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart"); 
      return data;
    },
    enabled: !!session?.user, 
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const mappedItems: CartItem[] = data.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: typeof item.product.price === 'string' 
          ? parseFloat(item.product.price) 
          : item.product.price,
        image: item.product.image || item.product.imageUrl || "https://placehold.co/400x400",
        quantity: item.quantity,
      }));

      setCart(mappedItems);
    }
  }, [data, setCart]);

  return { data, isLoading, error };
};