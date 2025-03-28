"use client";
import React, { ReactNode } from "react";
import { Header } from "./_new-dashboard-components/header";
import { SidebarNav } from "./_new-dashboard-components/sidebar-nav";

const NewDashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="md:pl-10">
      <header>
        <section className="pt-5">
          <Header />
        </section>
        <SidebarNav />
      </header>
      {children}
    </main>
  );
};

export default NewDashboardLayout;
