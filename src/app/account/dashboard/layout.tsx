import { ReactNode } from "react";
import  DashboardNewLayout  from "./new-dashboard-layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminAuthCheck from "@/components/admin-auth-check/Index";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="space-y-10">
      <TooltipProvider>
          {/* <AdminAuthCheck> */}
            <DashboardNewLayout>
              <main className="px-2 md:px-10 py-2 md:py-10 bg-gray-100 min-h-screen">   
                {children}
              </main>
            </DashboardNewLayout>
          {/* </AdminAuthCheck> */}
      </TooltipProvider>
    </section>
  );
}
