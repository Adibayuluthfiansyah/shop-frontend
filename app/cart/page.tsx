"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/store/useCartStore";
import { useCart } from "@/app/hooks/useCart";
import { useCartActions } from "../hooks/useCartAction";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isLoading: isCartLoading } = useCart();
  const items = useCartStore((state) => state.items);

  const {
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
    isUpdating,
  } = useCartActions();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  if (!session) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!session) {
      toast.error("Silakan login untuk checkout", {
        action: { label: "Login", onClick: () => router.push("/login") },
      });
      return;
    }
    router.push("/checkout");
  };

  if (isCartLoading && items.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 pt-25">
        <Navbar />
        <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <Link href="/shop">
          <Button className="mt-4 bg-black text-white px-8 py-3 rounded-full">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* list items */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex gap-4 py-4 border-b border-gray-100 last:border-0 ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
              >
                {/* Image */}
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Price: Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      disabled={isUpdating}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    {/* quantity control */}
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1 || isUpdating}
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity - 1)
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="font-bold text-gray-900">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        item.price * item.quantity,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 font-medium hover:underline mt-4"
            >
              Clear Shopping Cart
            </button>
          </div>

          {/* order */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    Rp {new Intl.NumberFormat("id-ID").format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (11%)</span>
                  <span>Rp {new Intl.NumberFormat("id-ID").format(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>Rp {new Intl.NumberFormat("id-ID").format(total)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-black text-white hover:bg-gray-800 h-12 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
