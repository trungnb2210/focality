import type { Metadata } from "next";
import "./globals.css";

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
        <body className="flex justify-center items-center
                            min-h-screen" style={{ fontSize: '20px' }}>
            {children}
        </body>
    </html>
  );
}
