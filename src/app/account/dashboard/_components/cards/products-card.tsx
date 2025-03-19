import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertCircle, CheckCircle2, Link } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";

type Product = {
  inventory: {
    quantity: number;
    lowStockThreshold: number;
  };
};

type ViewType = "low-stock" | "out-of-stock" | null;

export function ProductsCard() {
  const { user } = useUserStore();
  const { data: products, isLoading } = useQuery({
    queryKey: ["recent-products"],
    queryFn: async () => await getAllStoreProducts(user?.token!),
  });
  const [viewType, setViewType] = useState<ViewType>(null);
  const totalProducts = products?.length || 0;
  const lowStockProducts = products?.filter(
    (product) => product.inventory.quantity <= product.inventory.lowStockThreshold
  ).length || 0;
  const outOfStockProducts = products?.filter(
    (product) => product.inventory.quantity === 0
  ).length || 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-8 w-24 rounded" />
          <div className="animate-pulse bg-muted h-4 w-32 rounded mt-2" />
        </CardContent>
      </Card>
    );
  }

  
  const filteredProducts = viewType === "low-stock" 
    ? products?.filter(p => p.inventory.quantity <= p.inventory.lowStockThreshold && p.inventory.quantity > 0)
    : products?.filter(p => p.inventory.quantity === 0);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <div className="space-y-2 mt-4">
            {lowStockProducts > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-orange-500" />
                <button 
                  onClick={() => setViewType("low-stock")}
                  className="text-xs text-orange-500 font-medium hover:underline flex items-center gap-1"
                >
                  {lowStockProducts} low stock
                  <Link className="h-3 w-3" />
                </button>
              </div>
            )}
            {outOfStockProducts > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-red-500" />
                <button 
                  onClick={() => setViewType("out-of-stock")}
                  className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1"
                >
                  {outOfStockProducts} out of stock
                  <Link className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewType} onOpenChange={() => setViewType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {viewType === "low-stock" ? "Low Stock Products" : "Out of Stock Products"}
            </DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                {viewType === "low-stock" && (
                  <TableHead className="text-right">Threshold</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts?.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-right">{product.inventory.quantity}</TableCell>
                  {viewType === "low-stock" && (
                    <TableCell className="text-right">{product.inventory.lowStockThreshold}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
}