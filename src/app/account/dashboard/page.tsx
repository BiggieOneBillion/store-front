"use client";

import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import StoreDetails from "./_components/store-details";
import axios from "axios";
import { useRouter } from "next/navigation";
// import StoreSettingsView from "./store-settings/_component/store-settings-view";

const AdminDashboard = () => {
  const router = useRouter();
  //! TODO: Check if the user is indeed an admin before rendering this page
   const checkUser = async () => {
       const user = await axios.get("/api/auth/user");
       console.log(user.data);
       if(user.data.role !== "admin") {
           router.replace("/");
       }
           
   }
   useEffect(() => {
      
       checkUser();
   }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium tracking-tight">Store Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Manage your store details and settings
        </p>
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle>Store Management</CardTitle>
        </CardHeader> */}
        <CardContent className="py-10">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="details">Store Details</TabsTrigger>
              {/* <TabsTrigger value="settings">Store Settings</TabsTrigger> */}
            </TabsList>

            <TabsContent value="details">
              <StoreDetails />
            </TabsContent>

            {/* <TabsContent value="settings">
              <StoreSettingsView />
            </TabsContent> */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
