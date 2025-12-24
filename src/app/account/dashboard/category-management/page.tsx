"use client";

import { MobileView } from "./_component/mobile-view";
import { DesktopView } from "./_component/desktop-view";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";

export default function CategoryManagement() {
  const categoryManagement = useCategoryManagement();

  return (
    <div className="container mx-auto pb-10">
      <MobileView categoryManagement={categoryManagement} />
      <DesktopView categoryManagement={categoryManagement} />
    </div>
  );
}
