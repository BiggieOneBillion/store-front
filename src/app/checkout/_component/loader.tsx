import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  loaderText?: string;
  condition: boolean;
};

const Loader = ({ loaderText = "Processing", condition }: Props) => {
  return (
    <>
      {condition && (
        <section className="fixed inset-0 text-white   flex justify-center items-start">
          <section className=" bg-black -mt-5 px-10 py-2 flex items-center justify-center gap-2 border rounded-lg">
            <span>
              <Loader2 className="animate-spin" size={17} />
            </span>
            <p>{loaderText}</p>
          </section>
        </section>
      )}
    </>
  );
};

export default Loader;
