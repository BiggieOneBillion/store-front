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

  const { createDiscountError, createDiscountFn, isCreatingDiscount } =
    useDiscount();
  const { user } = useUserStore();

  const queryClient = useQueryClient();

  async function onSubmit(values: DiscountFormValues) {
    console.log(values);
    try {
      await createDiscountFn({
        token: user?.token!,
        data: values,
      });

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

  return (
    <div className="grid grid-cols-2 gap-6">
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Create Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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

                <Button type="submit" disabled={isCreatingDiscount}>
                  {isCreatingDiscount
                    ? "...Creating discount"
                    : "Create Discount"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Active Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <DiscountsTable form={form} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
