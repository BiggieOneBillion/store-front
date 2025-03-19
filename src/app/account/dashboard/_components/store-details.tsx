import { RevenueCard } from "./cards/revenue-card";
import { OrdersCard } from "./cards/orders-card";
import { ProductsCard } from "./cards/products-card";
import { CustomersCard } from "./cards/customers-card";
import { RecentOrders } from "./recent-orders";
import { RecentProducts } from "./recent-products";

const StoreDetails = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RevenueCard />
        <OrdersCard />
        <ProductsCard />
        <CustomersCard />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentOrders />
        <RecentProducts />
      </div>
    </div>
  );
};

export default StoreDetails;