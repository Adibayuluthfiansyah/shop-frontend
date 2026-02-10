import { Category } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../service/categoryService";

export const useCategories = () => {
    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: categoryService.getAllCategories,
        staleTime: 1000 * 60 * 60,
    });
};

export const useCategory = (slug: string) => {
    return useQuery<Category>({
        queryKey: ['category', slug],
        queryFn: () => categoryService.getOne(slug),
        enabled: !!slug,
    })
    
}