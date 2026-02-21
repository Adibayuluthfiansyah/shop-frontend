"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/app/service/orderService";
import { useCancelOrder } from "@/app/hooks/useOrderAction";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  TruckIcon,
  XCircle,
  CreditCard,
  Calendar,
} from "lucide-react";
import { OrderStatus } from "@/types/order";
import { format } from "date-fns";
import { toast } from "sonner";
import { useEffect } from "react";
import { MidtransTransactionResult } from "@/types/midtrans";
import {
  getMidtransSnapUrl,
  MIDTRANS_CONFIG,
  isMidtransConfigured,
} from "@/lib/midtrans";

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = Number(params.id);
  const cancelOrder = useCancelOrder();

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
    refetchInterval: (query) => {
      // autorefresh 10s if order is pending payment
      const order = query.state.data;
      return order?.status === OrderStatus.PENDING ? 10000 : false;
    },
  });

  // midtrans snap
  useEffect(() => {
    // checkidtrans is configured
    if (!isMidtransConfigured()) {
      console.warn(
        "Midtrans is not properly configured. Please set NEXT_PUBLIC_MIDTRANS_CLIENT_KEY in your .env file.",
      );
      return;
    }

    const scriptId = "midtrans-snap-script";

    // check if script already loaded
    if (document.getElementById(scriptId)) {
      return;
    }

    const midtransScript = document.createElement("script");
    midtransScript.id = scriptId;
    midtransScript.src = getMidtransSnapUrl();
    midtransScript.setAttribute("data-client-key", MIDTRANS_CONFIG.clientKey);

    midtransScript.onload = () => {
      console.log("Midtrans Snap loaded successfully");
    };

    midtransScript.onerror = () => {
      console.error("Failed to load Midtrans Snap script");
      toast.error("Failed to load payment system");
    };

    document.body.appendChild(midtransScript);

    return () => {
      const script = document.getElementById(scriptId);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = () => {
    if (!order?.snapToken) {
      toast.error("Payment token not available");
      return;
    }

    if (!isMidtransConfigured()) {
      toast.error("Payment system is not configured");
      return;
    }

    if (!window.snap) {
      toast.error("Payment system is not ready. Please refresh the page.");
      return;
    }

    window.snap.pay(order.snapToken, {
      onSuccess: (result: MidtransTransactionResult) => {
        console.log("Payment success:", result);
        toast.success("Payment successful!");
        refetch();
      },
      onPending: (result: MidtransTransactionResult) => {
        console.log("Payment pending:", result);
        toast.info("Waiting for payment confirmation...");
        refetch();
      },
      onError: (result: MidtransTransactionResult) => {
        console.error("Payment error:", result);
        toast.error("Payment failed");
      },
      onClose: () => {
        console.log("Payment popup closed");
        toast.info("Payment popup closed");
      },
    });
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrder.mutateAsync(orderId);
      refetch();
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            {` The order you're looking for doesn't exist.`}
          </p>
          <Button
            onClick={() => router.push("/orders")}
            className="bg-black hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            View My Orders
          </Button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: OrderStatus) => {
    const configs = {
      [OrderStatus.PENDING]: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        label: "Pending Payment",
        description: "Please complete your payment to process this order",
      },
      [OrderStatus.PAID]: {
        icon: CreditCard,
        color: "bg-green-100 text-green-800 border-green-300",
        label: "Payment Confirmed",
        description: "Your payment has been confirmed",
      },
      [OrderStatus.PROCESSING]: {
        icon: Package,
        color: "bg-blue-100 text-blue-800 border-blue-300",
        label: "Processing",
        description: "We're preparing your order",
      },
      [OrderStatus.SHIPPED]: {
        icon: TruckIcon,
        color: "bg-purple-100 text-purple-800 border-purple-300",
        label: "Shipped",
        description: "Your order is on the way",
      },
      [OrderStatus.DELIVERED]: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 border-green-300",
        label: "Delivered",
        description: "Order has been delivered",
      },
      [OrderStatus.CANCELED]: {
        icon: XCircle,
        color: "bg-red-100 text-red-800 border-red-300",
        label: "Cancelled",
        description: "This order has been cancelled",
      },
    };

    return configs[status];
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const totalPrice = parseFloat(order.totalPrice);

  const canCancel = [OrderStatus.PENDING, OrderStatus.PAID].includes(
    order.status,
  );
  const canPay = order.status === OrderStatus.PENDING && order.snapToken;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Back button */}
        <button
          onClick={() => router.push("/orders")}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </button>

        {/* Order header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order #{order.id}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                </div>
                {order.midtransOrderId && (
                  <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {order.midtransOrderId}
                  </div>
                )}
              </div>
            </div>

            {/* Status badge */}
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 ${statusConfig.color}`}
            >
              <StatusIcon className="w-6 h-6" />
              <div>
                <div className="font-bold uppercase tracking-wider text-sm">
                  {statusConfig.label}
                </div>
                <div className="text-xs opacity-80 mt-0.5">
                  {statusConfig.description}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {(canPay || canCancel) && (
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              {canPay && (
                <Button
                  onClick={handlePayment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl font-bold uppercase tracking-wider"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay Now
                </Button>
              )}
              {canCancel && (
                <Button
                  onClick={handleCancelOrder}
                  disabled={cancelOrder.isPending}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider border-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  {cancelOrder.isPending ? "Cancelling..." : "Cancel Order"}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Order timeline */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">
            Order Timeline
          </h2>
          <div className="space-y-4">
            {[
              { status: OrderStatus.PENDING, label: "Order Placed" },
              { status: OrderStatus.PAID, label: "Payment Confirmed" },
              { status: OrderStatus.PROCESSING, label: "Processing" },
              { status: OrderStatus.SHIPPED, label: "Shipped" },
              { status: OrderStatus.DELIVERED, label: "Delivered" },
            ].map((step, index) => {
              const statusIndex = Object.values(OrderStatus).indexOf(
                order.status,
              );
              const stepIndex = Object.values(OrderStatus).indexOf(step.status);
              const isActive = stepIndex <= statusIndex;
              const isCanceled = order.status === OrderStatus.CANCELED;

              return (
                <div key={step.status} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isCanceled
                        ? "bg-gray-200 text-gray-400"
                        : isActive
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isActive && !isCanceled ? "✓" : index + 1}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-semibold ${
                        isCanceled
                          ? "text-gray-400"
                          : isActive
                            ? "text-gray-900"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                </div>
              );
            })}
            {order.status === OrderStatus.CANCELED && (
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500 text-white">
                  <XCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-red-600">
                    Order Cancelled
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => {
              const itemPrice = parseFloat(item.price);
              const itemTotal = itemPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                >
                  <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        item.product?.imageUrl ||
                        "https://placehold.co/200x200/png?text=No+Image"
                      }
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Qty: {item.quantity} × Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(itemPrice)}
                    </p>
                    {item.product?.category && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {item.product.category.name}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      Rp {new Intl.NumberFormat("id-ID").format(itemTotal)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>
                Rp {new Intl.NumberFormat("id-ID").format(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                Rp {new Intl.NumberFormat("id-ID").format(totalPrice)}
              </span>
            </div>
            {order.paymentType && (
              <div className="pt-3 border-t border-gray-200 flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900 uppercase">
                  {order.paymentType}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
