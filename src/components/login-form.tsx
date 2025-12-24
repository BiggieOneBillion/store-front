"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Store } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { IRegister } from "@/services/api/auth";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { register, handleSubmit } = useForm<IRegister>();

  const { login, loginError, isLoggingIn, loginToBackend } = useAuth();

  const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();

  const handleOnSubmit = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await loginToBackend(values);
      // // console.log("RESPONSE", response.data.token);
      setUser({
        id: response.data.user.id,
        name: response.data.user.name,
        role: response.data.user.role,
        email: response.data.user.email,
        token: response.data.token,
        refreshToken: response.data.accessToken,
      });

      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      toast.error(`Error message ${loginError?.message}`);
    }
  };

  return (
    <div
      className={cn("flex flex-col items-center gap-6", className)}
      {...props}
    >
      <Link href={"/"}>
        <h1 className="flex items-center gap-2">
          <Store size={16} />
          <span>MULTISTORE</span>
        </h1>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
