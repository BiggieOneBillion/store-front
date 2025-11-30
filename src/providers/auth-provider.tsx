import useUser from "@/hooks/useUser";
import { useUserStore } from "@/store/user-store";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
  // Here you can implement authentication logic, such as checking tokens or user state
  const token = useUserStore().user!.token || "";
  const path = usePathname();
  const route = useRouter();

  if (token && path === "/auth") {
    // If the user is authenticated and tries to access the auth page, redirect them to the previous page
    route.back();
  }

  return children;
};
