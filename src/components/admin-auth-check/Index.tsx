"use client"
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/user-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const AdminAuthCheck = ({children}: {children: React.ReactNode}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);

    const userInfo = useUserStore((state) => state.user);

    const checkUser = async () => {
        setIsLoading(true);
        try {
           const user = await axios.get(`/api/users/${userInfo?.id}/role`); //! endpoint not functional now.
           if(user.data.role !== "admin") {
            router.replace("/");
           }
           setCount(count + 1);
        } catch (error) {
            router.replace("/");
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        // run at 1mins interval
        const interval = setInterval(() => {
            checkUser();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return isLoading || count < 1 ? <div>Loading...</div> : children;
}

export default AdminAuthCheck