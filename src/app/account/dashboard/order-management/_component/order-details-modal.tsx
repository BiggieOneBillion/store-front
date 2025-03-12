import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { z } from "zod"

const orderSchema = z.object({
  id: z.string(),
  buyer: z.string().min(1, "Buyer ID is required"),
  items: z.array(
    z.object({
      product: z.string().min(1, "Product ID is required"),
      store: z.string().min(1, "Store ID is required"),
      quantity: z.number().int().positive("Quantity must be a positive integer"),
      price: z.number().positive("Price must be a positive number"),
      variant: z.object({
        name: z.string().optional(),
        option: z.string().optional(),
      }),
    }),
  ),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  shippingAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  subtotal: z.number().positive("Subtotal must be a positive number"),
  shippingCost: z.number().positive("Shipping cost must be a positive number"),
  tax: z.number().positive("Tax must be a positive number"),
  total: z.number().positive("Total must be a positive number"),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
})

export type Order = z.infer<typeof orderSchema>



type OrderDetailsModalProps = {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsModal({ order, open, onOpenChange }: OrderDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Order Details - {order.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>
                        {item.variant.name} - {item.variant.option}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Buyer Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Name: {order.buyer}</p>
                <p>Email: {order.buyer}@example.com</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p>Order Date: {order.createdAt.toLocaleDateString()}</p>
                <p>
                  Status: <Badge>{order.status}</Badge>
                </p>
              </div>
              <div>
                <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
                <p>Shipping: ${order.shippingCost.toFixed(2)}</p>
                <p>Tax: ${order.tax.toFixed(2)}</p>
                <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

