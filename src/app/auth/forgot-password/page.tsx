"use client";
import { useState } from "react";
import ForgotPasswordForm from "./_component/forgot-password-form";
import Link from "next/link";
import { Store } from "lucide-react";

export default function ForgotPasswordPage() {
  const [showResetPassword, setShowResetPassword] = useState(true);
  return (
    <section className="h-screen flex items-center justify-center">
      <section className="space-y-5 translate-y-[-50%]y">
        <section className="space-y-1">
          <div className="flex items-center justify-center">
            <Link href={"/"}>
              <h1 className="font-medium text-xs hover:text-gray-800 duration-150 text-gray-400 uppercase flex items-center gap-1">
                <Store size={16} />
                <span className="font-semibold">Multistore Store</span>
              </h1>
            </Link>
          </div>
          <h1 className="text-center font-medium text-lg text-black/90">
            FORGOT YOUR PASSWORD?
          </h1>
        </section>
        <section className="px-10 py-3 rounded-md bg-zinc-100">
          <ForgotPasswordForm />
        </section>
      </section>
    </section>
  );
}
