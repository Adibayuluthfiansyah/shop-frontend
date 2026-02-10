import api from "@/lib/axios";
import { Category } from "@/types/category";

export const categoryService = {
    getAllCategories: async () => {
        const res = await api.get<Category[]>('/category');
        return res.data;
    },
    getOne: async (slug:string) => {
        const res = await api.get<Category>(`/category/${slug}`);
        return res.data;
    }
}