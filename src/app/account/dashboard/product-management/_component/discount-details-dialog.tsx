import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Product } from "./columns";

interface DiscountDetailsProps {
  discount: NonNullable<Product["discount"]>;
  children: React.ReactNode;
}

export function DiscountDetailsDialog({ discount, children }: DiscountDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discount Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Type</p>
              <p className="text-sm capitalize">{discount.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Value</p>
              <p className="text-sm">
                {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Duration</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm">
                  {new Date(discount.startDate!).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="text-sm">
                  {new Date(discount.endDate!).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}