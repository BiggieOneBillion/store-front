import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_component/navbar";
import Footer from "./_component/footer";
import WhichLayout from "./_component/which-layout";
import { Providers } from "@/providers/providers";
import { Toaster } from "sonner";
import UserStatus from "./_component/user-status";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multi Store",
  description: "A multi-vendor e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <UserStatus>
            <WhichLayout>{children}</WhichLayout>
          </UserStatus>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
