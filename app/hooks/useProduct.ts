import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/app/service/productService";
import { ProductQueryParams, CreateProductRequest } from "@/types/product";
import { toast } from "sonner";
import { useSession } from "next-auth/react";


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
        mutationFn: (payload: CreateProductRequest) => 
            productService.createProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["seller-products"] });
            toast.success("Product created successfully");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Failed to create product");
        }
    });

    const updateProduct = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateProductRequest> }) => 
            productService.updateProduct(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["seller-products"] });
            toast.success("Product updated successfully");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Failed to update product");
        }
    });

    const deleteProduct = useMutation({
        mutationFn: (id: number) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["seller-products"] });
            toast.success("Product deleted successfully");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Failed to delete product");
        }
    });

    return {
        createProduct,
        updateProduct,
        deleteProduct,
    };
};