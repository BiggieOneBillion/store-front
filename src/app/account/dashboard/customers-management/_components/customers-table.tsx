"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  MoreHorizontal,
  Trash2,
  Search,
  UserPlus,
  Mail,
  Phone,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { customersData } from "../_data/customers-data";

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export type Props = {
  customersData: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    phoneNumber: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  }[];
};

export default function CustomersTable({ customersData }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customersData.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm)
  );

  const handleEdit = (id: string) => {
    console.log(`Edit customer with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log(`Delete customer with ID: ${id}`);
    // Implement delete functionality
  };

  const handleSendEmail = (email: string) => {
    console.log(`Send email to: ${email}`);
    // Implement email functionality
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start gap-5 md:gap-0 md:flex-row md:items-center justify-between">
        {/* <CardTitle>Customers</CardTitle> */}
        <section>
          <CardTitle>Customers</CardTitle>
          <CardDescription>This is a list of your customers and their information</CardDescription>
        </section>
        <div className="flex flex-col items-start md:flex-row  md:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
          <Button variant="outline" className="hidden">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table className="text-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  {customer.address ? (
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {customer?.address?.street}, {customer.address.city},{" "}
                        {customer?.address?.state}, {customer.address.country},{" "}
                        {customer.address?.zipCode}
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <div className="max-w-[200px] truncate">Nil</div>
                    </TableCell>
                  )}
                  <TableCell>
                    {customer.isEmailVerified ? (
                      <Badge className="bg-green-500">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Unverified</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(customer.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSendEmail(customer.email)}
                      >
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEdit(customer.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSendEmail(customer.email)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
