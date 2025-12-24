import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";
import Image from "next/image";

type Variant = {
  options: string[];
  _id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
};

type Product = {
  inventory: {
    lowStockThreshold: number;
    quantity: number;
    sku: string;
  };
  images: string[];
  status: string;
  rating: number;
  totalRatings: number;
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice: number;
  variants: Variant[];
  store: string | null;
  specifications: any[];
  id: string;
};

export function RecentProducts() {
  const { user } = useUserStore();
  const { data: products, isLoading } = useQuery({
    queryKey: ["recent-products"],
    queryFn: async () => await getAllStoreProducts(user?.token!),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= threshold) return "low-stock";
    return "in-stock";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.slice(0, 10).map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={32}
                        height={32}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-muted" />
                    )}
                    <span>{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.inventory.quantity}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      getStockStatus(
                        product.inventory.quantity,
                        product.inventory.lowStockThreshold
                      ) === "in-stock"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {getStockStatus(
                      product.inventory.quantity,
                      product.inventory.lowStockThreshold
                    )}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
