"use client";

import { useMyOrders, useCancelOrder } from "@/app/hooks/useOrderAction";
import Navbar from "@/components/navbar/Navbar";
import { OrderStatus } from "@/types/order";
import Link from "next/link";

export default function MyOrdersPage() {
  const { data, isLoading } = useMyOrders({ limit: 10 });
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
      [OrderStatus.PAID]: "bg-green-100 text-green-800",
      [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [OrderStatus.CANCELED]: "bg-red-100 text-red-800",
      [OrderStatus.SHIPPED]: "bg-blue-100 text-blue-800",
      [OrderStatus.DELIVERED]: "bg-zinc-100 text-zinc-800",
      [OrderStatus.PROCESSING]: "bg-orange-100 text-orange-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading)
    return <div className="p-10 text-zinc-500">Loading orders...</div>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 pt-25">
      <Navbar />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Order History
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Check the status of your recent purchases.
          </p>
        </div>
        <Link
          href="/profile"
          className="text-sm font-medium text-zinc-600 hover:text-black"
        >
          &larr; Back to Profile
        </Link>
      </div>

      {!data?.data || data.data.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-300 rounded-2xl">
          <p className="text-zinc-500">{`You haven't placed any orders yet.`}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-black underline"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {data.data.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-zinc-500">Order ID</p>
                    <p className="font-medium text-zinc-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Date</p>
                    <p className="font-medium text-zinc-900">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Total Amount</p>
                    <p className="font-medium text-zinc-900">
                      Rp {Number(order.totalPrice).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-600">
                    <p>{order.items?.length || 0} Product(s)</p>
                    {/* preview */}
                    {order.items && order.items.length > 0 && (
                      <span className="text-zinc-400 text-xs">
                        {order.items[0].product?.name}
                        {order.items.length > 1 &&
                          ` +${order.items.length - 1} more`}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/order/status/${order.id}`}
                      className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Details
                    </Link>

                    {order.status === OrderStatus.PENDING && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={isCancelling}
                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        {isCancelling ? "..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
