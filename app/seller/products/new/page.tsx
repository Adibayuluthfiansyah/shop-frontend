"use client";

import ProductForm from "@/components/seller/ProductForm";
import { useProductMutations } from "@/app/hooks/useProduct";
import Navbar from "@/components/navbar/Navbar";

export default function NewProductPage() {
  const { createProduct } = useProductMutations();

  const handleCreate = async (data: FormData) => {
    await createProduct.mutateAsync(data);
  };

  return (
    <div>
      <Navbar />
      <ProductForm
        title="Add New Product"
        isLoading={createProduct.isPending}
        onSubmit={handleCreate}
      />
    </div>
  );
}
