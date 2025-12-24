import { ListOrderedIcon } from "lucide-react";
import OrderTable from "./order-table";

const OrderManagementView = () => {
  return (
    <section className="space-y-5 md:space-y-10">
      <div>
        <h3 className="font-medium text-lg text-black/80 ">Order Management</h3>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <ListOrderedIcon size={16} />
          <span>Manage all your orders</span>
        </p>
      </div>
      <OrderTable />
    </section>
  );
};
export default OrderManagementView;
