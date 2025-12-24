import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers } from "@/services/api/user";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

type Customer = {
  role: string;
  isEmailVerified: boolean;
  name: string;
  email: string;
  phoneNumber: string;
  id: string;
};

export function CustomersCard() {
  const { user } = useUserStore();
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["customers-card"],
    queryFn: async () => await getAllUsers(user?.token!),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-8 w-24 rounded" />
          <div className="animate-pulse bg-muted h-4 w-32 rounded mt-2" />
        </CardContent>
      </Card>
    );
  }

  const totalCustomers = customers?.length || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalCustomers}</div>
        <p className="text-xs text-muted-foreground">
          Total registered customers
        </p>
      </CardContent>
    </Card>
  );
}