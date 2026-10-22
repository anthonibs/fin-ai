import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TooltipProvider } from "./_components/ui/tooltip";
import Header from "./_layout/header/header";

const mulish = Mulish({
  variable: "--font-mulish",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finance IA",
  description: "Finance IA application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <ClerkProvider
        afterSignOutUrl="/login"
        appearance={{
          baseTheme: dark,
        }}
      >
        <body className={`${mulish.className} dark relative h-screen antialiased`}>
          <Header />

          <TooltipProvider delayDuration={200}>
            <main className="container mx-auto -my-2 h-[calc(100vh-60px)] py-6">{children}</main>
          </TooltipProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
