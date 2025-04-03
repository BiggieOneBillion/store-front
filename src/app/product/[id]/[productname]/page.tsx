import ProductDetails from "@/app/_component/home/product-details";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string; productname: string }>;
}) {
  const { id } = await params;
  // console.log(id);
  return <ProductDetails id={id} />;
}
