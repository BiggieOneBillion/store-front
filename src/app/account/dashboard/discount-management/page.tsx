"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BasicDetailsForm } from "./components/basic-details-form";
import { ValidityPeriodForm } from "./components/validity-period-form";
import { LimitsForm } from "./components/limits-form";
import { ConditionsForm } from "./components/conditions-form";
import { discountSchema, type DiscountFormValues } from "./types";
import { DiscountsTable } from "./components/discounts-table";
import { useDiscount } from "@/hooks/useDiscount";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Add these imports at the top
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

export default function DiscountManagementPage() {
  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      type: "percentage",
      active: true,
      usageLimit: {
        perCustomer: 1,
        total: 100,
      },
      conditions: {
        categories: [],
        products: [],
        excludedProducts: [],
      },
      applicableTo: "all",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string>("");

  const {
    createDiscountError,
    createDiscountFn,
    isCreatingDiscount,
    updateDiscountError,
    updateDiscountFn,
  } = useDiscount();
  const { user } = useUserStore();

  const queryClient = useQueryClient();

  async function onSubmit(values: DiscountFormValues) {
    // console.log(values);
    try {
      if (isEditing) {
        const { code, ...others } = values;
        await updateDiscountFn({
          token: user?.token!,
          id: editingId,
          data: others,
        });
        toast.success("Discount updated successfully");
        setIsEditing(false);
        setEditingId("");
      } else {
        await createDiscountFn({
          token: user?.token!,
          data: values,
        });
        toast.success("Discount created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["discount-table"] });

      form.reset({
        conditions: {
          categories: [],
          products: [],
          excludedProducts: [],
        },
      });
    } catch (error) {
      console.error(error);
      console.log("ERROR IN POSTING", createDiscountError);
      toast(`Error is : ${createDiscountError?.message}`);
    }
  }

  // Add new state for dialog
  const [open, setOpen] = useState(false);

  // Create a reusable DiscountForm component
  const DiscountForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicDetailsForm form={form} />
        <ValidityPeriodForm form={form} />
        <LimitsForm form={form} />
        <ConditionsForm form={form} />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Enable or disable this discount
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="disabled:bg-slate-400"
          disabled={isCreatingDiscount}
        >
          {isCreatingDiscount
            ? "...Creating discount"
            : isEditing
            ? "Update Discount"
            : "Create Discount"}
        </Button>
      </form>
    </Form>
  );

  // Add effect to handle dialog open on edit only for mobile
  useEffect(() => {
    if (isEditing && window.innerWidth < 768) {
      setOpen(true);
    }
  }, [isEditing]);

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex flex-col gap-5 md:gap-0 md:flex-row justify-between items-start md:items-center mb-4">
          <section>
            <h2 className="text-lg font-medium">Discounts</h2>
            <p className="text-sm text-gray-500">You can manage your discounts here.</p>
          </section>
          <section className="md:hidden">
            <Dialog
              open={open}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) {
                  setIsEditing(false);
                  setEditingId("");
                  form.reset({
                    type: "percentage",
                    active: true,
                    usageLimit: {
                      perCustomer: 1,
                      total: 100,
                    },
                    conditions: {
                      categories: [],
                      products: [],
                      excludedProducts: [],
                    },
                    applicableTo: "all",
                    startDate: new Date(),
                    endDate: new Date(
                      new Date().setDate(new Date().getDate() + 30)
                    ),
                  });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Discount
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Edit Discount" : "Create Discount"}
                  </DialogTitle>
                </DialogHeader>
                <DiscountForm />
              </DialogContent>
            </Dialog>
          </section>
        </div>
        <Card>
          <CardContent>
            <DiscountsTable
              setIsEditing={setIsEditing}
              setEditingId={setEditingId}
              form={form}
            />
          </CardContent>
        </Card>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? "Edit Discount" : "Create Discount"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DiscountForm />
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Active Discounts</CardTitle>
            </CardHeader>
            <CardContent>
              <DiscountsTable
                setIsEditing={setIsEditing}
                setEditingId={setEditingId}
                form={form}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
