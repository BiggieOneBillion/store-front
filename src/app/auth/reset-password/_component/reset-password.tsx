"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import { Store } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPassword() {
  const route = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
 

  useEffect(() => {
    if (!params.get("token")) {
      route.replace("/");
    }
  }, [params]);

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
            RESET YOUR PASSWORD
          </h1>
        </section>
        <section className="px-10 py-3 rounded-md bg-zinc-100">
          <ResetPasswordForm token={token!} />
        </section>
      </section>
    </section>
  );
}
