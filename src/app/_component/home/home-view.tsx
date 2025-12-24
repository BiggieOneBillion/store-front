import Link from "next/link";
import Categories from "./categories";
import HeroSection from "./hero-section";
import { FeaturedProduct } from "./featured-product";
import { LatestProducts } from "./latest-products";
import { Button } from "@/components/ui/button";

const HomeView = () => {
  return (
    <section className="flex flex-col gap-10">
      <HeroSection />
      <Categories />
      <FeaturedProduct />
      <LatestProducts />
      <div className="flex items-center justify-center">
        <Button>
          <Link href="/shop">View All Products</Link>
        </Button>
      </div>
    </section>
  );
};
export default HomeView;
