import { Banknote, Barcode } from "lucide-react";
import { ReactNode } from "react";
import StoreOverviewCard from "./store-overview-card";
import { v4 } from "uuid";
import RecentOrderTableView from "./recent-order-table/recent-order-table-view";

type cardData = {
  title: string;
  description: string;
  icon: ReactNode;
  amount: string;
}[];

const cardInfo: cardData = [
  {
    title: "Total Reveune",
    description: "+20.1% from last month",
    amount: "$12,000",
    icon: <Banknote />,
  },
  {
    title: "Total Value Of Products",
    description: "+20.1% from last month",
    amount: "$120,000",
    icon: <Banknote />,
  },
  {
    title: "Total Number Of Products",
    description: "+20.1% from last month",
    amount: "3,000",
    icon: <Barcode />,
  },
];

const DashboardStoreView = () => {
  return (
    <section className="space-y-10">
      {/* overview cards */}
      <section className="w-full grid grid-cols-4 gap-5">
        {cardInfo.map((card) => (
          <StoreOverviewCard
            key={v4()}
            amount={card.amount}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </section>
      {/* store details */}
      <section className="space-y-5">
        <RecentOrderTableView />
      </section>
    </section>
  );
};
export default DashboardStoreView;
