"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/app/service/productService";
import Image from "next/image";
import { useCartStore } from "@/app/store/useCartStore";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, Package, TruckIcon } from "lucide-react";
import { useState } from "react";
import ProductList from "@/components/product/ProductList";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { status } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
  });

  // Calculate if product is new
  const isNew = product?.createdAt
    ? (() => {
        const productDate = new Date(product.createdAt);
        const currentDate = new Date();
        const daysDifference = Math.floor(
          (currentDate.getTime() - productDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        return daysDifference <= 7;
      })()
    : false;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-8">{`The product you're looking for doesn't exist.`}</p>
          <Button
            onClick={() => router.push("/shop")}
            className="bg-black hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const priceNumber = parseFloat(product.price);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  const imageUrl =
    product.imageUrl || "https://placehold.co/800x800/png?text=No+Image";

  const handleAddToCart = () => {
    if (status === "unauthenticated") {
      toast.error("Please Login or Register to add to cart", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: priceNumber,
      quantity: quantity,
      image: imageUrl,
    });

    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Product detail grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 bg-white rounded-2xl shadow-sm p-8">
          {/* Image section */}
          <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className={`object-contain p-8 ${isOutOfStock ? "grayscale opacity-50" : ""}`}
              priority
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isNew && (
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none text-xs px-3 py-1 uppercase tracking-wider font-bold shadow-md">
                  New Arrival
                </Badge>
              )}
              {isLowStock && (
                <Badge
                  variant="destructive"
                  className="text-xs shadow-md uppercase tracking-wider"
                >
                  Only {product.stock} Left
                </Badge>
              )}
              {isOutOfStock && (
                <Badge className="bg-gray-800 text-white border-none text-xs px-3 py-1 uppercase tracking-wider font-bold shadow-md">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Info section */}
          <div className="flex flex-col">
            {/* Category */}
            <div className="mb-3">
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                {product.category?.name || "General"}
              </span>
            </div>

            {/* Product name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-2 mb-6 pb-6 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-500">Rp</span>
              <span className="text-4xl font-bold text-gray-900 tracking-tight">
                {new Intl.NumberFormat("id-ID").format(priceNumber)}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Description
                </h3>
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Stock info */}
            <div className="flex items-center gap-6 mb-6 py-4 bg-gray-50 rounded-lg px-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Stock
                  </p>
                  <p
                    className={`text-sm font-bold ${isOutOfStock ? "text-red-600" : isLowStock ? "text-orange-600" : "text-green-600"}`}
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : `${product.stock} Available`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Shipping
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    Free Delivery
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            {!isOutOfStock && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold text-gray-700"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    min={1}
                    max={product.stock}
                    className="w-20 h-10 text-center border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold text-gray-700"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    Max: {product.stock}
                  </span>
                </div>
              </div>
            )}

            {/* Add to cart button */}
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isOutOfStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Related Products
          </h2>
          <ProductList
            params={{
              categoryId: product.categoryId,
              limit: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
}
