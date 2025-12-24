"use client";

import { useUserStore } from "@/store/user-store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { hydrate } from "@tanstack/react-query";

export default function AuthCheckerPage() {
  const { hasHydrated, user, clearUser } = useUserStore();
  const route = useRouter();

  const [isChecked, setIsChecked] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Handles logout and cookie clearing
  const handleLogout = async () => {
    try {
      await fetch("/api/clear-cookies-token", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      clearUser();
      route.replace("/");
      toast.success("Bye bye");
      setIsDone(true);
      setIsChecked(false);
    } catch (error: any) {
      toast.error(error.message || "Failed To Logout");
    }
  };

  useEffect(() => {
    if (!isChecked) {
      setTimeout(() => {
        setIsChecked(true);
      }, 1000);
    }
  }, []);

  // useEffect(() => {
  //   if (!hasHydrated) return;

  //   if (user && Object.keys(user).length > 0) {
  //     // If user is authenticated, go back
  //     route.back();
  //   } else {
  //     // If not authenticated, clear everything and go to /auth
  //     handleLogout().finally(() => {
  //       route.replace("/auth");
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [hasHydrated, user]);

  // // console.log("user", user, "HTYDRAYED", hasHydrated);

  if (!isChecked && isDone) {
    route.replace("/");
    return null;
  }

  if (!isChecked) {
    return (
      <p className="mt-2 flex items-center gap-2">
        <Loader2 size={16} className="animate-spin" />
        <span>Loading...</span>
      </p>
    );
  }

  if (isChecked) {
    if (user && Object.keys(user).length > 0) {
      // If user is authenticated, go back
      route.replace("/");
      toast("DONE HERE!!----");
    } else {
      // If not authenticated, clear everything and go to /auth
      handleLogout();
    }
  }

  // Optionally, show nothing or a spinner while redirecting
  return null;
}
