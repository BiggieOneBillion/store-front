"use client";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/user-store";
import { set } from "date-fns";
import { Loader2, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const Logout = () => {
  const { hasHydrated, user } = useUserStore();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: user?.refreshToken,
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed To Logout");
      }
      clearUser();
      toast.success("Logged Out");
    } catch (error: any) {
      toast.error(error.message || "Failed To Logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!hasHydrated) {
    return (
      <p className="mt-2">
        <Loader2 size={16} className="animate-spin" />
      </p>
    );
  }

  // // console.log("user", user);

  return (
    <>
      {user && user.id ? (
        <button
          className={`mt-2y p-0 flex items-center text-sm gap-3 bg-slate-300 px-2 py-1 border rounded-md disabled:bg-slate-100`}
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          <span>log out</span>
          {isLoggingOut ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LogOut size={16} />
          )}
        </button>
      ) : (
        <Link
          href={"/auth"}
          className={`mt-2y p-0 flex items-center text-sm gap-3 bg-slate-300 px-2 py-1 border rounded-md`}
        >
          <span>Log In</span>
          <LogIn size={16} />
        </Link>
      )}
    </>
  );
};
export default Logout;
