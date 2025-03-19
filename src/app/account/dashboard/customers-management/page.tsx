"use client";

import { getAllUsers } from "@/services/api/user";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import CustomersTable from "./_components/customers-table";

type Customer = {
  role: string;
  isEmailVerified: boolean;
  name: string;
  email: string;
  phoneNumber: string;
  id: string;
};

export default function CustomersPage() {
  const { user } = useUserStore();
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["customers-table-info"],
    queryFn: async () => await getAllUsers(user?.token!),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  console.log(customers)

  if (!customers) {
    return <div>No customers found</div>;
  }

  // Transform the data to match the CustomersTable props type
  const formattedCustomers = customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    isEmailVerified: customer.isEmailVerified,
    phoneNumber: customer.phoneNumber
  }));

  return <CustomersTable customersData={formattedCustomers} />;
}
