import ShopByCategory from "./_component/shop-by-category";

export default async function ShopByCategoryPage({
  params,
}: {
  params: Promise<{ categories: string }>;
}) {
  const { categories } = await params;
  return <ShopByCategory categories={categories} />;
}
