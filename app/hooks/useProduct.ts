import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/app/service/productService";
import { ProductQueryParams } from "@/types/product";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";

interface ErrorResponse {
    message: string | string[];
    statusCode?: number;
    error?: string;
}

export const useProducts = (queryParams?: ProductQueryParams) => {
    return useQuery({
        queryKey: ['products', queryParams],
        queryFn: async () => {
            return productService.getAllProducts(queryParams);
        }
    });
};

export const useSellerProducts = (queryParams?: ProductQueryParams) => {
    const { data: session } = useSession();
    
    return useQuery({
        queryKey: ['seller-products', queryParams],
        queryFn: async () => {
            return productService.getAllProducts(queryParams);
        },
        enabled: !!session?.user && session.user.role === 'SELLER',
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProductById(id),
        enabled: !!id, 
    });
};

export const useProductMutations = () => {
    const queryClient = useQueryClient();

    const createProduct = useMutation({
        mutationFn: (payload: FormData) => 
            productService.createProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["seller-products"] });
            toast.success("Product created successfully");
        },
        onError: (err: Error | AxiosError<ErrorResponse>) => {
            console.error("Create product error:", err);
            
            let message = "Failed to create product";
            
            if (err instanceof AxiosError && err.response?.data) {
                const errorData = err.response.data;
                message = Array.isArray(errorData.message) 
                    ? errorData.message.join(", ") 
                    : errorData.message || message;
            } else if (err.message) {
                message = err.message;
            }
            
            toast.error(message);
        }
    });

    const updateProduct = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: FormData}) => 
            productService.updateProduct(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["seller-products"] });
            toast.success("Product updated successfully");
        },
        onError: (err: Error | AxiosError<ErrorResponse>) => {
            let message = "Failed to update product";
            
            if (err instanceof AxiosError && err.response?.data) {
                const errorData = err.response.data;
                message = Array.isArray(errorData.message) 
                    ? errorData.message.join(", ") 
                    : errorData.message || message;
            } else if (err.message) {
                message = err.message;
            }
            
            toast.error(message);
        }
    });

    const deleteProduct = useMutation({
        mutationFn: (id: number) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["seller-products"] });
            toast.success("Product deleted successfully");
        },
        onError: (err: Error | AxiosError<ErrorResponse>) => {
            let message = "Failed to delete product";
            
            if (err instanceof AxiosError && err.response?.data) {
                const errorData = err.response.data;
                message = Array.isArray(errorData.message) 
                    ? errorData.message.join(", ") 
                    : errorData.message || message;
            } else if (err.message) {
                message = err.message;
            }
            
            toast.error(message);
        }
    });

    return {
        createProduct,
        updateProduct,
        deleteProduct,
    };
};