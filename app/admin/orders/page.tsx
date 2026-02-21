"use client";

import { useState } from "react";
import { useAdminOrders } from "@/app/hooks/useOrderAction";
import Navbar from "@/components/navbar/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus, Order } from "@/types/order";
import { format } from "date-fns";
import Link from "next/link";
import { Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/app/service/orderService";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const pageSize = 10;

  const { data, isLoading } = useAdminOrders({
    page: currentPage,
    limit: pageSize,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const queryClient = useQueryClient();
  const updateStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: number;
      status: OrderStatus;
    }) => orderService.updateStatus(orderId, { status }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setUpdatingOrderId(null);
    },
    onError: () => {
      toast.error("Failed to update status");
      setUpdatingOrderId(null);
    },
  });

  const orders = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;
  const total = data?.meta?.total || 0;

  const getStatusBadgeColor = (status: OrderStatus) => {
    const colors = {
      [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-300",
      [OrderStatus.PAID]: "bg-green-100 text-green-800 border-green-300",
      [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-800 border-blue-300",
      [OrderStatus.SHIPPED]: "bg-purple-100 text-purple-800 border-purple-300",
      [OrderStatus.DELIVERED]: "bg-green-100 text-green-800 border-green-300",
      [OrderStatus.CANCELED]: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status];
  };

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">
            Manage all orders across the platform ({total} total)
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as OrderStatus | "ALL");
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-50">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Orders</SelectItem>
                  <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={OrderStatus.PAID}>Paid</SelectItem>
                  <SelectItem value={OrderStatus.PROCESSING}>
                    Processing
                  </SelectItem>
                  <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                  <SelectItem value={OrderStatus.DELIVERED}>
                    Delivered
                  </SelectItem>
                  <SelectItem value={OrderStatus.CANCELED}>
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-25">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: Order) => {
                    const totalPrice = parseFloat(order.totalPrice);

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-semibold">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.user?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          <div className="text-xs text-gray-400">
                            {format(new Date(order.createdAt), "HH:mm")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {order.items.length} item(s)
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-gray-900">
                            Rp{" "}
                            {new Intl.NumberFormat("id-ID").format(totalPrice)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`border ${getStatusBadgeColor(order.status)}`}
                            variant="outline"
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {updatingOrderId === order.id && (
                              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            )}
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                handleStatusChange(order.id, value as OrderStatus)
                              }
                              disabled={
                                updatingOrderId === order.id ||
                                order.status === OrderStatus.CANCELED ||
                                order.status === OrderStatus.DELIVERED
                              }
                            >
                              <SelectTrigger className="w-35">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={OrderStatus.PENDING}>
                                  Pending
                                </SelectItem>
                                <SelectItem value={OrderStatus.PAID}>
                                  Paid
                                </SelectItem>
                                <SelectItem value={OrderStatus.PROCESSING}>
                                  Processing
                                </SelectItem>
                                <SelectItem value={OrderStatus.SHIPPED}>
                                  Shipped
                                </SelectItem>
                                <SelectItem value={OrderStatus.DELIVERED}>
                                  Delivered
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/order/status/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
