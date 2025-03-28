import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import  DashboardNewLayout  from "./new-dashboard-layout";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="space-y-10">
      <TooltipProvider>
        <DashboardNewLayout>
          <main className="px-2 md:px-10 py-2 md:py-10 bg-gray-100 min-h-screen">   
            {children}
          </main>
        </DashboardNewLayout>
      </TooltipProvider>
    </section>
  );
}
