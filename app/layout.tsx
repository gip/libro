import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Libro",
  description: "A protocol to protect and preserve human-created texts, stories, novels, publications, articles, and pictures.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === 'production';
  const enableEruda = process.env.ENABLE_ERUDA === 'true';
  
  const ErudaProvider = !isProduction && enableEruda
    ? dynamic(() => import("../components/Eruda").then((c) => c.ErudaProvider), { ssr: true })
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={inter.className}>
          <ErudaProvider>
            <MiniKitProvider>
              <div className="min-h-screen flex flex-col">{children}</div>
            </MiniKitProvider>
          </ErudaProvider>
        </body>
      </NextAuthProvider>
    </html>
  );
}
