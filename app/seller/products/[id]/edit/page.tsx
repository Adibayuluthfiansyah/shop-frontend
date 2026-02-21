"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/seller/ProductForm";
import { useProduct, useProductMutations } from "@/app/hooks/useProduct";

export default function EditProductPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: product, isLoading: isFetching } = useProduct(id);
  const { updateProduct } = useProductMutations();

  const handleUpdate = async (data: FormData) => {
    await updateProduct.mutateAsync({ id, payload: data });
  };

  if (isFetching)
    return (
      <div className="p-8 text-center text-zinc-500">
        Loading product data...
      </div>
    );
  if (!product)
    return (
      <div className="p-8 text-center text-red-500">Product not found.</div>
    );

  return (
    <ProductForm
      title={`Edit ${product.name}`}
      isLoading={updateProduct.isPending}
      initialData={product}
      onSubmit={handleUpdate}
    />
  );
}
