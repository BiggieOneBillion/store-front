import { DashboardSkeleton } from "@/components/global/skeletons";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardSkeleton />
    </div>
  );
}
