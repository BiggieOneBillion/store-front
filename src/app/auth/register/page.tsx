import Image from "next/image";
import RegisterForm from "./_component/register-form";
import img from "../../../../public/fashion shop-rafiki.svg"


export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <section className="grid grid-cols-2">
      <section className="w-full h-full bg-red-500y flex items-center justify-center">
          <Image src={img} alt="register-form" className="h-full" />
        </section>
        <div className="w-full max-w-md flex items-center justify-center">
          <RegisterForm />
        </div>
      </section>
    </div>
  );
}
