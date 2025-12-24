"use client";

import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Application Error</CardTitle>
              </div>
              <CardDescription>
                A critical error occurred. Please try refreshing the page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error.message && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                  <p className="text-sm text-destructive">{error.message}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={reset} variant="default">
                  Try Again
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
