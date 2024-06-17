import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StrictMode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Focality",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={`${inter.className} flex justify-center items-center
                            min-h-screen`}>
            {children}
        </body>
    </html>
  );
}
