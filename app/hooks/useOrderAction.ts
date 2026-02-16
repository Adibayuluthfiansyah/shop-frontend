import { useMutation, useQuery } from "@tanstack/react-query";
import { orderService } from "@/app/service/orderService";
import { useOrderStore } from "@/app/store/useOrderStore";
import { useCartStore } from "@/app/store/useCartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OrderQueryParams, Order } from "@/types/order";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";

export const useCheckout = () => {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: () => orderService.createOrder(),
    onSuccess: (order: Order) => {
      toast.success("Order Created!");
      clearCart();
      router.push(`/order/status/${order.id}`);
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err.message || "Checkout Failed");
    }
  });
};


export const useAdminOrders = (params?: OrderQueryParams) => {
  const setOrders = useOrderStore((state) => state.setOrders);

  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: async () => {
      const data = await orderService.getAllOrders(params);
      setOrders(data.data);
      return data;
    }
  });
};

export const useSellerOrders = (params?: OrderQueryParams) => {
  const setOrders = useOrderStore((state) => state.setOrders);

  return useQuery({
    queryKey: ["seller-orders", params],
    queryFn: async () => {
      const data = await orderService.getSellerOrders(params);
      setOrders(data.data);
      return data;
    }
  });
};

export const useMyOrders = (params? : OrderQueryParams) => {
  return useQuery({
    queryKey: ["my-orders", params],
    queryFn: async () => {
      const data = await orderService.getMyOrders(params);
      return data;
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
       const msg = err.message || "Failed to cancel order";
       toast.error(msg);
    }
  });
} 