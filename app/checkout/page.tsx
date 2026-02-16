"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { useCheckout } from "@/app/hooks/useOrderAction";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const { mutate: checkout, isPending } = useCheckout();
  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
  }, [items]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    checkout();
  };

  if (items.length === 0) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-medium text-zinc-900">
          Your cart is empty
        </h2>
        <Link
          href="/"
          className="text-sm text-zinc-500 underline hover:text-black"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-12 text-3xl font-bold tracking-tight text-zinc-900">
        Checkout
      </h1>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Order Summary */}
        <div className="lg:col-span-7 space-y-6">
          <ul className="divide-y divide-zinc-100 border-t border-zinc-100">
            {items.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-zinc-900">
                      <h3>{item.name}</h3>
                      <p className="ml-4">
                        Rp {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-zinc-500">Qty {item.quantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Action */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-zinc-50 p-8 shadow-sm ring-1 ring-zinc-900/5">
            <h2 className="text-lg font-medium text-zinc-900">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                <dt className="text-base font-medium text-zinc-900">Total</dt>
                <dd className="text-base font-medium text-zinc-900">
                  Rp {total.toLocaleString()}
                </dd>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isPending}
                className="w-full rounded-full bg-zinc-900 py-4 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
