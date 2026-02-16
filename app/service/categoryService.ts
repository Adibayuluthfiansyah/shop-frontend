import api from "@/lib/axios";
import { Category } from "@/types/category";

/**
 * CATEGORY SERVICE
 * Sinkron dengan backend: /category endpoints
 */
export const categoryService = {
    // Get all categories
    getAllCategories: async () => {
        const res = await api.get<Category[]>('/category');
        return res.data;
    },
    
    // Get single category by slug
    getCategoryBySlug: async (slug: string) => {
        const res = await api.get<Category>(`/category/${slug}`);
        return res.data;
    },
    
    // Legacy method untuk backward compatibility
    getOne: async (slug: string) => {
        return categoryService.getCategoryBySlug(slug);
    }
};