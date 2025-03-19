"use client";
import { getAllOrders } from "@/services/api/order";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { OrderTableDisplay } from "./order-table-display";

const OrderTable = () => {
  const { user } = useUserStore();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["order-table"],
    queryFn: async () => await getAllOrders(user?.token!),
  });

  if (isLoading) {
    return <div>...Loading</div>;
  }

  if (!orders) {
    return <div>No orders found</div>;
  }

  console.log(orders)

  return (
    <div className="bg-white px-5 py-5 rounded-md">
      <OrderTableDisplay orders={orders} />
    </div>
  );
};

export default OrderTable;
