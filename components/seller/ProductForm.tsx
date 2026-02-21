"use client";

import { useState } from "react";
import { useCategory } from "@/app/hooks/useCategory";
import { CreateProductRequest, Product } from "@/types/product";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
  title: string;
}

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  title,
}: ProductFormProps) {
  const router = useRouter();
  const { data: categories } = useCategory();

  const [formData, setFormData] = useState<CreateProductRequest>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price ? Number(initialData.price) : 0,
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || (categories && categories.length > 0 ? categories[0].id : 1),
    imageUrl: initialData?.imageUrl || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.categoryId || formData.categoryId === 0) {
      console.error("Please select a valid category");
      return;
    }

    if (formData.price <= 0) {
      console.error("Price must be greater than 0");
      return;
    }

    if (formData.stock < 0) {
      console.error("Stock cannot be negative");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name || "");
    data.append("description", formData.description || "");
    data.append("price", formData.price.toString());
    data.append("stock", formData.stock.toString());
    data.append("categoryId", formData.categoryId.toString());

    if (imageFile) {
      data.append("image", imageFile);
    }

    // Debug: Log FormData contents
    console.log("=== FormData Contents ===");
    for (const [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await onSubmit(data);
      router.push("/seller/dashboard");
    } catch (error) {
      console.error("Submit error:", error);
      // Error handled by useMutation onError
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 pt-20">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link
          href="/seller/dashboard"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          Cancel
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl border border-zinc-200"
      >
        {/* Input Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Input Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Input Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Price (Rp)
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Input Category */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Category
          </label>
          <select
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: Number(e.target.value) })
            }
          >
            <option value={0} disabled>
              Select a category
            </option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input Image */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Product Image
          </label>

          {(imageFile || formData.imageUrl) && (
            <div className="mb-3">
              <Image
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : formData.imageUrl || ""
                }
                alt="Preview"
                width={200}
                height={200}
                className="h-40 w-40 object-cover rounded-lg border border-zinc-200"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="block w-full text-sm text-zinc-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-black file:text-white
              hover:file:bg-zinc-800
              cursor-pointer"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Allowed formats: JPG, PNG, WEBP.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-zinc-900 py-3 text-sm font-bold text-white hover:bg-zinc-700 disabled:opacity-50 transition-all"
        >
          {isLoading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
