"use client";

import { LoginForm } from "@/components/login-form";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

export default function Page() {
  // const user = useUserStore((state) => state.user);
  // const route = useRouter();

  // // console.log("Token:", user);

  // if (user !== null) {
  //   // If the user is authenticated and tries to access the auth page, redirect them to the previous page
  //   route.back();
  //   return null;
  // }
  // If the user is not authenticated, render the login form
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
