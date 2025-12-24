import ProductsTableView from "./product-table-view";

export const description =
  "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";

export function ProductManagementView() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40y ">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14y">
        <main className="grid bg-blue-600y flex-1 items-start gap-4 p-4y sm:px-6 sm:py-0 md:gap-8 w-full overflow-auto">
          <ProductsTableView />
        </main>
      </div>
    </div>
  );
}
