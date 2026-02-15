import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Category } from "@/types/category"; 

export const useCategory = (slug?: string) => {
  return useQuery<Category[]>({
    queryKey: ["categories", slug || "all"],
    
    queryFn: async () => {
      const endpoint = slug ? `/category/${slug}` : "/category"; 
      const { data } = await api.get(endpoint);
      return data; 
    },
  });
};