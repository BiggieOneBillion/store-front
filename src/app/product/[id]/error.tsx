"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Failed to Load Product</CardTitle>
            </div>
            <CardDescription>
              We couldn't load this product. It may have been removed or there was a problem with the server.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error.message && (
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                <p className="text-sm text-destructive">{error.message}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={reset} variant="default" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/shop">
                  <Home className="h-4 w-4" />
                  Browse Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
