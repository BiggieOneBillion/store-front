"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns, type Order } from "./columns";
import { DataTable } from "./data-table";

const orders: Order[] = [
  {
    id: "1",
    customer: "Liam Johnson",
    email: "liam@example.com",
    type: "Sale",
    status: "Fulfilled",
    date: "2023-06-23",
    amount: 250.0,
    products: [
      { name: "Product A", quantity: 2, price: 100 },
      { name: "Product B", quantity: 1, price: 50 },
    ],
  },
  {
    id: "2",
    customer: "Olivia Smith",
    email: "olivia@example.com",
    type: "Refund",
    status: "Declined",
    date: "2023-06-24",
    amount: 150.0,
    products: [{ name: "Product C", quantity: 1, price: 150 }],
  },
  {
    id: "3",
    customer: "Noah Williams",
    email: "noah@example.com",
    type: "Subscription",
    status: "Fulfilled",
    date: "2023-06-25",
    amount: 350.0,
    products: [{ name: "Product D", quantity: 1, price: 350 }],
  },
  {
    id: "4",
    customer: "Emma Brown",
    email: "emma@example.com",
    type: "Sale",
    status: "Fulfilled",
    date: "2023-06-26",
    amount: 450.0,
    products: [
      { name: "Product E", quantity: 3, price: 100 },
      { name: "Product F", quantity: 1, price: 150 },
    ],
  },
  {
    id: "5",
    customer: "James Davis",
    email: "james@example.com",
    type: "Sale",
    status: "Fulfilled",
    date: "2023-06-27",
    amount: 200.0,
    products: [{ name: "Product G", quantity: 2, price: 100 }],
  },
];

export default function RecentOrderTableView() {
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={orders} />
      </CardContent>
    </Card>
  );
}
