import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Libro",
  description: "Libro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === 'production';
  const ErudaProvider = !isProduction
    ? dynamic(() => import("../components/Eruda").then((c) => c.ErudaProvider), { ssr: true })
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={inter.className}>
          <ErudaProvider>
            <MiniKitProvider>
              <>{children}</>
            </MiniKitProvider>
          </ErudaProvider>
        </body>
      </NextAuthProvider>
    </html>
  );
}
