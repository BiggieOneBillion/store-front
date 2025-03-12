import HeroSection from "./hero-section";
import { LatestProduct } from "./latest-product";

const HomeView = () => {
  return (
    <section className="flex flex-col gap-10">
      <HeroSection />
      <LatestProduct />
    </section>
  );
};
export default HomeView;
