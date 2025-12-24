import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { imageGrid } from "./data";
import Image from "next/image";
import { v4 } from "uuid";

const HeroSection = () => {
  // * TODO: Add more carousel items component, min number of slides should be 3. 
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>
          <main className="h-[100vh] lg:[80vh] rounded-md bg-slate-50 flex flex-col  md:grid grid-cols-2 md:gap-10 px-12">
            {/* left side */}
            <section className="h-full flex flex-col justify-center items-start  gap-1">
              <h1 className="text-4xl font-semibold max-w-[400px] font-sans">
                Discover the latest collections <br />
                From our top designers
              </h1>
              <p className="text text-gray-500">
                Looking to change your look, <br /> Explore our carefully
                selected products
              </p>
            </section>
            {/* right side */}
            <section className="flex flex-col justify-center h-[80vh] bg-blacky">
              <section className="grid grid-cols-3 h-[60%]y gap-5">
                {/* image grid */}
                {imageGrid.map((img) => (
                  <Image
                    src={img}
                    height={100}
                    width={100}
                    alt="hero-image"
                    key={v4()}
                    className="w-full h-full object-cover rounded-md"
                  />
                ))}
              </section>
            </section>
          </main>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
export default HeroSection;
