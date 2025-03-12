import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/user-store";
import { Loader2, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const Logout = () => {
  const { hasHydrated, user } = useUserStore();

  const { logOut, isLoggingOut, logoutError } = useAuth();

  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await logOut(user?.refreshToken!);
      clearUser();
      toast.success("Logged Out");
    } catch (error) {
      toast.error(`Failed To Logout, ${logoutError?.message}`);
    }
  };

  if (!hasHydrated) {
    return (
      <p className="mt-2">
        <Loader2 size={16} className="animate-spin" />
      </p>
    );
  }

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
